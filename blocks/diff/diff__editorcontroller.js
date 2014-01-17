/**
 * @fileoverview Base editor controller. Class, which abstracts interactions
 * with editor for DiffTool and represents basic interface: enabling, disabling,
 * setting content, setting editor editable.
 * @author igor.alexeenko (Igor Alekseyenko)
 */

define([
  'diff/diff__tools',
  'diff/diff__parser'
], function(d) {
  /**
   * @param {Element} element
   * @param {function=} opt_parser
   * @constructor
   */
  d.EditorController = function(element, opt_parser) {
    this.element_ = element;

    this.codeParser_ = d.isDef(opt_parser) ? opt_parser :
        d.Parser.getInstance();
  };

  /**
   * @type {boolean}
   * @private
   */
  d.EditorController.prototype.enabled_ = false;

  /**
   * @type {Element}
   * @private
   */
  d.EditorController.prototype.element_ = null;

  /**
   * @type {d.Parser}
   * @private
   */
  d.EditorController.prototype.codeParser_ = null;

  /**
   * @param {string} original
   * @param {string} modified
   * @param {d.Parser.Diff} diff
   * @param {boolean=} opt_refresh
   */
  d.EditorController.prototype.setContent = function(original, modified, diff,
                                                     opt_refresh) {
    if (!this.isEnabled()) {
      throw new Error('Controller is not enabled. You can not set content ' +
          'to deactivated controller.');
    }

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
  };

  /**
   * @param {string} original
   * @param {string} modified
   * @param {d.Parser.Diff} diff
   * @param {boolean=} opt_refresh
   * @protected
   */
  d.EditorController.prototype.setContentInternal =
      d.nullFunction;

  /**
   * @return {string}
   */
  d.EditorController.prototype.getOriginal = function() {
    return this.original_;
  };

  /**
   * @return {string}
   */
  d.EditorController.prototype.getModified = function() {
    return this.modified_;
  };

  /**
   * @return {diffTool.Parser.Diff}
   */
  d.EditorController.prototype.getDiff = function() {
    return this.diff_;
  };

  /**
   * @param {boolean} enabled
   */
  d.EditorController.prototype.setEnabled = function(enabled) {
    if (enabled !== this.enabled_) {
      this.enabled_ = enabled;
      this.setEnabledInternal(enabled);
    }
  };

  /**
   * @param {boolean} enabled
   */
  d.EditorController.prototype.setEnabledInternal =
      d.nullFunction;

  /**
   * @return {boolean}
   */
  d.EditorController.prototype.isEnabled = function() {
    return this.enabled_;
  };

  return d.EditorController;
});
