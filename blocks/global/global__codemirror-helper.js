/**
 * @fileoverview Helper for CodeMirror
 * @author igor.alexeenko (Igor Alekseyenko)
 */

define([
  'diff/diff__tools'
], function(d) {
  /**
   * @constructor
   */
  var CodeMirrorHelper = function() {};
  d.addSingletonGetter(CodeMirrorHelper);

  /**
   * @typedef {Array.<function>}
   */
  CodeMirrorHelper.Buffer = [];

  /**
   * Returns operation buffer.
   * @param {CodeMirror} editor
   */
  CodeMirrorHelper.prototype.getOperationBuffer = function(editor) {
    if (!this.buffers_) {
      /**
       * @type {Object.<CodeMirror, CodeMirrorHelper.Buffer>}
       * @private
       */
      this.buffers_ = {};
    }

    if (!this.buffers_[editor]) {
      this.buffers_[editor] = [];
    }

    return this.buffers_[editor];
  };

  /**
   * Adds operation to execute.
   * @param {CodeMirror} editor
   * @param {function} operation
   */
  CodeMirrorHelper.prototype.addOperation = function(editor, operation) {
    var buffer = this.getOperationBuffer(editor);
    buffer.push(operation);
  };

  /**
   * Executes all operations from buffer.
   * @param {CodeMirror} editor
   */
  CodeMirrorHelper.prototype.executeOperationBuffer = function(editor) {
    var buffer = this.getOperationBuffer(editor);

    editor.operation(function() {
      buffer.forEach(function(operation) {
        operation.call();
      });
    });
  };

  return CodeMirrorHelper;
});
