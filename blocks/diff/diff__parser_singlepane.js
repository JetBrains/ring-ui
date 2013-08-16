/**
 * @fileoverview Parser for single-paned mode of DiffTool. Parser transforms
 * original JSON response from server to JSON with code injections
 * and marks of way, how exactly those line were modified. Maybe, in future
 * this interactions will be performed on the server-side.
 * @author igor.alexeenko (Igor Alekseyenko)
 */
 
define(['diff/diff__tools', 'diff/diff__parser'], function(diffTool) {
  /**
   * @constructor
   * @extends {diffTool.Parser}
   */
  diffTool.ParserSinglePane = function() {};
  diffTool.inherit(diffTool.ParserSinglePane, diffTool.Parser);

  /**
   * Number of lines, which will be taken before and after changed code to
   * display changed code in context of file.
   * @type {number}
   * @const
   */
  diffTool.ParserSinglePane.UNCHANGED_GAP = 3;

  /**
   * Number of lines between two diffs, which we can display unfolded.
   * @type {number}
   * @const
   */
  diffTool.ParserSinglePane.FOLD_GAP = 5;

  /**
   * @typedef {Array.<diffTool.SingleEditorController.BufferLine>}
   */
  diffTool.ParserSinglePane.Buffer = [];

  /**
   * @typedef {{
   *   codeType: diffTool.SingleEditorController.ModificationType,
   *   line: string|Array.<diffTool.ParserSinglePane.BufferModifiedLine>,
   *   lineNumber: number
   * }}
   */
  diffTool.ParserSinglePane.BufferLine = {};

  /**
   * @typedef {{
   *   codeType: diffTool.SingleEditorController.ModificationType,
   *   chars: string
   * }}
   */
  diffTool.ParserSinglePane.BufferModifiedLine = {};


  /**
   * @enum {string}
   */
  diffTool.ParserSinglePane.CodeType = {
    /**
     * Line or chars from original code.
     */
    ORIGINAL: 'original',

    /**
     * Line or chars from modified code.
     */
    MODIFIED: 'modified',

    /**
     * Line, where only EOL symbol was changed.
     * Not implemented yet.
     */
    EOL_CHANGED: 'changedEol',

    /**
     * Unchanged line or chars. Does not matter, to which code it belongs,
     * because after merge it won't be changed. This lines, should not
     * be highlighted in output.
     */
    UNCHANGED: 'unchanged'
  };

  /**
   * @return {diffTool.ParserSinglePane.Buffer}
   * @override
   */
  diffTool.ParserSinglePane.prototype.parse = function(original, modified,
                                                       diff) {
    var originalEOLs = this.parseEOLTypes_(original);
    var modifiedEOLs = this.parseEOLTypes_(modified);

    var originalSeparator = Object.keys(originalEOLs).length === 1 ?
        Object.keys(originalEOLs)[0] :
        diffTool.Parser.EOLRegex.UNIVERSAL;

    var modifiedSeparator = Object.keys(modifiedEOLs).length === 1 ?
        Object.keys(modifiedEOLs)[0] :
        diffTool.Parser.EOLRegex.UNIVERSAL;

    var originalLines = original.split(originalSeparator);
    var modifiedLines = modified.split(modifiedSeparator);
  };

  // todo(igor.alexeenko): Move parsing of EOLs into base parser, cause
  // both modes requires this functionality.
  /**
   * @param {string} content
   * @return {Object.<string, number>}
   * @private
   */
  diffTool.ParserSinglePane.prototype.parseEOLTypes_ = function(content) {
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
        regex.global = true;

        if (match = content.match(regex)) {
          EOLTypes[ID] = match.length;
        }
      }
    }

    return EOLTypes;
  };
});
