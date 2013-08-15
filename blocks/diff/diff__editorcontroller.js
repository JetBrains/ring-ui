/**
 * @fileoverview Base editor controller. Class, which abstracts interactions
 * with editor for DiffTool and represents basic interface: enabling, disabling,
 * setting content, setting editor editable.
 * @author igor.alexeenko (Igor Alekseyenko)
 */

define(['diff/diff__tools', 'diff/diff__parser'], function(diffTool) {
  'use strict';

  // NB! Fragile code. Add EditorController class to utility namespace, which
  // is defined in diff__tools.js. It means, that diff__tools.js should always
  // called before this file. Not sure, how require.js resolves it, but it
  // seems to me, that is is works fine. But if we had a tool, which resolves
  // namespaces, it would be better.
  /**
   * @param {Element} element
   * @param {boolean=} opt_editable
   * @constructor
   */
  diffTool.EditorController = function(element, opt_editable) {
    this.element_ = element;

    if (diffTool.isDef(opt_editable)) {
      this.editable_ = /** @type {!boolean} */ (opt_editable);
    }
  };

  /**
   * @type {boolean}
   * @private
   */
  diffTool.EditorController.prototype.enabled_ = false;

  /**
   * @type {boolean}
   * @private
   */
  diffTool.EditorController.prototype.editable_ = true;

  /**
   * @type {Element}
   * @private
   */
  diffTool.EditorController.prototype.element_ = null;

  /**
   * @type {diffTool.Parser}
   * @private
   */
  diffTool.EditorController.prototype.codeParser_ = null;

  /**
   * @param {boolean} editable
   */
  diffTool.EditorController.prototype.setEditable = function(editable) {
    if (editable !== this.editable_) {
      this.editable_ = editable;
      this.setEditableInternal(editable);
    }
  };

  /**
   * @param {boolean} editable
   * @protected
   */
  diffTool.EditorController.prototype.setEditableInternal =
      diffTool.nullFunction;

  /**
   * @return {boolean}
   */
  diffTool.EditorController.prototype.isEditable = function() {
    return this.editable_;
  };

  /**
   * @param {string} original
   * @param {string} modified
   * @param {diffTool.Parser.Diff} diff
   */
  diffTool.EditorController.prototype.setContent = function(original,
                                                            modified, diff) {
    /**
     * @type {string}
     * @private
     */
    this.contentOriginal_ = original;

    /**
     * @type {string}
     * @private
     */
    this.contentModified_ = modified;

    /**
     * Information about difference between original and modified content.
     * @type {diffTool.Parser.Diff}
     * @private
     */
    this.diff_ = diff;

    this.setContentInternal(original, modified, diff);
  };

  /**
   * @param {string} original
   * @param {string} modified
   * @param {diffTool.Parser.Diff} diff
   * @protected
   */
  diffTool.EditorController.prototype.setContentInternal =
      diffTool.nullFunction;

  /**
   * @param {boolean} enabled
   */
  diffTool.EditorController.prototype.setEnabled = function(enabled) {
    if (enabled !== this.enabled_) {
      this.enabled_ = enabled;
      this.setEnabledInternal(enabled);
    }
  };

  /**
   * @param {boolean} enabled
   */
  diffTool.EditorController.prototype.setEnabledInternal =
      diffTool.nullFunction;

  /**
   * @return {boolean}
   */
  diffTool.EditorController.prototype.isEnabled = function() {
    return this.enabled_;
  };

  return diffTool.EditorController;
});
