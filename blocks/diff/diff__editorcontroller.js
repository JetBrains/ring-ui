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
   * @param {boolean=} opt_editable
   * @param {string=} opt_value
   * @return {Object}
   * @static
   */
  diffTool.EditorController.getCodeMirrorOptions = function(opt_editable,
                                                            opt_value) {
    var indentUnit = 4;
    var indentWithTabs = false;
    var tabSize = 4;
    var readonly = diffTool.isDef(opt_editable) ? !opt_editable : true;

    if (diffTool.isDef(opt_value)) {
      indentWithTabs = Boolean(opt_value.match(/\n?(\t+)/g).length);

      // todo(igor.alexeenko): In case, when text indented with spaces,
      // count size of indentation (tabSize and indentUnit).
    }

    return {
      indentUnit: indentUnit,
      indentWithTabs: indentWithTabs,
      lineNumbers: true,
      readOnly: readonly,
      smartIndent: true,
      tabMode: 'indent',
      tabSize: tabSize
    };
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
   * @return {boolean}
   */
  diffTool.EditorController.prototype.isEditable = function() {
    return this.editable_;
  };

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
