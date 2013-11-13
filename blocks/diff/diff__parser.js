/**
 * @fileoverview Base class of parser of diff-API response.
 * @author igor.alexeenko (Igor Alekseyenko)
 */

define([
  'diff/diff__tools'
], function(d) {
  /**
   * @constructor
   */
  d.Parser = function() {};
  d.addSingletonGetter(d.Parser);

  /**
   * @typedef {Array.<d.Parser.LineModification>}
   */
  d.Parser.Diff = {};

  /**
   * API response of number of changed lines and kinds of changes with them.
   * @typedef {{
   *   lines: number=,
   *   newLines: number=,
   *   oldLines: number=,
   *   ranges: Array.<d.SingleEditorController.InlineModification>,
   *   type: d.SingleEditorController.ModificationType
   * }}
   */
  d.Parser.LineModification = {};

  /**
   * Part of {@link LineModification}, which contains modifications with
   * number of chars inside of particular line.
   * @typedef {{
   *   chars: number=,
   *   newChars: number=,
   *   oldChars: number=,
   *   type: d.SingleEditorController.ModificationType
   * }}
   */
  d.Parser.InlineModification = {};

  /**
   * @typedef {{
   *   line: number,
   *   char: number
   * }}
   */
  d.Parser.InlinePosition = {};

  /**
   * @enum {string}
   */
  d.Parser.ModificationType = {
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
  d.Parser.LineRegex = /^.*(\r\n|\r|\n)/mg;

  /**
   * @typedef {d.ParserSinglePane.Buffer|Object}
   */
  d.Parser.Output = {};

  /**
   * @typedef {Object}
   */
  d.Parser.OutputLine = {};

  /**
   * @typedef {Object}
   */
  d.Parser.OutputLineContent = {};

  /**
   * @enum {number}
   */
  d.Parser.LineType = {
    /**
     * Null state.
     */
    NULL: 0x00,

    /**
     * Line, deleted in modified code.
     */
    DELETED: 0x01,

    /**
     * Line, added to modified code.
     */
    ADDED: 0x02,

    /**
     * Line with inline changes.
     */
    INLINE: 0x04,

    /**
     * End-of-line symbol changed.
     */
    EOL_CHANGED: 0x08,

    /**
     * Contains only whitespace changes.
     */
    WHITESPACE: 0x10
  };

  // todo(igor.alexeenko): move this into diff__tools.js as utility method
  /**
   * Splits content to line with line separators at ends.
   * @static
   * @param {string} content
   * @return {Array.<string>}
   * @protected
   */
  d.Parser.splitToLines = function(content) {
    return content.match(d.Parser.LineRegex);
  };

  /**
   * @param {d.Parser.OutputLine} line
   * @param {d.Parser.LineType} type
   * @return {boolean}
   */
  d.Parser.lineHasType = function(line, type) {
    return Boolean(line.type & type);
  };

  /**
   * Returns intersection of type with list of types, passed as argument.
   * @static
   * @param {d.Parser.LineType} type
   * @param {Array.<d.Parser.LineType>} availableTypes
   * @return {d.Parser.LineType}
   */
  d.Parser.normalizeType = function(type, availableTypes) {
    var usedTypes = 0x00;

    availableTypes.forEach(function(availableType) {
      usedTypes = usedTypes | +availableType;
    });

    return /** @type {d.Parser.LineType} */ (type & usedTypes);
  };

  /**
   * Bit mask of {d.Parser.LineType}s, used in parser.
   * @type {d.Parser.LineType}
   * @protected
   */
  d.Parser.prototype.availableLineTypes = d.Parser.LineType.NULL;

  /**
   * Adds or removes state from line.
   * @param {d.Parser.OutputLine} line
   * @param {d.Parser.LineType} type
   * @param {boolean=} enable
   */
  d.Parser.prototype.enableLineType = function(line, type, enable) {
    // NB! Line neither should have type we try to add, nor shouldn't
    // have type we try to remove.
    if (Boolean(type & this.availableLineTypes) &&
        d.Parser.lineHasType(line, type) ^ enable) {
      line.type = enable ? line.type | type : ~(line.type & type);
    }
  };

  /**
   * Splits content of files to separate blocks of lines of original code
   * and corresponding lines of modified code. After that, applies all
   * available parsers to mark the state of each block.
   * @param {string} original
   * @param {string} modified
   * @param {d.Parser.Diff} diff
   * @return {d.Parser.Output}
   */
  d.Parser.prototype.parse = function(original, modified, diff) {
    var output = [];

    var modificationTypeToParser = d.createObject(
        d.Parser.ModificationType.UNCHANGED, this.unchangedParsers,
        d.Parser.ModificationType.MODIFIED, this.modifiedParsers);

    var cursorOriginal = 0,
        cursorModified = 0;

    var linesOriginal = d.Parser.splitToLines(original);
    var linesModified = d.Parser.splitToLines(modified);

    diff.forEach(function(change) {
      var parsers = modificationTypeToParser[change.type];

      var shiftOriginal = change.oldLines || change.lines || 0;
      var shiftModified = change.newLines || change.lines || 0;

      var originalChunk = linesOriginal.slice(cursorOriginal,
          cursorOriginal + shiftOriginal);
      var modifiedChunk = linesModified.slice(cursorModified,
          cursorModified + shiftModified);

      var chunk = d.Parser.getChunk(originalChunk, modifiedChunk,
          cursorOriginal, cursorOriginal + shiftOriginal,
          cursorModified, cursorModified + shiftModified,
          d.Parser.LineType.NULL);

      chunk = d.Parser.parseChunkInline(chunk, change.ranges);

      for (var i = 0, l = parsers.length; i < l; i++) {
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
   * Splits chunk of code to little chunks, which are marks as changed, deleted,
   * added or unchanged.
   * @param {d.Parser.OutputLine} chunk
   * @param {Array.<d.Parser.InlineModification>} ranges
   * @return {d.Parser.OutputLine}
   */
  d.Parser.parseChunkInline = function(chunk, ranges) {
    var joinOriginal = chunk.original.join('');
    var joinModified = chunk.modified.join('');

    if (!ranges) {
      // todo(igor.alexeenko): Hack.
      // Trying to implement the same format for all kinds of changes.
      ranges = /** @type {Array.<d.Parser.InlineModification>} */ ([{
        type: chunk.type,
        oldChars: joinOriginal.length || 0,
        newChars: joinModified.length || 0
      }]);
    }

    var chunkOriginal = [],
        chunkModified = [];

    var cursorOriginal = 0,
        cursorModified = 0;

    ranges.forEach(function(range) {
      var shiftOriginal = range.oldChars || range.chars || 0;
      var shiftModified = range.newChars || range.chars || 0;

      var substrOriginal = joinOriginal.substr(cursorOriginal, shiftOriginal);
      var substrModified = joinModified.substr(cursorModified, shiftModified);

      var substrOriginalFrom = d.Parser.getInlinePosition(cursorOriginal,
          chunk.original);
      var substrOriginalTo = d.Parser.getInlinePosition(
          cursorOriginal + shiftOriginal, chunk.original);

      var substrModifiedFrom = d.Parser.getInlinePosition(cursorModified,
          chunk.modified);
      var substrModifiedTo = d.Parser.getInlinePosition(
          cursorModified + shiftModified, chunk.modified);

      chunkOriginal.push(
          d.Parser.getInlineChunk(substrOriginal, d.Parser.LineType.NULL,
              substrOriginalFrom, substrOriginalTo));
      chunkModified.push(
          d.Parser.getInlineChunk(substrModified, d.Parser.LineType.NULL,
              substrModifiedFrom, substrModifiedTo));

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
   * @return {d.Parser.InlinePosition}
   */
  d.Parser.getInlinePosition = function(charNumber, codeLines) {
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

    var result = {
      line: lineIndex
    };

    result['char'] = inlineCharIndex;

    return /** @type {d.Parser.InlinePosition} */ (result);
  };

  /**
   * Creates object, which represents chunk of code.
   * @static
   * @param {Array.<string>} original
   * @param {Array.<string>} modified
   * @param {number} originalFrom
   * @param {number} originalTo
   * @param {number} modifiedFrom
   * @param {number} modifiedTo
   * @param {d.Parser.LineType} type
   * @return {d.Parser.OutputLine}
   */
  d.Parser.getChunk = function(original, modified, originalFrom, originalTo,
      modifiedFrom, modifiedTo, type) {
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
   * Returns object, which represents part of inline changes in chunk of code.
   * @static
   * @param {string} code
   * @param {d.Parser.LineType} type
   * @param {d.Parser.InlinePosition} from
   * @param {d.Parser.InlinePosition} to
   * @return {d.Parser.OutputLineContent}
   */
  d.Parser.getInlineChunk = function(code, type, from, to) {
    return {
      code: code,
      type: type,
      from: from,
      to: to
    };
  };

  /**
   * List of parsers, which will be applied to unchanged code.
   * @type {Array}
   * @protected
   */
  d.Parser.prototype.unchangedParsers = [];

  /**
   * List of parsers, which will be applied to modified code.
   * @type {Array}
   * @protected
   */
  d.Parser.prototype.modifiedParsers = [];

  return d.Parser;
});
