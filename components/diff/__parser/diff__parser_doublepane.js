/* eslint-disable no-bitwise */
/**
 * @fileoverview Diff-data parser for double-paned mode
 */

var Tools = require('./../diff__tools');
var Global = require('global/global');
var Parser = require('./diff__parser');
var parsers = require('./../diff__parsers');

var ParserDoublePane = function () {
};

Tools.inherit(ParserDoublePane, Parser);
Global.addSingletonGetter(ParserDoublePane);

/**
 * In single pane mode modified lines are displayed as a pair of lines - one removed, one added.
 * If the line is not needed it is folded.
 * @override
 */
ParserDoublePane.prototype.availableLineTypes =
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
ParserDoublePane.prototype.modifiedParsers = [
  parsers.addedOrDeleted,
  parsers.EOLChanged,
  parsers.inlineChanges
];

/**
 * Marks whitespace changes as unchanged blocks.
 * @param {Array.<Parser.OutputLine>} lines
 * @return {Array.<Parser.OutputLine>}
 */
ParserDoublePane.ignoreWhitespaces = function (lines) {
  return lines.map(function (change) {
    var whitespacesOnly = true;
    var originalCode = change.original;
    var modifiedCode = change.modified;

    var i = originalCode.length;

    while (i--) {
      var originalChunk = originalCode[i];
      var modifiedChunk = modifiedCode[i];

      if (Boolean(originalChunk.type) &&
        (!Tools.isEmptyString(originalChunk.code) || !Tools.isEmptyString(modifiedChunk.code))) {
        whitespacesOnly = false;
        break;
      }
    }

    if (whitespacesOnly && Boolean(change.type)) {
      var fakeChange = Tools.mixin({}, change);
      fakeChange.type = Parser.LineType.NULL;
      return fakeChange;
    } else {
      return change;
    }
  });
};

module.exports = ParserDoublePane;
