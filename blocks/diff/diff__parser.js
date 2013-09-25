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
   * @enum {string}
   */
  diffTool.Parser.CodeType = {
    ORIGINAL: 'original',
    MODIFIED: 'modified'
  };

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
   * @typedef {diffTool.ParserSinglePane.Line|
   *     diffTool.ParserSinglePane.LineContent}
   */
  diffTool.Parser.OutputLine = {};

  /**
   * @typedef {Object}
   */
  diffTool.Parser.InlineChange = {};

  /**
   * @enum {number}
   */
  diffTool.Parser.LineType = {
    /**
     * Null state.
     */
    NULL: 0x00,

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
   * @param {diffTool.Parser.OutputLine} line
   * @param {diffTool.Parser.LineType} type
   * @return {boolean}
   */
  diffTool.Parser.lineHasType = function(line, type) {
    return Boolean(line.type & type);
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
   * Bit mask of {diffTool.Parser.LineType}s, used in parser.
   * @type {diffTool.Parser.LineType}
   * @protected
   */
  diffTool.Parser.prototype.availableLineTypes = 0x00;

  /**
   * Adds or removes state from line.
   * @static
   * @param {diffTool.Parser.OutputLine} line
   * @param {diffTool.Parser.LineType} type
   * @param {boolean} enable
   */
  diffTool.Parser.prototype.enableLineType = function(line, type, enable) {
    if (type | this.availableLineTypes) {
      line.type = enable ? line.type | type : ~(line.type & type);
    }
  };

  /**
   * @param {string} original
   * @param {string} modified
   * @param {diffTool.Parser.Diff} diff
   * @return {diffTool.Parser.Output}
   */
  diffTool.Parser.prototype.parse = function(original, modified,
                                             diff) {
    var originalCursor = 0;
    var modifiedCursor = 0;

    var originalLines = diffTool.Parser.splitToLines(original);
    var modifiedLines = diffTool.Parser.splitToLines(modified);

    var output = [];

    diff.forEach(function(change, i) {
      var isUnchanged = (change.type ===
          diffTool.Parser.ModificationType.UNCHANGED);
      var originalOffset, modifiedOffset;
      var parsedContent;

      if (isUnchanged) {
        originalOffset = change.lines;
        modifiedOffset = change.lines;

        var usedLines = originalLines.slice(originalCursor,
            originalCursor + originalOffset);
        var isLastChange = (i === change.length - 1);

        parsedContent = this.parseUnchangedLines(usedLines, change,
            originalCursor, modifiedCursor, isLastChange);
      } else {
        originalOffset = change.oldLines || 0;
        modifiedOffset = change.newLines || 0;

        var usedOriginalLines = originalLines.slice(originalCursor,
            originalCursor + originalOffset);
        var usedModifiedLines = modifiedLines.slice(modifiedCursor,
            modifiedCursor + modifiedOffset);

        parsedContent = this.parseModifiedLines(usedOriginalLines,
            usedModifiedLines, change, originalCursor, modifiedCursor);
      }

      Array.prototype.push.apply(output, parsedContent);

      originalCursor += originalOffset;
      modifiedCursor += modifiedOffset;
    }, this);

    return output;
  };

  /**
   * @param {Array.<string>} lines
   * @param {diffTool.Parser.LineModification} change
   * @param {number} lineOriginal
   * @param {number} lineModified
   * @param {boolean=} opt_isLastChange
   * @return {diffTool.Parser.OutputLine}
   * @protected
   */
  diffTool.Parser.prototype.parseUnchangedLines = diffTool.abstractMethod;

  /**
   * @param {Array.<string>} linesOriginal
   * @param {Array.<string>} linesModified
   * @param {diffTool.Parser.LineModification} change
   * @param {number} lineOriginal
   * @param {number} lineModified
   * @return {diffTool.Parser.OutputLine}
   * @protected
   */
  diffTool.Parser.prototype.parseModifiedLines = diffTool.abstractMethod;

  /**
   * @param {string} chars
   * @param {Array.<diffTool.Parser.InlineModification>} ranges
   * @param {diffTool.Parser.CodeType} type
   * @return {diffTool.Parser.OutputLine}
   */
  diffTool.Parser.prototype.parseInlineChanges = diffTool.abstractMethod;

  /**
   * @return {diffTool.Parser.OutputLine}
   * @protected
   */
  diffTool.Parser.prototype.getLine = diffTool.nullFunction;

  /**
   * @return {diffTool.ParserSinglePane.LineContent}
   * @protected
   */
  diffTool.Parser.prototype.getLineContent = diffTool.nullFunction;

  return diffTool.Parser;
});
