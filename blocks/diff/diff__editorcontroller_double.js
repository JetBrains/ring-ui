/**
 * @fileoverview Controller for double-pane editor.
 * @author igor.alexeenko (Igor Alexeenko)
 */

define(['diff/diff__tools', 'codemirror', 'handlebars',
  'diff/diff__editorcontroller'], function(diffTool, CodeMirror, Handlebars) {
  /**
   * @param {Element} element
   * @constructor
   * @extends {diffTool.EditorController}
   */
  diffTool.DoubleEditorController = function(element) {
    diffTool.DoubleEditorController.super_.constructor.call(this, element,
        true);
  };
  diffTool.inherit(diffTool.DoubleEditorController, diffTool.EditorController);

  /**
   * IDs of templates for {@link Handlebars}.
   * @enum {string}
   */
  diffTool.DoubleEditorController.Template = {
    BASE: 'diff__doublepane'
  };

  /**
   * @enum {string}
   */
  diffTool.DoubleEditorController.CssClass = {
    BASE: 'diff_doublepane',
    ORIGINAL: 'diff__original',
    MODIFIED: 'diff__modified'
  };

  /**
   * @override
   */
  diffTool.DoubleEditorController.prototype.setEnabledInternal = function(
      enabled) {
    if (enabled) {
      this.element_.innerHTML = Handlebars.partials[
          diffTool.DoubleEditorController.Template.BASE]();

      this.originalElement_ = this.element_.querySelector(
          '.' + diffTool.DoubleEditorController.CssClass.ORIGINAL);
      this.modifiedElement_ = this.element_.querySelector(
          '.' + diffTool.DoubleEditorController.CssClass.MODIFIED);

      this.codeMirrorOriginal_ = new CodeMirror(this.originalElement_);
      this.codeMirrorModified_ = new CodeMirror(this.modifiedElement_);
    } else {
      this.codeMirrorOriginal_ = null;
      this.codeMirrorModified_ = null;

      this.element_.innerHTML = '';
    }
  };

  /**
   * @override
   */
  diffTool.DoubleEditorController.prototype.setContentInternal = function(
      original, modified, diff) {
    this.codeMirrorOriginal_.setValue(original);
    this.codeMirrorModified_.setValue(modified);

    this.diff_ = diff; // temporary note, to prevent jshint errors.
  };
});
