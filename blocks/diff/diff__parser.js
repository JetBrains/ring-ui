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
   * @enum {RegExp}
   */
  diffTool.Parser.EOLRegex = {
    /**
     * Windows-style line-endings.
     */
    CR_LF: /.*(\r\n|$)/g,

    /**
     * UNIX- and OS X-style line-endings.
     */
    LF: /.*(\n|$)/g,

    /**
     * Classic Mac style of line-endings.
     */
    CR: /.*(\r|$)/g,

    /**
     * Used to split file by line endings, does not matter, which type of them
     * it used.
     */
    UNIVERSAL: /.*(\r\n|\n|\r|$)/g
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

  /**
   * @param {string} content
   * @return {Object.<string, number>}
   * @private
   */
  diffTool.Parser.prototype.parseEOLTypes_ = function(content) {
    var EOLTypes = {};
    var regex;
    var match;

    var excludeRegex = {
      UNIVERSAL: true
    };

    for (var ID in diffTool.Parser.EOLRegex) {
      if (diffTool.Parser.EOLRegex.hasOwnProperty(ID) &&
          !(ID in excludeRegex)) {
        regex = diffTool.Parser.EOLRegex[ID];
        match = content.match(regex);

        if (match) {
          EOLTypes[ID] = match.length;
        }
      }
    }

    return EOLTypes;
  };

  /**
   * Splits content to line with line separators at ends.
   * @param {string} content
   * @return {Array.<string>}
   * @protected
   */
  diffTool.Parser.prototype.splitToLines = function(content) {
    var linesWithoutEOL;
    var EOLs = this.parseEOLTypes_(content);

    var regex = Object.keys(EOLs).length === 1 ?
        diffTool.Parser.EOLRegex[Object.keys(EOLs)[0]] :
        diffTool.Parser.EOLRegex.UNIVERSAL;

    var lines = content.match(regex);
    if (!lines) {
      lines = [];
    } else {
      linesWithoutEOL = content.split(/\r\n|\r|\n/);
      if (lines.length !== linesWithoutEOL.length) {
        lines.push(linesWithoutEOL.slice(-1)[0]);
      }
    }

    return lines;
  };

  return diffTool.Parser;
});
