/**
 * @fileoverview Parser for single-paned mode of DiffTool. Parser transforms
 * original JSON response from server to JSON with code injections
 * and marks of way, how exactly those line were modified. Maybe, in future
 * some of this interactions will be performed on the server-side.
 * @author igor.alexeenko (Igor Alekseyenko)
 */
 
define([
  'diff/diff__tools',
  'diff/diff__parser'
], function(diffTool) {
  /**
   * @constructor
   * @extends {diffTool.Parser}
   */
  diffTool.ParserSinglePane = function() {};
  diffTool.inherit(diffTool.ParserSinglePane, diffTool.Parser);
  diffTool.addSingletonGetter(diffTool.ParserSinglePane);

  /**
   * @typedef {{
   *   content: diffTool.ParserSinglePane.LineContent,
   *   lineOriginal: number,
   *   lineModified: number,
   *   type: diffTool.Parser.LineType
   * }}
   */
  diffTool.ParserSinglePane.Line = {};

  /**
   * @typedef {string|Array.<{
   *   content: string,
   *   type: diffTool.Parser.LineType
   * }>}
   */
  diffTool.ParserSinglePane.LineContent = {};

  /**
   * In single pane mode, even modified lines displays as deleted and then
   * inserted. If line is not needed it is folded.
   * @override
   */
  diffTool.ParserSinglePane.prototype.availableLineTypes =
      diffTool.Parser.LineType.UNCHANGED |
      diffTool.Parser.LineType.DELETED |
      diffTool.Parser.LineType.ADDED |
      diffTool.Parser.LineType.INLINE |
      diffTool.Parser.LineType.FOLDED;

  /**
   * @override
   */
  diffTool.ParserSinglePane.prototype.parseUnchangedLines = function(
      lines, change, lineOriginal, lineModified, opt_isLastChange) {
    var output = [];

    /**
     * @type {number}
     * @const
     */
    var CONTEXT_SIZE = 3;

    var folded = lines.slice(CONTEXT_SIZE, lines.length - CONTEXT_SIZE);
    var contextIntersection = lines.length - CONTEXT_SIZE * 2 - folded.length;
    var contextAfter = lines.slice(0, CONTEXT_SIZE);
    var contextBefore = lines.slice(-CONTEXT_SIZE - contextIntersection);

    if (lines.length <= CONTEXT_SIZE) {
      contextBefore = [];
    }

    if (lineOriginal === 0 && lineModified === 0) {
      contextBefore = lines.slice(-CONTEXT_SIZE);
      contextAfter = [];
      folded = [];
    }

    if (Boolean(opt_isLastChange)) {
      contextAfter = [];
      folded = [];
    }

    contextAfter.forEach(function(contextLine, i) {
      output.push(this.getLine(contextLine, lineOriginal + i, lineModified + i,
          diffTool.Parser.LineType.UNCHANGED));
    }, this);

    if (folded.length) {
      output.push(this.getLine('', null, null,
          diffTool.Parser.LineType.FOLDED));
    }

    lineOriginal += folded.length;
    lineModified += folded.length;

    contextBefore.forEach(function(contextLine, i) {
      output.push(this.getLine(contextLine, lineOriginal + i, lineModified + i,
          diffTool.Parser.LineType.UNCHANGED));
    }, this);

    return output;
  };

  /**
   * @override
   */
  diffTool.ParserSinglePane.prototype.parseModifiedLines = function(
      linesOriginal, linesModified, change, lineOriginal, lineModified) {
    var output = [];

    var originalLines = this.parseLineRange_(linesOriginal, change.ranges,
        diffTool.Parser.CodeType.ORIGINAL, lineOriginal);

    var modifiedLines = this.parseLineRange_(linesModified, change.ranges,
        diffTool.Parser.CodeType.MODIFIED, lineModified);

    // todo(igor.alexeenko): Find out, why does not work {Array.concat}.
    Array.prototype.push.apply(output, originalLines);
    Array.prototype.push.apply(output, modifiedLines);

    return output;
  };

  /**
   * Parses lines according to information, given in range parameter. Sometimes,
   * one range can describe multiple lines. In this case we change current range
   * and call inline parser.
   * @param {Array.<string>} lines
   * @param {Array.<diffTool.Parser.InlineModification>} ranges
   * @param {diffTool.Parser.CodeType} codeType
   * @param {number} lineNumber
   * @return {Array.<diffTool.Parser.OutputLine>}
   * @private
   */
  diffTool.ParserSinglePane.prototype.parseLineRange_ = function(lines,
      ranges, codeType, lineNumber) {
    var output = [];

    var currentRange;
    var currentRangeIndex;

    var isOriginalCode = codeType === diffTool.Parser.CodeType.ORIGINAL;
    var lineType = isOriginalCode ?
        diffTool.Parser.LineType.DELETED :
        diffTool.Parser.LineType.ADDED;

    currentRangeIndex = 0;
    if (ranges) {
      currentRange = ranges[currentRangeIndex];
    }

    lineNumber++;

    lines.forEach(function(line, i) {
      var originalNumber = isOriginalCode ? lineNumber + i : null;
      var modifiedNumber = isOriginalCode ? null : lineNumber + i;
      var lineContent;

      if (!ranges) {
        lineContent = line;
      } else {
        var usedRanges = [];
        var lineCursor = 0;

        while (currentRangeIndex <= ranges.length) {
          var usedSymbol = currentRange.chars ?
              'chars' :
              isOriginalCode ? 'oldChars' : 'newChars';

          lineCursor += currentRange[usedSymbol];

          if (lineCursor <= line.length) {
            usedRanges.push(currentRange);
            currentRange = ranges[++currentRangeIndex];

            if (!currentRange || lineCursor === line.length) {
              break;
            }
          } else {
            usedRanges.push(diffTool.createObject(
                usedSymbol, currentRange[usedSymbol] - (lineCursor -
                    line.length),
                'type', currentRange.type));

            if (lineCursor - line.length > 0) {
              currentRange = diffTool.createObject(
                  usedSymbol, lineCursor - line.length,
                  'type', currentRange.type);
            }

            break;
          }
        }

        lineContent = this.parseInlineChanges(line, usedRanges, codeType);
      }

      var parsedLine = this.getLine(lineContent, originalNumber, modifiedNumber,
          lineType);
      output.push(parsedLine);
    }, this);

    return output;
  };

  /**
   * @return {Array.<diffTool.ParserSinglePane.LineContent>}
   * @override
   */
  diffTool.ParserSinglePane.prototype.parseInlineChanges = function(chars,
      ranges, type) {
    if (!ranges) {
      return chars;
    }

    var output = [];
    var inlineCursor = 0;
    var isOriginalCode = (type === diffTool.Parser.CodeType.ORIGINAL);

    ranges.forEach(function(range) {
      var isUnchanged = range.type ===
          diffTool.Parser.ModificationType.UNCHANGED;
      var charsOffset =
          isUnchanged ? range.chars :
          isOriginalCode ? range.oldChars : range.newChars;

      var substr = chars.substr(inlineCursor, charsOffset);
      var lineType =
          isUnchanged ? diffTool.Parser.LineType.UNCHANGED :
          isOriginalCode ?
              diffTool.Parser.LineType.ADDED :
              diffTool.Parser.LineType.DELETED;

      output.push(this.getLineContent(substr, lineType));

      inlineCursor += charsOffset;
    }, this);

    return output;
  };

  /**
   * @param {string|diffTool.ParserSinglePane.LineContent} content
   * @param {number} lineOriginal
   * @param {number} lineModified
   * @param {diffTool.Parser.LineType} type
   * @return {diffTool.ParserSinglePane.Line}
   * @override
   */
  diffTool.ParserSinglePane.prototype.getLine = function(content,
      lineOriginal, lineModified, type) {
    if (typeof content === 'string') {
      content = diffTool.ParserSinglePane.removeEOL(content);
    }

    var line = /** @type {diffTool.ParserSinglePane.Line} */ ({
      content: content,
      lineOriginal: lineOriginal,
      lineModified: lineModified,
      type: diffTool.Parser.LineType.NULL
    });

    this.enableLineType(line, type, true);

    if (diffTool.ParserSinglePane.isLineContent(content)) {
      this.enableLineType(line, diffTool.Parser.LineType.INLINE, true);
    }

    return line;
  };

  /**
   * @param {string} content
   * @param {diffTool.Parser.LineType} type
   * @return {diffTool.ParserSinglePane.LineContent}
   * @override
   */
  diffTool.ParserSinglePane.prototype.getLineContent = function(content, type) {
    var lineContent = /** @type {diffTool.ParserSinglePane.LineContent} */ ({
      content: diffTool.ParserSinglePane.removeEOL(content),
      type: diffTool.Parser.LineType.NULL
    });

    this.enableLineType(lineContent, type, true);

    return lineContent;
  };

  // todo(igor.alexeenko): Pretty naive way to check if line is valid content.
  /**
   * Returns true if given object has type
   * {@code diffTool.ParserSinglePane.LineContent}.
   * @static
   * @param {*} content
   * @return {boolean}
   */
  diffTool.ParserSinglePane.isLineContent = function(content) {
    return Boolean(content instanceof Array);
  };

  /**
   * Removes EOL symbols from the end of the line to prevent errors
   * on output.
   * @static
   * @param {string} content
   * @return {string}
   */
  diffTool.ParserSinglePane.removeEOL = function(content) {
    return content.replace(diffTool.Parser.EOLSymbolRegex, '');
  };

  return diffTool.ParserSinglePane;
});
