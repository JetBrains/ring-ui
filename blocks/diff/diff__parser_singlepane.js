/**
 * @fileoverview Parser for single-paned mode of DiffTool.
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
  d.ParserSinglePane = function() {};
  d.inherit(d.ParserSinglePane, d.Parser);
  d.addSingletonGetter(d.ParserSinglePane);

  /**
   * In single pane mode, even modified lines displays as deleted and then
   * inserted. If line is not needed it is folded.
   * @override
   */
  d.ParserSinglePane.prototype.availableLineTypes =
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
  d.ParserSinglePane.prototype.modifiedParsers = [
    d.parsers.addedOrDeleted,
    d.parsers.EOLChanged,
    d.parsers.inlineChanges
  ];

  return d.ParserSinglePane;
});
