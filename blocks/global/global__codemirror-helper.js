/**
 * @fileoverview Helper for CodeMirror
 * @author igor.alexeenko (Igor Alekseyenko)
 */

define([
  'jquery',
  'diff/diff__tools'
], function($, d) {

  // todo(igor.alexeenko): I need a class for collections.

  /**
   * @constructor
   */
  var CodeMirrorHelper = function() {
    /**
     * Event handler.
     * @type {jQuery}
     * @private
     */
    this.eventHandler_ = $();
  };
  d.addSingletonGetter(CodeMirrorHelper);

  /**
   * @enum {string}
   */
  CodeMirrorHelper.EventType = {
    MODULE_LOADED: 'moduleloaded',
    MODULE_LOAD_ERROR: 'moduleloaderror'
  };

  /**
   * @typedef {Array.<function>}
   */
  CodeMirrorHelper.Buffer = [];

  /**
   * @return {jQuery}
   */
  CodeMirrorHelper.prototype.getEventHandler = function() {
    return this.eventHandler_;
  };

  /**
   * Returns operation buffer.
   * @param {CodeMirror} editor
   */
  CodeMirrorHelper.prototype.getOperationBuffer = function(editor) {
    // todo(igor.alexeenko): Temporary soluton. Monkey patch is not good.
    if (!editor.codeMirrorHelperBuffer_) {
      /**
       * @type {Array}
       * @private
       */
      editor.codeMirrorHelperBuffer_ = [];
    }

    return editor.codeMirrorHelperBuffer_;
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

    this.cleanOperationBuffer(editor);
  };

  /**
   * @param {CodeMirror} editor
   */
  CodeMirrorHelper.prototype.cleanOperationBuffer = function(editor) {
    editor.codeMirrorHelperBuffer_ = [];
  };

  /**
   * @param {CodeMirror} editor
   * @return {Array.<CodeMirror.LineHandle|CodeMirror.TextMarker>
   */
  CodeMirrorHelper.prototype.getSelectionsBuffer = function(editor) {
    if (!editor.codeMirrorHelperSelectionBuffer_) {
      /**
       * @type {Array.<CodeMirror.LineHandle|CodeMirror.TextMarker>}
       * @private
       */
      editor.codeMirrorHelperSelectionBuffer_ = [];
    }

    return editor.codeMirrorHelperSelectionBuffer_;
  };

  /**
   * @param {CodeMirror} editor
   * @param {CodeMirror.LineHandle} lineHandle
   * @return {number}
   * @throws {TypeError}
   */
  CodeMirrorHelper.prototype.addSelection = function(editor, lineHandle) {
    var buffer = this.getSelectionsBuffer(editor);
    buffer.push(lineHandle);

    return buffer.length - 1;
  };

  /**
   * @param {CodeMirror} editor
   */
  CodeMirrorHelper.prototype.cleanupSelections = function(editor) {
    // todo(igor.alexeenko): Pretty rough way.
    editor.codeMirrorHelperSelectionBuffer_ = [];
  };

  return CodeMirrorHelper;
});
