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
   *   lineNumber: number
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
    diff = /** @type {Object} */ (diff);

    var originalLines = this.splitToLines(original);
    var modifiedLines = this.splitToLines(modified);

    var outputBuffer = [];

    var i = 0;

    var originalFileCursor = 0;
    var modifiedFileCursor = 0;

    diff.forEach(function(change) {
      var line;
      var sourceLine;
      var inlineCursor;

      if (change.lines) {
        if (change.lines <= diffTool.ParserSinglePane.FOLD_GAP) {
          for (i = originalFileCursor; i < originalFileCursor + change.lines;
              i++) {
            outputBuffer.push({
              codeType: diffTool.ParserSinglePane.LineType.UNCHANGED,
              line: originalLines[i],
              lineNumber: i + 1
            });
          }
        } else {
          outputBuffer.push({
            codeType: diffTool.ParserSinglePane.LineType.FOLDED,
            line: '',
            number: 0
          });
        }

        originalFileCursor += change.lines;
        modifiedFileCursor += change.lines;
      }

      if (change.oldLines) {
        for (i = originalFileCursor; i < originalFileCursor + change.oldLines;
             i++) {
          if (change.ranges) {
            sourceLine = originalLines[i];
            inlineCursor = 0;
            line = [];

            change.ranges.forEach(function(range) {
              if (range.chars) {
                line.push({
                  codeType: diffTool.ParserSinglePane.LineType.UNCHANGED,
                  chars: sourceLine.substr(inlineCursor, range.chars)
                });

                inlineCursor += range.chars;
              }

              if (range.oldChars) {
                line.push({
                  codeType: diffTool.ParserSinglePane.LineType.ORIGINAL,
                  chars: sourceLine.substr(inlineCursor, range.oldChars)
                });

                inlineCursor += range.oldChars;
              }
            });
          } else {
            line = originalLines[i];
          }

          outputBuffer.push({
            codeType: diffTool.ParserSinglePane.LineType.ORIGINAL,
            line: line,
            lineNumber: i + 1
          });
        }

        originalFileCursor += change.oldLines;
      }

      if (change.newLines) {
        for (i = modifiedFileCursor; i < modifiedFileCursor + change.newLines;
             i++) {
          if (change.ranges) {
            sourceLine = modifiedLines[i];
            inlineCursor = 0;
            line = [];

            change.ranges.forEach(function(range) {
              if (range.chars) {
                line.push({
                  codeType: diffTool.ParserSinglePane.LineType.UNCHANGED,
                  chars: sourceLine.substr(inlineCursor, range.chars)
                });

                inlineCursor += range.chars;
              }

              if (range.newChars) {
                line.push({
                  codeType: diffTool.ParserSinglePane.LineType.MODIFIED,
                  chars: sourceLine.substr(inlineCursor, range.newChars)
                });

                inlineCursor += range.newChars;
              }
            });
          } else {
            line = modifiedLines[i];
          }

          outputBuffer.push({
            codeType: diffTool.ParserSinglePane.LineType.MODIFIED,
            line: line,
            lineNumber: i
          });
        }

        modifiedFileCursor += change.newLines;
      }
    });

    return outputBuffer;
  };

  /**
   * @param {diffTool.ParserSinglePane.LineType} codeType
   * @param {diffTool.ParserSinglePane.BufferLine} line
   * @param {number} lineNumber
   * @private
   */
  diffTool.ParserSinglePane.prototype.getBufferLine_ = function(codeType,
      line, lineNumber) {
    return {
      codeType: codeType,
      line: line,
      lineNumber: lineNumber
    };
  };
});
