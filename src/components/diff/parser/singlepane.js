var Tools = require('../Tools');
var Parser = require('../Parser');
var parsers = require('../Parsers');

var ParserSinglePane = function () {
};
Tools.inherit(ParserSinglePane, Parser);
Tools.addSingletonGetter(ParserSinglePane);

/**
 * In single pane mode, even modified lines displays as deleted and then
 * inserted. If line is not needed it is folded.
 * @override
 */
ParserSinglePane.prototype.availableLineTypes =
  Parser.LineType.UNCHANGED |
  Parser.LineType.DELETED |
  Parser.LineType.ADDED |
  Parser.LineType.INLINE |
  Parser.LineType.EOL_CHANGED;

/**
 * Single-pane parser checks, whether line was added or deleted, whether
 * it contains inline changes, and whether this changes is only changes
 * of EOL-symbol.
 * @override
 */
ParserSinglePane.prototype.modifiedParsers = [
  parsers.addedOrDeleted,
  parsers.EOLChanged,
  parsers.inlineChanges
];

module.exports = ParserSinglePane;
