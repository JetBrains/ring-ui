/**
 * @fileoverview Parser for single-paned mode of DiffTool. Parser transforms
 * original JSON response from server to JSON with code injections
 * and marks of way, how exactly those line were modified. Maybe, in future
 * some of this interactions will be performed on the server-side.
 * @author igor.alexeenko (Igor Alekseyenko)
 */
 
define(['diff/diff__tools', 'diff/diff__parser'], function(diffTool) {
  /**
   * @constructor
   * @extends {diffTool.Parser}
   */
  diffTool.ParserSinglePane = function() {};
  diffTool.inherit(diffTool.ParserSinglePane, diffTool.Parser);
  diffTool.addSingletonGetter(diffTool.ParserSinglePane);

  /**
   * Number of lines, which will be taken before and after changed code to
   * display changed code in context of file.
   * @type {number}
   * @const
   */
  diffTool.ParserSinglePane.CONTEXT_SIZE = 3;

  /**
   * @typedef {Array.<diffTool.SingleEditorController.BufferLine>}
   */
  diffTool.ParserSinglePane.Buffer = [];

  /**
   * @typedef {{
   *   codeType: diffTool.ParserSinglePane.LineType,
   *   line: string|Array.<diffTool.ParserSinglePane.BufferModifiedLine>,
   *   modifiedLineNumber: number?,
   *   originalLineNumber: number?
   * }}
   */
  diffTool.ParserSinglePane.BufferLine = {};

  /**
   * @typedef {{
   *   codeType: diffTool.ParserSinglePane.LineType,
   *   chars: string
   * }}
   */
  diffTool.ParserSinglePane.BufferModifiedLine = {};

  /**
   * Kinds of {@code BufferLine}s.
   * @enum {string}
   */
  diffTool.ParserSinglePane.LineType = {
    /**
     * Line, which is inserts instead of big part of code and shows
     * that there are a lot of space in code between previous and next
     * modifications.
     */
    FOLDED: 'folded',

    /**
     * Line from original code.
     */
    ORIGINAL: 'original',

    /**
     * Line from modified code.
     */
    MODIFIED: 'modified',

    /**
     * Line, where only EOL symbol was changed.
     * Not implemented yet.
     */
    EOL_CHANGED: 'changedEol',

    /**
     * Unchanged line or chars. Does not matter, to which code it belongs,
     * because after merge it won't be changed. This lines, should not
     * be highlighted in output.
     */
    UNCHANGED: 'unchanged'
  };

  /**
   * Iterates over {@code Array} of chanes and creates an {@code OutputBuffer} —
   * {@code Array} of {@code BufferLine}s.
   * @return {diffTool.ParserSinglePane.Buffer}
   * @override
   */
  diffTool.ParserSinglePane.prototype.parse = function(original, modified,
                                                       diff) {
    var originalLines = this.splitToLines(original);
    var modifiedLines = this.splitToLines(modified);

    var outputBuffer = [];

    var originalFileCursor = 0;
    var modifiedFileCursor = 0;

    diff.forEach(function(change, i) {
      var lines = [];
      var currentOriginalLines = [];
      var currentModifiedLines = [];
      var isLastChange = i === diff.length - 1;

      if (change.type === diffTool.Parser.ModificationType.UNCHANGED) {
        currentOriginalLines = originalLines.slice(
            originalFileCursor, originalFileCursor + change.lines);

        lines = this.parseUnchangedLines(currentOriginalLines,
            originalFileCursor, modifiedFileCursor, isLastChange);

        originalFileCursor += change.lines;
        modifiedFileCursor += change.lines;
      } else {
        currentOriginalLines = originalLines.slice(originalFileCursor,
            originalFileCursor + change.oldLines);
        currentModifiedLines = modifiedLines.slice(modifiedFileCursor,
            modifiedFileCursor + change.newLines);

        lines = this.parseLineChanges(
            currentOriginalLines,
            currentModifiedLines,
            originalFileCursor,
            modifiedFileCursor,
            change.ranges);

        originalFileCursor += change.oldLines;
        modifiedFileCursor += change.newLines;
      }

      Array.prototype.push.apply(outputBuffer, lines);
    }, this);

    return outputBuffer;
  };

  /**
   * Parses unchanged parts of code to display some lines from it as a context
   * to changed code. Uses {@code CONTEXT_SIZE} constant to understand how
   * many lines to use as a context. Tries to display lines of code, after
   * previous changes, then folds unused code and then displays line of code
   * before next changes. If there are few lines, does not fold and
   * displays unchanged content entirely. Returns context and fold as
   * an {@code Array} of {@code BufferLine}s.
   * @param {Array.<string>} lines
   * @param {number} originalLinesOffset
   * @param {number} modifiedLinesOffset
   * @param {boolean=} opt_isLastChange
   * @return {Array.<diffTool.ParserSinglePane.BufferLine>}
   * @protected
   */
  diffTool.ParserSinglePane.prototype.parseUnchangedLines = function(lines,
      originalLinesOffset, modifiedLinesOffset, opt_isLastChange) {
    var bufferLines = [];

    var fold = lines.slice(diffTool.ParserSinglePane.CONTEXT_SIZE,
        lines.length - diffTool.ParserSinglePane.CONTEXT_SIZE);

    var intersection = lines.length -
        diffTool.ParserSinglePane.CONTEXT_SIZE * 2 - fold.length;

    var contextAfter = lines.slice(0, diffTool.ParserSinglePane.CONTEXT_SIZE);
    var contextBefore = lines.slice(
        -1 * diffTool.ParserSinglePane.CONTEXT_SIZE - intersection);

    var lineNumberOriginal, lineNumberModified;

    if (lines.length <= diffTool.ParserSinglePane.CONTEXT_SIZE) {
      contextBefore = [];
    }

    if (originalLinesOffset === 0 && modifiedLinesOffset === 0) {
      contextAfter = [];
      fold = [];
    }

    if (opt_isLastChange) {
      contextBefore = [];
      fold = [];
    }

    lineNumberOriginal = originalLinesOffset + 1;
    lineNumberModified = modifiedLinesOffset + 1;

    contextAfter.forEach(function(contextLine, i) {
      bufferLines.push(this.getBufferLine_(
          diffTool.ParserSinglePane.LineType.UNCHANGED, contextLine,
          lineNumberOriginal + i,
          lineNumberModified + i));
    }, this);

    if (fold.length) {
      bufferLines.push(this.getBufferLine_(
          diffTool.ParserSinglePane.LineType.FOLDED, '', null, null));
    }

    lineNumberOriginal = originalLinesOffset + lines.length -
        contextBefore.length + 1;
    lineNumberModified = modifiedLinesOffset + lines.length -
        contextBefore.length + 1;

    contextBefore.forEach(function(contextLine, i) {
      bufferLines.push(this.getBufferLine_(
          diffTool.ParserSinglePane.LineType.UNCHANGED, contextLine,
          lineNumberOriginal + i,
          lineNumberModified + i));
    }, this);

    return bufferLines;
  };

  /**
   * Parses part of code to {@code Array} of {@code BufferLine}s. First it
   * places lines of original code and after that, lines of modified code.
   * @param {Array.<string>} originalLines
   * @param {Array.<string>} modifiedLines
   * @param {number} originalLinesOffset
   * @param {number} modifiedLinesOffset
   * @param {Array.<diffTool.Parser.InlineModification>} ranges
   * @return {Array.<diffTool.ParserSinglePane.BufferLine>}
   * @protected
   */
  diffTool.ParserSinglePane.prototype.parseLineChanges = function(originalLines,
      modifiedLines, originalLinesOffset, modifiedLinesOffset, ranges) {
    var bufferLines = [];

    var parsedOriginalLines = this.parseLineRange_(
        originalLines, ranges, diffTool.ParserSinglePane.LineType.ORIGINAL);
    var parsedModifiedLines = this.parseLineRange_(
        modifiedLines, ranges, diffTool.ParserSinglePane.LineType.MODIFIED);

    parsedOriginalLines.forEach(function(line, i) {
      bufferLines.push(this.getBufferLine_(
          diffTool.ParserSinglePane.LineType.ORIGINAL, line,
          originalLinesOffset + i + 1, null));
    }, this);

    parsedModifiedLines.forEach(function(line, i) {
      bufferLines.push(this.getBufferLine_(
          diffTool.ParserSinglePane.LineType.MODIFIED, line,
          null, modifiedLinesOffset + i + 1));
    }, this);

    return bufferLines;
  };

  /**
   * @param {Array.<string>} lines
   * @param {Array.<string>} ranges
   * @param {diffTool.ParserSinglePane.LineType} type
   * @return {Array.<Array.<diffTool.ParserSinglePane.InlineModification>|
   *     string>}
   * @private
   */
  diffTool.ParserSinglePane.prototype.parseLineRange_ = function(lines,
      ranges, type) {
    var bufferLines = [];

    var range = diffTool.isDef(ranges) ? ranges[0] : undefined;
    var rangeIndex = 0;

    lines.forEach(function(line) {
      if (line.length < 50) {
        debugger;
      }

      if (!ranges) {
        bufferLines.push(this.parseInlineChanges(line, ranges, type));
        return;
      }

      var usedRanges = [];
      var lineCursor = 0;

      while (rangeIndex <= ranges.length) {
        var usedSymbol = range.chars ? 'chars' :
            type === diffTool.ParserSinglePane.LineType.ORIGINAL ?
                'oldChars' : 'newChars';

        lineCursor += range[usedSymbol];

        if (lineCursor <= line.length) {
          usedRanges.push(range);
          range = ranges[++rangeIndex];

          if (!range || lineCursor === line.length) {
            break;
          }
        } else {
          usedRanges.push(diffTool.createObject(
              usedSymbol, range[usedSymbol] - (lineCursor - line.length),
              'type', range.type));

          if (lineCursor - line.length > 0) {
            range = diffTool.createObject(
                usedSymbol, lineCursor - line.length,
                'type', range.type);
          }

          break;
        }
      }

      bufferLines.push(this.parseInlineChanges(line, usedRanges, type));
    }, this);

    return bufferLines;
  };

  /**
   * Parses data of inline changes of some string and returns it as
   * {@code BufferLine}.
   * @param {string} chars
   * @param {Array.<diffTool.ParserSinglePane.InlineModification>} ranges
   * @param {diffTool.ParserSinglePane.LineType} type
   * @return {diffTool.ParserSinglePane.BufferLine}
   * @protected
   */
  diffTool.ParserSinglePane.prototype.parseInlineChanges = function(chars,
      ranges, type) {
    if (!ranges) {
      return /** @type {diffTool.ParserSinglePane.BufferLine} */ (chars);
    }

    var line = /** @type {diffTool.ParserSinglePane.BufferLine} */ ([]);
    var inlineCursor = 0;

    ranges.forEach(function(range) {
      var charsOffset;
      var substr;
      var lineType;

      if (range.type === diffTool.Parser.ModificationType.UNCHANGED) {
        charsOffset = range.chars;
      } else {
        charsOffset = type === diffTool.ParserSinglePane.LineType.ORIGINAL ?
                range.oldChars :
                range.newChars;
      }

      substr = chars.substr(inlineCursor, charsOffset);
      lineType = range.type === diffTool.Parser.ModificationType.UNCHANGED ?
          diffTool.Parser.ModificationType.UNCHANGED :
          type;

      line.push(this.getBufferModifiedLine_(lineType, substr));

      inlineCursor += charsOffset;
    }, this);

    return line;
  };

  /**
   * Returns object, which represents line of code for output buffer and
   * includes chars of line if there was no inline modifications, or
   * {@code BufferModifiedLine}, which was returned by
   * {@code getBufferModifiedLine_} if there was inline changes. Also includes
   * number of line in original and modified code and type of changes: whether
   * this line was deleted, added, or there was inline changes.
   * @param {diffTool.ParserSinglePane.LineType} codeType
   * @param {string|diffTool.ParserSinglePane.BufferModifiedLine} line
   * @param {number} originalLineNumber
   * @param {number} modifiedLineNumber
   * @return {diffTool.ParserSinglePane.BufferLine}
   * @private
   */
  diffTool.ParserSinglePane.prototype.getBufferLine_ = function(codeType,
      line, originalLineNumber, modifiedLineNumber) {
    return /** @type {diffTool.ParserSinglePane.BufferLine} */ ({
      codeType: codeType,
      line: line,
      modifiedLineNumber: modifiedLineNumber,
      originalLineNumber: originalLineNumber
    });
  };

  /**
   * Returns object, which represents line of code with inline modifications
   * for output buffer.
   * @param {diffTool.ParserSinglePane.LineType} codeType
   * @param {string} chars
   * @return {diffTool.ParserSinglePane.BufferModifiedLine}
   * @private
   */
  diffTool.ParserSinglePane.prototype.getBufferModifiedLine_ = function(
      codeType, chars) {
    return /** @type {diffTool.ParserSinglePane.BufferModifiedLine} */ ({
      codeType: codeType,
      chars: chars
    });
  };

  return diffTool.ParserSinglePane;
});
