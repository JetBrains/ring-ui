/**
 * @fileoverview Diff-data parser for double-paned mode of {@link DiffTool}.
 * @author igor.alexeenko (Igor Alekseyenko)
 */

define(['diff/diff__tools', 'diff/diff__parser'], function(diffTool) {
  /**
   * @constructor
   * @extends {diffTool.Parser}
   */
  diffTool.ParserDoublePane = function() {};
  diffTool.inherit(diffTool.ParserDoublePane, diffTool.Parser);
  diffTool.addSingletonGetter(diffTool.ParserDoublePane);

  /**
   * @enum {string}
   */
  diffTool.ParserDoublePane.CodeType = {
    ORIGINAL: 'original',
    MODIFIED: 'modified'
  };

  /**
   * @param {string} original
   * @param {diffTool.Parser.Diff} diff
   * @param {diffTool.ParserDoublePane.CodeType} type
   * @return {Array.<Object>}
   */
  diffTool.ParserDoublePane.prototype.getLines = function(original, diff,
      type) {
    var offsets = [];
    var fileCursor = 0;

    diff.forEach(function(change) {
      change = /** @type {diffTool.Parser.LineModification} */ (change);
      var usedLines;

      switch(change.type) {
      case diffTool.Parser.ModificationType.UNCHANGED:
        usedLines = change.lines;
        break;

      case diffTool.Parser.ModificationType.MODIFIED:
        usedLines = type === diffTool.ParserDoublePane.CodeType.ORIGINAL ?
            change.oldLines :
            change.newLines;
      }

      offsets.push({
        bottom: fileCursor + usedLines,
        codeType: change.type,
        top: fileCursor
      });

      fileCursor += usedLines + 1;
    }, this);

    return offsets;
  };
});
