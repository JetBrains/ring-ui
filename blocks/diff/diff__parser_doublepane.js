/**
 * @fileoverview Diff-data parser for double-paned mode of {@link DiffTool}.
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
  diffTool.ParserDoublePane = function() {};
  diffTool.inherit(diffTool.ParserDoublePane, diffTool.Parser);
  diffTool.addSingletonGetter(diffTool.ParserDoublePane);

  // todo(igor.alexeenko): datatype for line
  // todo(igor.alexeenko): datatype for line content

  /**
   * @override
   */
  diffTool.ParserDoublePane.prototype.availableLineTypes =
      diffTool.Parser.LineType.UNCHANGED |
      diffTool.Parser.LineType.DELETED |
      diffTool.Parser.LineType.ADDED |
      diffTool.Parser.LineType.MODIFIED;

  /**
   * @override
   */
  diffTool.ParserDoublePane.prototype.parseUnchangedLines = function(lines,
      change, lineOriginal, lineModified) {
    return [this.getLine(lineOriginal,
        lineOriginal + lines.length,
        lineModified, lineModified + lines.length,
        diffTool.Parser.LineType.UNCHANGED)];
  };

  /**
   * @override
   */
  diffTool.ParserDoublePane.prototype.parseModifiedLines = function(
      linesOriginal, linesModified, change, lineOriginal, lineModified) {
    var rangesOriginal = this.parseLineRange_(linesOriginal, change.ranges,
        diffTool.Parser.CodeType.ORIGINAL);
    var rangesModified = this.parseLineRange_(linesModified, change.ranges,
        diffTool.Parser.CodeType.MODIFIED);

    var oldLines = change.oldLines || 0;
    var newLines = change.newLines || 0;

    var lineType = oldLines === 0 ? diffTool.Parser.LineType.ADDED :
        newLines === 0 ?
            diffTool.Parser.LineType.DELETED :
            diffTool.Parser.LineType.INLINE;

    var line = this.getLine(
        lineOriginal, lineOriginal + linesOriginal.length,
        lineModified, lineModified + linesModified.length,
        lineType,
        rangesOriginal,
        rangesModified);

    return [line];
  };

  /**
   * Parses lines according to information, given in range parameter. Sometimes,
   * one range can describe multiple lines. In this case we change current range
   * and call inline parser.
   * @param {Array.<string>} lines
   * @param {Array.<diffTool.Parser.InlineModification>} ranges
   * @param {diffTool.Parser.CodeType} codeType
   * @param {number} lineNumber
   * @return {Array.<Object>}
   * @private
   */
  diffTool.ParserDoublePane.prototype.parseLineRange_ = function(lines,
      ranges, codeType) {
    var output = [];

    var currentRange;
    var currentRangeIndex;

    var isOriginalCode = codeType === diffTool.Parser.CodeType.ORIGINAL;

    currentRangeIndex = 0;
    if (ranges) {
      currentRange = ranges[currentRangeIndex];
    }

    lines.forEach(function(line) {
      if (ranges) {
        var usedRanges = [];
        var lineCursor = 0;

        while (currentRangeIndex < ranges.length) {
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

        var lineContent = this.parseInlineChanges(line, usedRanges, codeType);
        output.push(lineContent);
      }
    }, this);

    return output;
  };

  /**
   * @override
   */
  diffTool.ParserDoublePane.prototype.parseInlineChanges = function(chars,
      ranges, type) {
    if (!ranges) {
      return null;
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

      var lineType =
          isUnchanged ? diffTool.Parser.LineType.UNCHANGED :
          isOriginalCode ?
              diffTool.Parser.LineType.DELETED :
              diffTool.Parser.LineType.ADDED;

      output.push(this.getLineContent(inlineCursor, inlineCursor + charsOffset,
          lineType));

      inlineCursor += charsOffset;
    }, this);

    return output;
  };

  /**
   * @param {number} topOriginal
   * @param {number} bottomOriginal
   * @param {number} topModified
   * @param {number} bottomModified
   * @param {diffTool.Parser.LineType} type
   * @param {Array.<Object>=} opt_rangesOriginal
   * @param {Array.<Object>=} opt_rangesModified
   * @return {Object}
   */
  diffTool.ParserDoublePane.prototype.getLine = function(topOriginal,
      bottomOriginal, topModified, bottomModified, type, opt_rangesOriginal,
      opt_rangesModified) {
    return {
      bottomModified: bottomModified,
      bottomOriginal: bottomOriginal,
      rangesOriginal: opt_rangesOriginal,
      rangesModified: opt_rangesModified,
      topModified: topModified,
      topOriginal: topOriginal,
      type: type
    };
  };

  /**
   * @param {number} from
   * @param {number} to
   * @param {diffTool.Parser.LineType} type
   * @return {Object}
   */
  diffTool.ParserDoublePane.prototype.getLineContent = function(from, to,
      type) {
    return {
      from: from,
      to: to,
      type: type
    };
  };
});
