/**
 * @fileoverview Controller for single-pane editor.
 * @author igor.alexeenko (Igor Alexeenko)
 */

define(['diff/diff__tools', 'diff/diff__editorcontroller',
  'diff/diff__parser_singlepane'], function(diffTool) {
  'use strict';

  /**
   * @param {Element} element
   * @constructor
   * @extends {diffTool.EditorController}
   */
  diffTool.SingleEditorController = function(element) {
    diffTool.SingleEditorController.super_.constructor.call(this, element,
        false);

    /**
     * @type {diffTool.ParserSinglePane}
     * @private
     */
    this.codeParser_ = new diffTool.ParserSinglePane();
  };
  diffTool.inherit(diffTool.SingleEditorController, diffTool.EditorController);

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
    // todo(igor.alexeenko): Pretty naive way to output diff. Works for
    // debugging stage.
    var parsedContent = this.codeParser_.parse(original, modified, diff);
    var output = [];
    var codeTypeToSymbol = diffTool.createObject(
        diffTool.ParserSinglePane.LineType.UNCHANGED, ' ',
        diffTool.ParserSinglePane.LineType.ORIGINAL, '-',
        diffTool.ParserSinglePane.LineType.MODIFIED, '+');

    output.push('<pre>');

    if (!parsedContent) {
      return;
    }

    parsedContent.forEach(function(line) {
      if (line.codeType === diffTool.ParserSinglePane.LineType.FOLDED) {
        output.push('...\n');
        return;
      }

      if (typeof line.line === 'string') {
        output.push([line.originalLineNumber, line.modifiedLineNumber,
            codeTypeToSymbol[line.codeType],
            line.line].join(' '));
      } else {
        output.push([line.originalLineNumber, line.modifiedLineNumber,
            codeTypeToSymbol[line.codeType],
            (function(line) {
              var output = [];

              line.forEach(function(charsGroup) {
                if (charsGroup.codeType ===
                    diffTool.ParserSinglePane.LineType.MODIFIED) {
                  output.push('|' + charsGroup.chars + '|');
                } else {
                  output.push(charsGroup.chars);
                }
              });

              return output.join('');
            })(line.line)].join(' '));
      }
    });

    output.push('</pre>');

    this.element_.innerHTML = output.join('');
  };
});
