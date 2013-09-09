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


  // todo(igor.alexeeko): find out, what is that for.
  /**
   * @enum {string}
   */
  diffTool.ParserDoublePane.CodeType = {
    ORIGINAL: 'original',
    MODIFIED: 'modified'
  };

  /**
   * Types of different lines in code.
   * @enum {string}
   */
  diffTool.ParserDoublePane.LineType = {
    /**
     * Line, which has not been added in modified code.
     */
    ADDED: 'added',

    /**
     * Line, which has been deleted in modified code.
     */
    DELETED: 'deleted',

    /**
     * Line, where only EOL symbol was changed.
     * Not implemented yet.
     */
    EOL_CHANGED: 'changedEol',

    /**
     * Line from modified code.
     */
    MODIFIED: 'modified',

    /**
     * Unchanged line or chars. Does not matter, to which code it belongs,
     * because after merge it won't be changed. This lines, should not
     * be highlighted in output.
     */
    UNCHANGED: 'unchanged'
  };

  // todo(igor.alexeenko): Specify type of return point.
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
      var oppositeLines;
      var codeType;
      var isOriginalCode;

      switch(change.type) {
      case diffTool.Parser.ModificationType.UNCHANGED:
        usedLines = change.lines;
        codeType = diffTool.ParserDoublePane.LineType.UNCHANGED;
        break;

      case diffTool.Parser.ModificationType.MODIFIED:
        isOriginalCode = type === diffTool.ParserDoublePane.CodeType.ORIGINAL;

        usedLines = isOriginalCode ?
            change.oldLines || 0:
            change.newLines || 0;

        oppositeLines = isOriginalCode ?
            change.newLines || 0:
            change.oldLines || 0;

        if (usedLines === 0 && oppositeLines > 0) {
          codeType = diffTool.ParserDoublePane.LineType.DELETED;
        } else if (oppositeLines === 0 && usedLines > 0) {
          codeType = diffTool.ParserDoublePane.LineType.ADDED;
        } else {
          codeType = diffTool.ParserDoublePane.LineType.MODIFIED;
        }
      }

      var offset = {
        bottom: fileCursor + usedLines,
        codeType: codeType,
        top: fileCursor
      };

      offsets.push(offset);

      fileCursor += usedLines;
    }, this);

    return offsets;
  };
});
