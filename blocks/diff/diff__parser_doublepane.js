/**
 * @fileoverview Diff-data parser for double-paned mode of {@link DiffTool}.
 * @author igor.alexeenko (Igor Alekseyenko)
 */

define([
  'diff/diff__tools',
  'diff/diff__parsers',
  'diff/diff__parser'
], function(d) {
  /**
   * @constructor
   * @extends {d.Parser}
   */
  d.ParserDoublePane = function() {};
  d.inherit(d.ParserDoublePane, d.Parser);
  d.addSingletonGetter(d.ParserDoublePane);

  /**
   * In single pane mode, even modified lines displays as deleted and then
   * inserted. If line is not needed it is folded.
   * @override
   */
  d.ParserDoublePane.prototype.availableLineTypes =
      d.Parser.LineType.UNCHANGED |
      d.Parser.LineType.DELETED |
      d.Parser.LineType.ADDED |
      d.Parser.LineType.INLINE |
      d.Parser.LineType.EOL_CHANGED;

  /**
   * Single-pane parser checks, whether line was added or deleted, whether
   * it contains inline changes, and whether this changes is only changes
   * of EOL-symbol.
   * @override
   */
  d.ParserDoublePane.prototype.modifiedParsers = [
    d.parsers.addedOrDeleted,
    d.parsers.EOLChanged,
    d.parsers.inlineChanges
  ];

  /**
   * @param {d.Parser.Output} lines
   * @return {d.Parser.Output}
   */
  d.ParserDoublePane.ignoreWhitespaces = function(lines) {
    var usedLines = [];

    lines.forEach(function(change) {
      var originalCode = change.original;
      var modifiedCode = change.modified;

      var onlyWhitespaces = originalCode.some(function(inlineChange, index) {
        var modifiedChange = modifiedCode[index];

        return Boolean(inlineChange.type) &&
            d.isEmptyString(inlineChange.code) &&
            d.isEmptyString(modifiedChange.code);
      });

      if (!onlyWhitespaces || !change.type) {
        usedLines.push(change);
      } else {
        // todo(igor.alexeenko): Refactor.
        // NB! Further I want to use parameter "ignored" instead of changing
        // state of just created fake object or use map of supported states.
        // This solution is temporary.
        var fakeChange = d.mixin({}, change);
        fakeChange.type = d.Parser.LineType.NULL;
        usedLines.push(fakeChange);
      }
    });

    return usedLines;
  };

  return d.ParserDoublePane;
});
