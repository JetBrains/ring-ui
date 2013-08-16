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
   * @typedef {Array.<diffTool.SingleEditorController.BufferLine>}
   */
  diffTool.ParserSinglePane.Buffer = [];

  /**
   * @typedef {{
   *   codeType: diffTool.SingleEditorController.ModificationType,
   *   line: string|Array.<diffTool.ParserSinglePane.BufferModifiedLine>,
   *   lineNumber: number
   * }}
   */
  diffTool.ParserSinglePane.BufferLine = {};

  /**
   * @typedef {{
   *   codeType: diffTool.SingleEditorController.ModificationType,
   *   chars: string
   * }}
   */
  diffTool.ParserSinglePane.BufferModifiedLine = {};


  /**
   * @enum {string}
   */
  diffTool.ParserSinglePane.CodeType = {
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
    // todo(igor.alexeenko): Not sure about this way of split lines.
    // Maybe there is a reason use match of regular expression in this case.
    // Also I can resolve currently used type of line separators in this
    // particular file.
    var linesOriginal = original.split(/\n/);
    var linesModified = modified.split(/\n/);

    var output = /** @type {diffTool.ParserSinglePane.Buffer} */ ([]);

    /**
     * Number of current line in original code.
     * @type {number}
     */
    var cursorOriginal = 0;

    /**
     * Number of current line if modified code.
     * @type {number}
     */
    var cursorModified = 0;

    diff.forEach(function(change) {
      change = /** @type {diffTool.Parser.LineModification} */ (change);

      switch(change.type) {
      case diffTool.Parser.ModificationType.UNCHANGED:
        cursorOriginal += change.lines;
        cursorModified += change.lines;
        break;

      case diffTool.Parser.ModificationType.MODIFIED:
        Array.prototype.push.apply(output,
            diffTool.ParserSinglePane.parseLines_(linesOriginal,
                linesModified, change, cursorOriginal, cursorModified));

        cursorOriginal += change.oldLines;
        cursorModified += change.newLines;

        break;
      }
    });

    output.forEach(function(line) {
      console.log(line);
    });

    return output;
  };

  /**
   * @static
   * @param {Array.<string>} linesOriginal
   * @param {Array.<string>} linesModified
   * @param {diffTool.Parser.LineModification} change
   * @param {number} cursorOriginal
   * @param {number} cursorModified
   * @return {Array.<diffTool.ParserSinglePane.BufferLine>}
   * @private
   */
  diffTool.ParserSinglePane.parseLines_ = function(linesOriginal, linesModified,
                                                  change, cursorOriginal,
                                                  cursorModified) {
    var output = /** @type {Array.<diffTool.ParserSinglePane.BufferLine>} */ (
        []);

    if (diffTool.isDef(change.ranges)) {
      output = diffTool.ParserSinglePane.parseInline_.apply(null, arguments);
    } else {
      var offsetOriginal = cursorOriginal + change.oldLines;
      var offsetModified = cursorModified + change.newLines;
      var i = 0;

      // todo(igor.alexeenko): It would be better if I used one iterator.
      for (i = cursorOriginal; i < offsetOriginal; i++) {
        output.push({
          codeType: diffTool.ParserSinglePane.CodeType.ORIGINAL,
          line: linesOriginal[i],
          lineNumber: i + 1
        });
      }

      for (i = cursorModified; i < offsetModified; i++) {
        output.push({
          codeType: diffTool.ParserSinglePane.CodeType.MODIFIED,
          line: linesModified[i],
          lineNumber: i + 1
        });
      }
    }

    return output;
  };

  /**
   * @static
   * @param {Array.<string>} linesOriginal
   * @param {Array.<string>} linesModified
   * @param {diffTool.Parser.LineModification} change
   * @param {number} cursorOriginal
   * @param {number} cursorModified
   * @return {Array.<diffTool.ParserSinglePane.BufferLine>}
   * @private
   */
  diffTool.ParserSinglePane.parseInline_ = function(linesOriginal,
                                                    linesModified, change,
                                                    cursorOriginal,
                                                    cursorModified) {
    var output = /** @type {Array.<diffTool.ParserSinglePane.BufferLine>} */ (
        []);

    var lineOriginal = linesOriginal[cursorOriginal];
    var lineModified = linesModified[cursorModified];

    var originalLineBuffer = [];
    var originalLineCursor = 0;

    var modifiedLineBuffer = [];
    var modifiedLineCursor = 0;

    change.ranges.forEach(function(range) {
      var originalLineOffset;
      var modifiedLineOffset;
      var originalSubstr;
      var modifiedSubstr;

      switch (range.type) {
      case diffTool.Parser.ModificationType.UNCHANGED:
        originalLineOffset = originalLineCursor + range.chars;
        modifiedLineOffset = modifiedLineCursor + range.chars;

        // NB! Does not matter, from which line take chars, because it is not
        // modified, so I decided to take it from original line.
        originalSubstr = lineOriginal.substr(originalLineCursor,
            originalLineOffset);

        var bufferLine = /** @type {diffTool.ParserSinglePane.BufferLine} */ ({
          codeType: diffTool.ParserSinglePane.CodeType.UNCHANGED,
          chars: originalSubstr
        });

        originalLineBuffer.push(bufferLine);
        modifiedLineBuffer.push(bufferLine);

        originalLineCursor += originalLineOffset;
        modifiedLineCursor += modifiedLineOffset;

        break;

      case diffTool.Parser.ModificationType.MODIFIED:
        originalLineOffset = originalLineCursor + range.oldChars;
        modifiedLineOffset = modifiedLineCursor + range.newChars;

        originalSubstr = lineOriginal.substr(originalLineCursor,
            originalLineOffset);
        modifiedSubstr = lineModified.substr(modifiedLineCursor,
            modifiedLineOffset);

        originalLineBuffer.push({
          codeType: diffTool.ParserSinglePane.CodeType.ORIGINAL,
          code: originalSubstr
        });
        modifiedLineBuffer.push({
          codeType: diffTool.ParserSinglePane.CodeType.MODIFIED,
          code: modifiedSubstr
        });

        originalLineCursor += originalLineOffset;
        modifiedLineCursor += modifiedLineOffset;

        break;
      }
    });

    output.push({
      codeType: diffTool.ParserSinglePane.CodeType.ORIGINAL,
      line: originalLineBuffer,
      lineNumber: cursorOriginal + 1
    });

    output.push({
      codeType: diffTool.ParserSinglePane.CodeType.MODIFIED,
      line: modifiedLineBuffer,
      lineNumber: cursorModified + 1
    });

    return output;
  };
});
