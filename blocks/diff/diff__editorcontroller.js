/**
 * @fileoverview Base editor controller. Class, which abstracts interactions
 * with editor for DiffTool and represents basic interface: enabling, disabling,
 * setting content, setting editor editable.
 * @author igor.alexeenko (Igor Alekseyenko)
 */

define(['diff/diff__tools', 'diff/diff__parser'], function(diffTool) {
  'use strict';

  /**
   * @param {Element} element
   * @param {boolean=} opt_editable
   * @param {function=} opt_parser
   * @constructor
   */
  diffTool.EditorController = function(element, opt_editable, opt_parser) {
    this.element_ = element;

    if (diffTool.isDef(opt_editable)) {
      this.editable_ = /** @type {!boolean} */ (opt_editable);
    }

    this.codeParser_ = diffTool.isDef(opt_parser) ? opt_parser :
        diffTool.Parser.getInstance();
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
   * @param {boolean=} opt_refresh
   */
  diffTool.EditorController.prototype.setContent = function(original,
                                                            modified, diff,
                                                            opt_refresh) {
    // todo(igor.alexeenko): Do I need to throw an error here?
    if (this.isEnabled()) {
      if (this.contentOriginal_ !== original) {
        /**
         * @type {string}
         * @private
         */
        this.contentOriginal_ = original;
      }

      if (this.contentModified_ !== modified) {
        /**
         * @type {string}
         * @private
         */
        this.contentModified_ = modified;
      }

      if (this.diff_ !== diff) {
        /**
         * Information about difference between original and modified content.
         * @type {diffTool.Parser.Diff}
         * @private
         */
        this.diff_ = diff;
      }

      this.setContentInternal(original, modified, diff, opt_refresh);
    }
  };

  /**
   * @param {string} original
   * @param {string} modified
   * @param {diffTool.Parser.Diff} diff
   * @param {boolean=} opt_refresh
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
