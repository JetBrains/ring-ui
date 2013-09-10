/**
 * @fileoverview Base class of parser of diff-API response.
 * @author igor.alexeenko (Igor Alekseyenko)
 */

define([
  'diff/diff__tools'
], function(diffTool) {
  /**
   * @constructor
   */
  diffTool.Parser = function() {};
  diffTool.addSingletonGetter(diffTool.Parser);

  /**
   * @typedef {Array.<diffTool.Parser.LineModification>}
   */
  diffTool.Parser.Diff = {};

  /**
   * API response of number of changed lines and kinds of changes with them.
   * @typedef {{
   *   lines: number=,
   *   newLines: number=,
   *   oldLines: number=,
   *   ranges: Array.<diffTool.SingleEditorController.InlineModification>,
   *   type: diffTool.SingleEditorController.ModificationType
   * }}
   */
  diffTool.Parser.LineModification = {};

  /**
   * Part of {@link LineModification}, which contains modifications with
   * number of chars inside of particular line.
   * @typedef {{
   *   chars: number=,
   *   newChars: number=,
   *   oldChars: number=,
   *   type: diffTool.SingleEditorController.ModificationType
   * }}
   */
  diffTool.Parser.InlineModification = {};

  /**
   * @typedef {function(
   *     outputLine: diffTool.Parser.Line,
   *     lines: Array.<string>,
   *     change: diffTool.Parser.LineModification,
   *     type: diffTool.Parser.ModificationType,
   *     lineOffset: number
   * ):diffTool.Parser.Line}
   */
  diffTool.Parser.ParserFn = diffTool.nullFunction;

  /**
   * @enum {string}
   */
  diffTool.Parser.ModificationType = {
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
   * @type {RegExp}
   */
  diffTool.Parser.EOLRegex = /^.*(\r\n|\r|\n|$)/mg;

  /**
   * @typedef {diffTool.ParserSinglePane.Buffer|Object}
   */
  diffTool.Parser.Output = {};

  /**
   * @typedef {diffTool.ParserSinglePane.BufferLine|Object}
   */
  diffTool.Parser.OutputLine = {};

  /**
   * @enum {number}
   */
  diffTool.Parser.LineType = {
    /**
     * Line is unchanged.
     */
    UNCHANGED: 0x01,

    /**
     * Line, deleted in modified code.
     */
    DELETED: 0x08,

    /**
     * Line, added to modified code.
     */
    ADDED: 0x10,

    /**
     * Line with inline changes.
     */
    INLINE: 0x20,

    /**
     * Unnecessary to display line.
     */
    FOLDED: 0x40
  };

  /**
   * Splits content to line with line separators at ends.
   * @static
   * @param {string} content
   * @return {Array.<string>}
   * @protected
   */
  diffTool.Parser.splitToLines = function(content) {
    return content.match(diffTool.Parser.EOLRegex);
  };

  /**
   * Adds or removes state from line.
   * @static
   * @param {diffTool.Parser.OutputLine} line
   * @param {diffTool.Parser.LineType} type
   * @param {boolean} enable
   */
  diffTool.Parser.enableLineType = function(line, type, enable) {
    if (line.type | this.availableLineTypes) {
      line.type = enable ? line.type | type : ~(line.type & type);
    }
  };

  /**
   * @static
   * @param {diffTool.Parser.OutputLine} line
   * @param {diffTool.Parser.LineType} type
   * @return {boolean}
   */
  diffTool.Parser.lineHasType = function(line, type) {
    return Boolean(line.type & type);
  };

  /**
   * Bit mask of {diffTool.Parser.LineType}s, used in parser.
   * @type {diffTool.Parser.LineType}
   * @protected
   */
  diffTool.Parser.prototype.availableLineTypes = 0x00;

  /**
   * @type {Array.<diffTool.Parser.ParserFn>}
   * @private
   */
  diffTool.Parser.prototype.registeredParsers_ = [];

  /**
   * @param {string} original
   * @param {string} modified
   * @param {diffTool.Parser.Diff} diff
   * @return {diffTool.Parser.Output}
   */
  diffTool.Parser.prototype.parse = diffTool.nullFunction;

  /**
   * @param {Array.<string>} lines
   * @param {Array.<diffTool.Parser.LineModification>} changes
   * @param {diffTool.Parser.ModificationType} type
   * @return {Array}
   */
  diffTool.Parser.prototype.parseLines = function(lines, changes, type) {
    var lineCursor = 0;
    var output = [];

    changes.forEach(function(change) {
      var usedLines = (change.type ===
          diffTool.Parser.ModificationType.UNCHANGED) ?
          change.lines :
          type === diffTool.Parser.ModificationType.MODIFIED ?
              change.newLines || 0 :
              change.oldLines || 0;

      var changeLines = lines.slice(lineCursor, lineCursor + usedLines);
      var modification = this.parseModification(changeLines, change, type);

      output.push(modification);
    });

    return output;
  };

  /**
   * @param {Array.<string>} lines
   * @param {diffTool.Parser.LineModification} change
   * @param {diffTool.Parser.ModificationType} type
   * @param {number} lineOffset
   * @return {diffTool.Parser.Line}
   */
  diffTool.Parser.prototype.parseModification = function(lines, change, type,
                                                         lineOffset) {
    var outputLine = this.getLine();

    this.registeredParsers_.forEach(function(parser) {
      outputLine = parser(outputLine, lines, change, type, lineOffset);
    });

    return outputLine;
  };

  /**
   * @param {string} code
   * @param {diffTool.Parser.LineType} type
   * @param {number} number
   * @return {diffTool.Parser.OutputLine}
   * @protected
   */
  diffTool.Parser.prototype.getLine = function(code, type, number) {
    return {
      code: code,
      number: number,
      type: type
    };
  };

  return diffTool.Parser;
});
