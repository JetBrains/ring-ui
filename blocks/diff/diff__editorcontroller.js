/**
 * @fileoverview Base editor controller. Class, which abstracts interactions
 * with editor for DiffTool and represents basic interface: enabling, disabling,
 * setting content, setting editor editable.
 * @author igor.alexeenko (Igor Alekseyenko)
 */

define(['diff/diff__tools'], function(diffTool) {
  'use strict';

  // NB! Fragile code. Add EditorController class to utility namespace, which
  // is defined in diff__tools.js. It means, that diff__tools.js should always
  // called before this file. Not sure, how require.js resolves it, but it
  // seems to me, that is is works fine. But if we had a tool, which resolves
  // namespaces, it would be better.
  /**
   * @param {boolean=} opt_editable
   * @constructor
   */
  diffTool.EditorController = function(opt_editable) {
    if (diffTool.isDef(opt_editable)) {
      this.editable_ = opt_editable;
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
  diffTool.EditorController.prototype.editable_ = false;

  /**
   * @param {boolean} editable
   */
  diffTool.EditorController.prototype.setEditable = function(editable) {
    if (editable !== this.editable_) {
      this.editable_ = editable;
      this.setEditableInternal(editable);
    }
  };

  // NB!(igor.alexeenko): Tests runner does not allow to equal internal
  // methods to {diffTool.abstractMethod}s, because it's always falls, when
  // some method raises an exception.
  // todo(igor.alexeenko): Change all internal methods to nullFunction
  // when child classes implements.
  /**
   * @param {boolean} editable
   * @protected
   */
  diffTool.EditorController.prototype.setEditableInternal =
      diffTool.nullFunction;

  /**
   * @param {string} original
   * @param {string} modified
   */
  diffTool.EditorController.prototype.setContent = function(original,
                                                            modified) {
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

    this.setContentInternal(original, modified);
  };

  /**
   * @param {string} original
   * @param {string} modified
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

  return diffTool.EditorController;
});
