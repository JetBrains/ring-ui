/**
 * @fileoverview Controller for single-pane editor.
 * @author igor.alexeenko (Igor Alexeenko)
 */

define(['diff/diff__tools',
  'diff/diff__editorcontroller'], function(diffTool) {
  'use strict';

  /**
   * @param {Element} element
   * @constructor
   * @extends {diffTool.EditorController}
   */
  diffTool.SingleEditorController = function(element) {
    diffTool.SingleEditorController.super_.constructor.call(this, element,
        false);
  };
  diffTool.inherit(diffTool.SingleEditorController, diffTool.EditorController);

  /**
   * API response of number of changed lines and kinds of changes with them.
   * @type {{
   *   lines: number=,
   *   newLines: number=,
   *   oldLines: number=,
   *   ranges: Array.<diffTool.SingleEditorController.InlineModification>,
   *   type: diffTool.SingleEditorController.ModificationType
   * }}
   */
  diffTool.SingleEditorController.LineModification = {};

  /**
   * Part of {@link LineModification}, which contains modifications with
   * number of chars inside of particular line.
   * @type {{
   *   chars: number=,
   *   newChars: number=,
   *   oldChars: number=,
   *   type: diffTool.SingleEditorController.ModificationType
   * }}
   */
  diffTool.SingleEditorController.InlineModification = {};

  /**
   * @enum {string}
   */
  diffTool.SingleEditorController.ModificationType = {
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
   * Number of lines, which will be taken before and after changed code to
   * display changed code in context of file.
   * @type {number}
   * @const
   */
  diffTool.SingleEditorController.UNCHANGED_GAP = 3;

  /**
   * @type {Array.<diffTool.SingleEditorController.BufferLine>}
   */
  diffTool.SingleEditorController.Buffer = [];

  /**
   * @type {{
   *   codeType: diffTool.SingleEditorController.ModificationType,
   *   line: string,
   *   lineNumber: number
   * }}
   */
  diffTool.SingleEditorController.BufferLine = {};


  /**
   * @enum {string}
   */
  diffTool.SingleEditorController.CodeType = {
    /**
     * Line from original code.
     */
    ORIGINAL: 'original',

    /**
     * Line from modified code.
     */
    MODIFIED: 'modified',

    /**
     * Unchanged line. Does not matter, to which code it belongs, because
     * after merge it won't be changed. This lines, should not be highlighted
     * in output.
     */
    UNCHANGED: 'unchanged'
  };

  /**
   * @static
   * @param {string} original
   * @param {string} modified
   * @param {Array.<Object>} diff
   * @return {diffTool.SingleEditorController.Buffer}
   */
  diffTool.SingleEditorController.parseCode_ = function(original, modified,
                                                        diff) {
    // todo(igor.alexeenko): Not sure about lines separator.
    var linesOriginal = original.split(/\n/);
    var linesModified = modified.split(/\n/);

    var output = /** @type {diffTool.SingleEditorController.Buffer} */ ([]);

    /**
     * Number of current line in original code.
     * @type {number}
     */
    var cursorOriginal = 0;

    /**
     * Number of current line if modified code.
     * @type {number}
     */
    var cursorModified = 0;

    var offsetOriginal, offsetModified;

    diff.forEach(function(change) {
      switch (change.type) {
      case diffTool.SingleEditorController.ModificationType.UNCHANGED:
        cursorOriginal += change.lines;
        cursorModified += change.lines;
        break;

      case diffTool.SingleEditorController.ModificationType.MODIFIED:
        offsetOriginal = cursorOriginal + change.oldLines;
        offsetModified = cursorModified + change.newLines;

        var from = diffTool.clamp(
            cursorOriginal - diffTool.SingleEditorController.UNCHANGED_GAP,
            0, linesOriginal.length - 1);

        var to = offsetOriginal +
            diffTool.SingleEditorController.UNCHANGED_GAP;

        for (var i = from; i < cursorOriginal; i++) {
          output.push({
            codeType: diffTool.SingleEditorController.CodeType.UNCHANGED,
            line: linesOriginal[i],
            lineNumber: i + 1
          });
        }

        for (i = cursorOriginal; i < offsetOriginal; i++) {
          output.push({
            codeType: diffTool.SingleEditorController.CodeType.ORIGINAL,
            line: linesOriginal[i],
            lineNumber: i + 1
          });
        }

        for (i = cursorModified; i < offsetModified; i++) {
          output.push({
            codeType: diffTool.SingleEditorController.CodeType.MODIFIED,
            line: linesModified[i],
            lineNumber: i + 1
          });
        }

        for (i = offsetOriginal; i < to; i++) {
          output.push({
            codeType: diffTool.SingleEditorController.CodeType.UNCHANGED,
            line: linesOriginal[i],
            lineNumber: i + 1
          });
        }

        break;
      }
    }, this);

    return output;
  };

  /**
   * @override
   */
  diffTool.SingleEditorController.prototype.setEnabledInternal = function(
      enabled) {
    if (enabled) {

    } else {
      this.element_.innerHTML = '';
    }
  };

  /**
   * @override
   */
  diffTool.SingleEditorController.prototype.setEditableInternal =
      diffTool.nullFunction;

  /**
   * @override
   */
  diffTool.SingleEditorController.prototype.setContentInternal = function(
      original, modified, diff) {
    // todo(igor.alexeenko): Pretty naive way to display diff. Add template.
    var parsedContent = diffTool.SingleEditorController.parseCode_(original,
        modified, diff);
    var output = [];
    var codeTypeToSymbol = diffTool.createObject(
        diffTool.SingleEditorController.CodeType.UNCHANGED, ' ',
        diffTool.SingleEditorController.CodeType.ORIGINAL, '-',
        diffTool.SingleEditorController.CodeType.MODIFIED, '+');

    output.push('<pre>');

    parsedContent.forEach(function(line) {
      output.push([line.lineNumber, codeTypeToSymbol[line.codeType],
          line.line].join(' '));
    });

    output.push('</pre>');

    this.element_.innerHTML = output.join('\n');
  };
});
