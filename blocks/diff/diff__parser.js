/**
 * @fileoverview Base class of parser of diff-API response.
 * @author igor.alexeenko (Igor Alekseyenko)
 */

define(['diff/diff__tools'], function(diffTool) {
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
  diffTool.Parser.ParserOutput = {};

  /**
   * @param {string} original
   * @param {string} modified
   * @param {diffTool.Parser.Diff} diff
   * @return {diffTool.Parser.ParserOutput}
   */
  diffTool.Parser.prototype.parse = diffTool.nullFunction;

  /**
   * Splits content to line with line separators at ends.
   * @param {string} content
   * @return {Array.<string>}
   * @protected
   */
  diffTool.Parser.prototype.splitToLines = function(content) {
    var lines = content.match(diffTool.Parser.EOLRegex);
    if (!lines) {
      lines = [];
    }

    return lines;
  };

  return diffTool.Parser;
});
