/* eslint-disable no-bitwise */
var Tools = require('./../diff__tools');

/**
 * @constructor
 */
var Parser = function () {
};

Parser.getInstance = function () {
  var instance = Parser.instance_;
  return instance ? instance : (Parser.instance_ = new Parser());
};

/**
 * API response of number of changed lines and kinds of changes with them.
 * @typedef {{
   *   lines: number=,
   *   newLines: number=,
   *   oldLines: number=,
   *   ranges: Array.<SingleEditorController.InlineModification>,
   *   type: SingleEditorController.ModificationType
   * }}
 */
Parser.LineModification = {};

/**
 * Part of {@link LineModification}, which contains modifications with
 * number of chars inside of particular line.
 * @typedef {{
   *   chars: number=,
   *   newChars: number=,
   *   oldChars: number=,
   *   type: SingleEditorController.ModificationType
   * }}
 */
Parser.InlineModification = {};

/**
 * @typedef {{
   *   line: number,
   *   char: number
   * }}
 */
Parser.InlinePosition = {};

/**
 * @enum {string}
 */
Parser.ModificationType = {
  /**
   * Lines or chars was changed.
   */
  MODIFIED: 'modified',

  /**
   * Lines or chars was not changed.
   */
  UNCHANGED: 'unchanged'
};

/**
 * Matches a line.
 * @const
 * @type {RegExp}
 */
Parser.LineRegex = /^(.*(\r\n|\r|\n)|.+($))/mg;

/**
 * @typedef {Object}
 */
Parser.OutputLine = {};

/**
 * @typedef {Object}
 */
Parser.OutputLineContent = {};

/**
 * @enum {number}
 */
Parser.LineType = {
  NULL: 0x00,
  DELETED: 0x01,
  ADDED: 0x02,
  INLINE: 0x04,
  EOL_CHANGED: 0x08,
  WHITESPACE: 0x10
};

/**
 * Splits content to line with line separators at ends.
 * @static
 * @param {string} content
 * @return {Array.<string>}
 */
Parser.splitToLines = function (content) {
  return content.match(Parser.LineRegex);
};

/**
 * @param {Parser.OutputLine} line
 * @param {Parser.LineType} type
 * @return {boolean}
 */
Parser.lineHasType = function (line, type) {
  return Boolean(line.type & type);
};

/**
 * Returns intersection of type with list of types, passed as argument.
 * @static
 * @param {Parser.LineType} type
 * @param {Array.<Parser.LineType>} availableTypes
 * @return {Parser.LineType}
 */
Parser.normalizeType = function (type, availableTypes) {
  var usedTypes = 0x00;

  availableTypes.forEach(function (availableType) {
    usedTypes = usedTypes | +availableType;
  });

  return /** @type {Parser.LineType} */ (type & usedTypes);
};

/**
 * Bit mask of {Parser.LineType}s, used in parser.
 * @type {Parser.LineType}
 * @protected
 */
Parser.prototype.availableLineTypes = Parser.LineType.NULL;

/**
 * Adds or removes state from line.
 * @param {Parser.OutputLine} line
 * @param {Parser.LineType} type
 * @param {boolean=} enable
 */
Parser.prototype.enableLineType = function (line, type, enable) {
  // NB! Line neither should have type we try to add, nor shouldn't
  // have type we try to remove.
  if (Boolean(type & this.availableLineTypes) &&
    Parser.lineHasType(line, type) ^ enable) {
    line.type = enable ? line.type | type : ~(line.type & type);
  }
};

/**
 * Splits content of files to separate blocks of lines of original code
 * and corresponding lines of modified code. After that, applies all
 * available parsers to mark the state of each block.
 * @param {string} original
 * @param {string} modified
 * @param {Array.<Parser.LineModification>} diff
 * @return {Array.<Parser.OutputLine>}
 */
Parser.prototype.parse = function (original, modified, diff) {
  var output = [];

  var modificationTypeToParser = Tools.createObject(
    Parser.ModificationType.UNCHANGED, this.unchangedParsers,
    Parser.ModificationType.MODIFIED, this.modifiedParsers);

  var cursorOriginal = 0;
  var cursorModified = 0;

  var linesOriginal = Parser.splitToLines(original);
  var linesModified = Parser.splitToLines(modified);

  diff.forEach(function (change) {
    var parsers = modificationTypeToParser[change.type];

    var shiftOriginal = change.oldLines || change.lines || 0;
    var shiftModified = change.newLines || change.lines || 0;

    var originalChunk = linesOriginal.slice(cursorOriginal,
        cursorOriginal + shiftOriginal);
    var modifiedChunk = linesModified.slice(cursorModified,
        cursorModified + shiftModified);

    var chunk = Parser.getChunk(originalChunk, modifiedChunk,
      cursorOriginal, cursorOriginal + shiftOriginal,
      cursorModified, cursorModified + shiftModified,
      Parser.LineType.NULL);

    Parser.parseChunkInline(chunk, change.ranges);

    var length = parsers.length;
    for (var i = 0; i < length; i++) {
      var parser = parsers[i];
      chunk = parser.call(this, chunk, change);
    }

    cursorOriginal += shiftOriginal;
    cursorModified += shiftModified;

    output.push(chunk);
  }, this);

  return output;
};

