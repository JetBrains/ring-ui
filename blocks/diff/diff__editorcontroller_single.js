/**
 * @fileoverview Controller for single-pane editor.
 * @author igor.alexeenko (Igor Alexeenko)
 */

define(['codemirror', 'diff/diff__tools',
  'diff/diff__editorcontroller'], function(CodeMirror, diffTool) {
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
   * @override
   */
  diffTool.SingleEditorController.prototype.setEnabledInternal = function(
      enabled) {
    if (enabled) {
      var editorElement = document.createElement('div');
      var codeMirrorOptions = diffTool.EditorController.getCodeMirrorOptions(
          this.isEditable());

      this.element_.appendChild(editorElement);

      /**
       * @type {CodeMirror}
       * @private
       */
      this.codeMirror_ = new CodeMirror(editorElement, codeMirrorOptions);
    } else {
      // todo(igor.alexeenko): find out, how to destroy {@link CodeMirror}
      // properly.
      this.codeMirror_ = null;

      // todo(igor.alexeenko): solid way to cleanup element.
      this.element_.innerHTML = '';
    }
  };

  /**
   * @override
   */
  diffTool.SingleEditorController.prototype.setEditableInternal = function(
      editable) {
    if (this.codeMirror_) {
      this.codeMirror_.setOption('readOnly', !editable);
    }
  };

  /**
   * @override
   */
  diffTool.SingleEditorController.prototype.setContentInternal = function(
      original) {
    this.codeMirror_.setValue(original);
  };
});
