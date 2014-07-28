/**
 * @fileoverview Controller for not changed files.
 * @author igor.alexeenko (Igor Alekseyenko)
 */

var Tools = require('../diff__tools');
var EditorController = require('./diff__editorcontroller');
var CodeMirror = require('codemirror');

/**
 * @param {Element} element
 * @constructor
 * @extends {EditorController}
 */
var PlainEditorController = function (element) {
  PlainEditorController.super_.constructor.call(this, element);
};
Tools.inherit(PlainEditorController, EditorController);

/**
 * @enum {string}
 */
PlainEditorController.ClassName = {
  BASE: 'ring-diff__plain-editor',
  BASE_DIFF: 'ring-diff'
};

/**
 * @type {CodeMirror}
 * @private
 */
PlainEditorController.prototype.editor_ = null;

/**
 * @override
 */
PlainEditorController.prototype.setEnabledInternal = function (enabled) {
  if (enabled === true) {
    /**
     * @type {Element}
     * @private
     */
    this.editorElement_ = document.createElement('div');
    this.editorElement_.className = [
      PlainEditorController.ClassName.BASE,
      PlainEditorController.ClassName.BASE_DIFF
    ].join(' ');
    this.element_.appendChild(this.editorElement_);

    this.editor_ = new CodeMirror(this.editorElement_,
      PlainEditorController.getCodeMirrorOptions());
  } else {
    this.editorElement_.parentNode.removeChild(this.editorElement_);
    this.editorElement_ = null;
  }
};

/**
 * @override
 */
PlainEditorController.prototype.setContentInternal = function (original, modified, diff) {
  if (!diff.length) {
    return;
  }

  var usedContent = diff[0].oldLines === 0 ? modified : original;

  if (this.editor_.getValue() !== usedContent) {
    this.editor_.setValue(usedContent);
  }
};

/**
 * @return {CodeMirror}
 */
PlainEditorController.prototype.getEditor = function () {
  return this.editor_;
};

/**
 * Returns an editor properties object.
 * @static
 * @return {Object}
 */
PlainEditorController.getCodeMirrorOptions = function () {
  return {
    lineNumbers: true,
    readOnly: true
  };
};

// Export CodeMirror
global.CodeMirror = global.CodeMirror || CodeMirror;

module.exports = PlainEditorController;
