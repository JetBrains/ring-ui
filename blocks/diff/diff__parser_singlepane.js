/**
 * @fileoverview Parser for single-paned mode of DiffTool. Parser transforms
 * original JSON response from server to JSON with code injections
 * and marks of way, how exactly those line were modified. Maybe, in future
 * this interactions will be performed on the server-side.
 * @author igor.alexeenko (Igor Alekseyenko)
 */
 
define(['diff/diff__tools', 'diff/diff__parser'], function(diffTool) {
  /**
   * @constructor
   * @extends {diffTool.Parser}
   */
  diffTool.ParserSinglePane = function() {};
  diffTool.inherit(diffTool.ParserSinglePane, diffTool.Parser);

  /**
   * Number of lines, which will be taken before and after changed code to
   * display changed code in context of file.
   * @type {number}
   * @const
   */
  diffTool.ParserSinglePane.UNCHANGED_GAP = 3;

  /**
   * Number of lines between two diffs, which we can displayed unfolded.
   * @type {number}
   * @const
   */
  diffTool.ParserSinglePane.FOLD_GAP = 5;

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
     * Line or chars from original code.
     */
    ORIGINAL: 'original',

    /**
     * Line or chars from modified code.
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

    diff.forEach(function(change) {
      var lines = [];
      var currentOriginalLines = [];
      var currentModifiedLines = [];

      if (change.type === diffTool.Parser.ModificationType.UNCHANGED) {
        currentOriginalLines = originalLines.slice(
            originalFileCursor, originalFileCursor + change.lines);

        lines = this.parseUnchangedLines(currentOriginalLines,
            originalFileCursor, modifiedFileCursor);

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
   * @param {Array.<string>} lines
   * @param {number} originalLinesOffset
   * @param {number} modifiedLinesOffset
   * @return {Array.<diffTool.ParserSinglePane.BufferLine>}
   * @protected
   */
  diffTool.ParserSinglePane.prototype.parseUnchangedLines = function(lines,
      originalLinesOffset, modifiedLinesOffset) {
    var bufferLines = [];

    if (lines.length <= diffTool.ParserSinglePane.FOLD_GAP) {
      lines.forEach(function(line, i) {
        bufferLines.push(this.getBufferLine_(
            diffTool.ParserSinglePane.LineType.UNCHANGED, line,
            originalLinesOffset + i + 1, modifiedLinesOffset + i));
      }, this);
    } else {
      bufferLines.push(this.getBufferLine_(
          diffTool.ParserSinglePane.LineType.FOLDED, '', null, null));
    }

    return bufferLines;
  };

  /**
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

    originalLines.forEach(function(line, i) {
      line = this.parseInlineChanges(line, ranges,
          diffTool.ParserSinglePane.LineType.ORIGINAL);

      bufferLines.push(this.getBufferLine_(
          diffTool.ParserSinglePane.LineType.ORIGINAL, line,
          originalLinesOffset + i + 1, null));
    }, this);

    modifiedLines.forEach(function(line, i) {
      line = this.parseInlineChanges(line, ranges,
          diffTool.ParserSinglePane.LineType.MODIFIED);

      bufferLines.push(this.getBufferLine_(
          diffTool.ParserSinglePane.LineType.MODIFIED, line,
          null, modifiedLinesOffset + i));
    }, this);

    return bufferLines;
  };

  /**
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
    var lineCursor = 0;

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

      substr = chars.substr(lineCursor, charsOffset);
      lineType = range.type === diffTool.Parser.ModificationType.UNCHANGED ?
          diffTool.Parser.ModificationType.UNCHANGED :
          type;

      line.push(this.getBufferModifiedLine_(lineType, substr));

      lineCursor += charsOffset;
    }, this);

    return line;
  };

  /**
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
});
