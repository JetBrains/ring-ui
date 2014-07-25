var Tools = require('../Tools');
var Parser = require('../Parser');
var parsers = require('../Parsers');

var ParserSinglePane = function () {
};
Tools.inherit(ParserSinglePane, Parser);
Tools.addSingletonGetter(ParserSinglePane);

/**
 * In single pane mode modified lines are displayed as a pair of lines - one removed, one added.
 * If the line is not needed it is folded.
 * @override
 */
ParserSinglePane.prototype.availableLineTypes =
  Parser.LineType.UNCHANGED |
  Parser.LineType.DELETED |
  Parser.LineType.ADDED |
  Parser.LineType.INLINE |
  Parser.LineType.EOL_CHANGED;

/**
 * Single-pane parser checks whether a line was added or deleted, whether
 * it contains inline changes, and whether the changes are whitespace-only.
 * @override
 */
ParserSinglePane.prototype.modifiedParsers = [
  parsers.addedOrDeleted,
  parsers.EOLChanged,
  parsers.inlineChanges
];

module.exports = ParserSinglePane;