/**
 * Splits chunk of code to little chunks, which are marked as changed, deleted,
 * added or unchanged.
 * @param {Parser.OutputLine} chunk
 * @param {Array.<Parser.InlineModification>} ranges
 * @return {Parser.OutputLine}
 */
Parser.parseChunkInline = function (chunk, ranges) {
  var joinOriginal = chunk.original.join('');
  var joinModified = chunk.modified.join('');

  if (!ranges) {

    // todo(igor.alexeenko): Hack.
    // Trying to implement the same format for all kinds of changes.
    /** @type {Array.<Parser.InlineModification>} */
    ranges = ([
      {
        type: chunk.type,
        oldChars: joinOriginal.length || 0,
        newChars: joinModified.length || 0
      }
    ]);
  }

  var chunkOriginal = [];
  var chunkModified = [];

  var cursorOriginal = 0;
  var cursorModified = 0;

  ranges.forEach(function (range) {
    var shiftOriginal = range.oldChars || range.chars || 0;
    var shiftModified = range.newChars || range.chars || 0;

    var substrOriginal = joinOriginal.substr(cursorOriginal, shiftOriginal);
    var substrModified = joinModified.substr(cursorModified, shiftModified);

    chunkOriginal.push(
      Parser.getInlineChunk(substrOriginal, Parser.LineType.NULL,
        Parser.getInlinePosition(cursorOriginal, chunk.original), // From
        Parser.getInlinePosition(cursorOriginal + shiftOriginal, chunk.original) // To
      ));

    chunkModified.push(
      Parser.getInlineChunk(substrModified, Parser.LineType.NULL,
        Parser.getInlinePosition(cursorModified, chunk.modified), // From
        Parser.getInlinePosition(cursorModified + shiftModified, chunk.modified) // To
      ));

    cursorOriginal += shiftOriginal;
    cursorModified += shiftModified;
  });

  chunk.original = chunkOriginal;
  chunk.modified = chunkModified;

  return chunk;
};

/**
 * @param {number} charNumber
 * @param {Array.<string>} codeLines
 * @return {Parser.InlinePosition}
 */
Parser.getInlinePosition = function (charNumber, codeLines) {
  var cursor = 0;
  var lineIndex = 0;
  var inlineCharIndex = charNumber;

  while (cursor < charNumber) {
    var line = codeLines[lineIndex];

    if (inlineCharIndex > line.length) {
      lineIndex++;
      cursor += line.length;
      inlineCharIndex -= line.length;
    } else {
      cursor += inlineCharIndex;
    }
  }

  return {
    line: lineIndex,
    char: inlineCharIndex
  };
};

/**
 * Object representing a chunk of code.
 * @static
 * @param {Array.<string>} original
 * @param {Array.<string>} modified
 * @param {number} originalFrom
 * @param {number} originalTo
 * @param {number} modifiedFrom
 * @param {number} modifiedTo
 * @param {Parser.LineType} type
 * @return {Parser.OutputLine}
 */
Parser.getChunk = function (original, modified, originalFrom, originalTo, modifiedFrom, modifiedTo, type) {
  return {
    original: original,
    modified: modified,
    originalFrom: originalFrom,
    originalTo: originalTo,
    modifiedFrom: modifiedFrom,
    modifiedTo: modifiedTo,
    type: type
  };
};

/**
 * Object representing inline changes in a chunk of code.
 * @static
 * @param {string} code
 * @param {Parser.LineType} type
 * @param {Parser.InlinePosition} from
 * @param {Parser.InlinePosition} to
 * @return {Parser.OutputLineContent}
 */
Parser.getInlineChunk = function (code, type, from, to) {
  return {
    code: code,
    type: type,
    from: from,
    to: to
  };
};

/**
 * Parsers that will be applied to unchanged code.
 * @type {Array}
 * @protected
 */
Parser.prototype.unchangedParsers = [];

/**
 * Parsers that will be applied to modified code.
 * @type {Array}
 * @protected
 */
Parser.prototype.modifiedParsers = [];

module.exports = Parser;
