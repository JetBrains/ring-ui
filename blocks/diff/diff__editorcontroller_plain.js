/**
 * @fileoverview Controller for not changed files.
 * @author igor.alexeenko (Igor Alekseyenko)
 */

define([
  'diff/diff__tools',
  'codemirror',
  'diff/diff__editorcontroller'
], function(d, CodeMirror) {
  /**
   * @param {Element} element
   * @constructor
   * @extends {d.EditorController}
   */
  d.PlainEditorController = function(element) {
    d.PlainEditorController.super_.constructor.call(this, element);
  };
  d.inherit(d.PlainEditorController, d.EditorController);

  /**
   * @enum {string}
   */
  d.PlainEditorController.ClassName = {
    BASE: 'ring-diff__plain-editor'
  };

  /**
   * @type {CodeMirror}
   * @private
   */
  d.PlainEditorController.prototype.editor_ = null;

  /**
   * @override
   */
  d.PlainEditorController.prototype.setEnabledInternal = function(enabled) {
    if (enabled === true) {
      /**
       * @type {Element}
       * @private
       */
      this.editorElement_ = document.createElement('div');
      this.editorElement_.className = d.PlainEditorController.ClassName.BASE;
      this.element_.appendChild(this.editorElement_);

      this.editor_ = new CodeMirror(this.editorElement_,
          d.PlainEditorController.getCodeMirrorOptions());
    } else {
      this.editorElement_.parent.removeChild(this.editorElement_);
      this.editorElement_ = null;
    }
  };

  /**
   * @override
   */
  d.PlainEditorController.prototype.setContentInternal = function(original,
      modified, diff) {
    var usedContent = diff[0].oldLines === 0 ? modified : original;
    this.editor_.setValue(usedContent);
  };

  /**
   * @return {CodeMirror}
   */
  d.PlainEditorController.prototype.getCodeMirror = function() {
    return this.editor_;
  };

  /**
   * Returns {@code Object} which represents parameters for {@link CodeMirror}
   * editor's instance.
   * @static
   * @return {Object}
   */
  d.PlainEditorController.getCodeMirrorOptions = function() {
    return {
      lineNumbers: true,
      readOnly: true
    };
  };

  return d.PlainEditorController;
});
