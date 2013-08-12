/**
 * @fileoverview DiffTool — tool, which allows to display diff of two files
 * in single-, double- and triple-pane modes. In multi-pane mode content might
 * be editable, but this is optional. In multi-pane modes there are connectors
 * between changed parts of code in different panels. When scroll the through
 * the connector, speed of scrolling in part in which more code increases.
 * @author igor.alexeenko (Igor Alekseyenko)
 */

define(['diff/diff__tools', 'jquery', 'global/global__modules',
  'diff/diff__editorcontroller'], function(diffTool, $, Module) {
  'use strict';

  // todo(igor.alexeenko): If number of arguments increases, replace
  // setting of parameters as listing of constructor arguments to typed
  // object.
  /**
   * @param {boolean=} opt_editable
   * @param {Element=} opt_element
   * @param {DiffTool.Mode=} opt_mode
   * @constructor
   */
  var DiffTool = function(opt_editable, opt_element, opt_mode) {
    if (diffTool.isDef(opt_mode)) {
      opt_mode = opt_mode & this.availableModes ? opt_mode : this.defaultMode;
    }

    if (diffTool.isDef(opt_editable)) {
      opt_editable = Boolean(opt_editable);
    }

    this.setMode(diffTool.isDef(opt_mode) ? opt_mode : this.defaultMode);
    this.setEditable(diffTool.isDef(opt_editable) ? opt_editable :
        this.editable_);

    this.element_ = diffTool.isDef(opt_element) ? opt_element :
        document.createElement('div');
  };

  /**
   * IDs of modes in which DiffTool might work
   * @enum {number}
   */
  DiffTool.Mode = {
    /**
     * Shortcut, which allows to check, whether all modes are disabled.
     */
    NONE_: 0x00,

    /**
     * Shortcut for all enabled modes.
     */
    ALL_: 0xFF,

    /**
     * DiffTool displays as single pane with code which displays similarly to
     * patch files — lines of deleted code and then, lines of new code.
     */
    SINGLE_PANE: 0x01,

    /**
     * DiffTool displays as two separate editors with original code in left
     * part and modified code in right part. Optionally, content in original
     * editor might be editable.
     */
    DOUBLE_PANE: 0x02,

    /**
     * Not impletented yet.
     */
    TRIPLE_PANE: 0x04
  };

  /**
   * Mode in which DiffTool initializes by default.
   * @type {number}
   * @protected
   */
  DiffTool.prototype.defaultMode = DiffTool.Mode.SINGLE_PANE;

  /**
   * Modes, which are available for current DiffTool.
   * @type {number}
   * @protected
   */
  DiffTool.prototype.availableModes =
      DiffTool.Mode.SINGLE_PANE |
      DiffTool.Mode.DOUBLE_PANE;

  /**
   * Bit mask of current mode of DiffTool. Default value is
   * {@link DiffTool.Mode.NONE_} but it overrides in constructor on
   * initialization of module.
   * @type {DiffTool.Mode}
   * @private
   */
  DiffTool.prototype.mode_ = DiffTool.Mode.NONE_;

  /**
   * Whether code in editor is editable or not.
   * @type {boolean}
   * @private
   */
  DiffTool.prototype.editable_ = false;

  /**
   * @type {Element}
   * @private
   */
  DiffTool.prototype.element_ = null;

  /**
   * @type {diffTool.EditorController}
   * @private
   */
  DiffTool.prototype.controller_ = null;

  /**
   * @param {DiffTool.Mode} mode
   */
  DiffTool.prototype.setMode = function(mode) {
    if (Boolean(this.availableModes & mode) && this.mode_ !== mode) {
      this.mode_ = mode;
      this.setModeInternal(mode);
    }
  };

  /**
   * @param {DiffTool.Mode} mode
   * @protected
   */
  DiffTool.prototype.setModeInternal = function(mode) {
    if (!this.modeToController_) {
      var singleModeController = new diffTool.EditorController();
      var doubleModeController = new diffTool.EditorController();

      /**
       * Lookup table of {@link DiffTool.Mode}s to {diffTool.EditorController}s.
       * @type {Object.<DiffTool.Mode, diffTool.EditorController>}
       * @private
       */
      this.modeToController_ = diffTool.createObject(
          DiffTool.Mode.SINGLE_PANE, singleModeController,
          DiffTool.Mode.DOUBLE_PANE, doubleModeController);
    }

    if (this.controller_ !== null) {
      this.controller_.setEnabled(false);
    }

    this.controller_ = this.modeToController_[mode];

    // todo(igor.alexeenko): Implement those settings through states to
    // prevent manual setting of every DiffTool state in EditorController.
    this.controller_.setEnabled(true);
    this.controller_.setEditable(this.isEditable());
  };

  /**
   * @return {DiffTool.Mode}
   */
  DiffTool.prototype.getMode = function() {
    return this.mode_;
  };

  /**
   * @param {boolean} editable
   */
  DiffTool.prototype.setEditable = function(editable) {
    if (editable !== this.editable_) {
      this.editable_ = editable;
      this.controller_.setEditable(editable);
    }
  };

  /**
   * @return {boolean}
   */
  DiffTool.prototype.isEditable = function() {
    return this.editable_;
  };

  /**
   * @param {Element} opt_parentElement
   */
  DiffTool.prototype.render = function(opt_parentElement) {
    if (!diffTool.isDef(opt_parentElement)) {
      opt_parentElement = document.body;
    }

    opt_parentElement.appendChild(this.element_);
  };

  /**
   * Removes component from document, clears all of its custom subscriptions.
   */
  DiffTool.prototype.unrender = function() {
    $(this.element_).remove();
  };

  Module.add('diff', {
    getDiffTool: {
      method: function() {
        return DiffTool;
      },
      override: true
    },

    // NB! diffTool namespace is exporting only to make possible to test
    // items from it.
    getDiffToolUtils: {
      method: function() {
        return diffTool;
      },
      override: true
    }
  });

  return DiffTool;
});
