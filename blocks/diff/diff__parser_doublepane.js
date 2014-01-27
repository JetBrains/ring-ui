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

  // todo(igor.alexeenko): Temporary solution.
  /**
   * Marks whitespace chagnes as not changed blocks.
   * @param {d.Parser.Output} lines
   * @return {d.Parser.Output}
   */
  d.ParserDoublePane.ignoreWhitespaces = function(lines) {
    return lines.map(function(change) {
      var whitespacesOnly = true;
      var originalCode = change.original;
      var modifiedCode = change.modified;

      var i = originalCode.length;

      while(i--) {
        var originalChunk = originalCode[i];
        var modifiedChunk = modifiedCode[i];

        if (Boolean(originalChunk.type) &&
            (!d.isEmptyString(originalChunk.code) ||
            !d.isEmptyString(modifiedChunk.code))) {
          whitespacesOnly = false;
          break;
        }
      }

      if (whitespacesOnly && Boolean(change.type)) {
        var fakeChange = d.mixin({}, change);
        fakeChange.type = d.Parser.LineType.NULL;
        return fakeChange;
      } else {
        return change;
      }
    });
  };

  return d.ParserDoublePane;
});
