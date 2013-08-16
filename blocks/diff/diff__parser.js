/**
 * @fileoverview Base class of parser of diff-API response.
 * @author igor.alexeenko (Igor Alekseyenko)
 */

define(['diff/diff__tools'], function(diffTool) {
  /**
   * @constructor
   */
  diffTool.Parser = function() {};

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
   * @enum {RegExp}
   */
  diffTool.Parser.EOLRegex = {
    /**
     * Windows-style line-endings.
     */
    CR_LF: /\r\n/g,

    /**
     * UNIX- and OS X-style line-endings.
     */
    LF: /\n/g,

    /**
     * Classic Mac style of line-endings.
     */
    CR: /\r/g,

    /**
     * Used to split file by line endings, does not matter, which type of them
     * it used.
     */
    UNIVERSAL: /\r\n|\n|\r/g
  };

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
});
