/**
 * @fileoverview Parser for single-paned mode of DiffTool.
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
   * @type {Array.<diffTool.SingleEditorController.BufferLine>}
   */
  diffTool.ParserSinglePane.Buffer = [];

  /**
   * @type {{
   *   codeType: diffTool.SingleEditorController.ModificationType,
   *   line: string,
   *   lineNumber: number
   * }}
   */
  diffTool.ParserSinglePane.BufferLine = {};


  /**
   * @enum {string}
   */
  diffTool.ParserSinglePane.CodeType = {
    /**
     * Line from original code.
     */
    ORIGINAL: 'original',

    /**
     * Line from modified code.
     */
    MODIFIED: 'modified',

    /**
     * Unchanged line. Does not matter, to which code it belongs, because
     * after merge it won't be changed. This lines, should not be highlighted
     * in output.
     */
    UNCHANGED: 'unchanged'
  };

  /**
   * @return {diffTool.ParserSinglePane.Buffer}
   * @override
   */
  diffTool.ParserSinglePane.prototype.parse = function(original, modified,
                                                       diff) {
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

    var offsetOriginal, offsetModified;

    diff.forEach(function(change) {
      switch (change.type) {
      case diffTool.Parser.ModificationType.UNCHANGED:
        cursorOriginal += change.lines;
        cursorModified += change.lines;
        break;

      case diffTool.Parser.ModificationType.MODIFIED:
        offsetOriginal = cursorOriginal + change.oldLines;
        offsetModified = cursorModified + change.newLines;

        var from = diffTool.clamp(
            cursorOriginal - diffTool.ParserSinglePane.UNCHANGED_GAP,
            0, linesOriginal.length - 1);

        var to = diffTool.clamp(offsetOriginal +
            diffTool.ParserSinglePane.UNCHANGED_GAP,
            0, linesOriginal.length - 1);

        for (var i = from; i < cursorOriginal; i++) {
          output.push({
            codeType: diffTool.ParserSinglePane.CodeType.UNCHANGED,
            line: linesOriginal[i],
            lineNumber: i + 1
          });
        }

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

        for (i = offsetOriginal; i < to; i++) {
          output.push({
            codeType: diffTool.ParserSinglePane.CodeType.UNCHANGED,
            line: linesOriginal[i],
            lineNumber: i + 1
          });
        }

        break;
      }
    }, this);

    return output;
  };
});
