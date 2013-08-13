/**
 * @fileoverview DiffTool — tool, which allows to display diff of two files
 * in single-, double- and triple-pane modes. In multi-pane mode content might
 * be editable, but this is optional. In multi-pane modes there are connectors
 * between changed parts of code in different panels. When scroll the through
 * the connector, speed of scrolling in part in which more code increases.
 * @author igor.alexeenko (Igor Alekseyenko)
 */

define(['diff/diff__tools', 'jquery', 'global/global__modules',
  'diff/diff__editorcontroller',
  'diff/diff__editorcontroller_single',
  'diff/diff__editorcontroller_double'], function(diffTool, $, Module) {
  'use strict';

  // NB! Now, when DiffTool creates, I expect, that DOM-element is already
  // in DOM and I can start render {DiffTool} immediately. In other words,
  // {DiffTool} rather decorates DOM, then renders its own element.
  // It means, that initialization of {DiffTool} occurs in two steps:
  // first, creates instance of class {DiffTool}, which decorates element,
  // and then, calls method {@link DiffTool.setContent}, which fills
  // editor with required content.

  /**
   * @param {Element=} opt_element
   * @param {DiffTool.Mode=} opt_mode
   * @constructor
   */
  var DiffTool = function(opt_element, opt_mode) {
    if (diffTool.isDef(opt_mode)) {
      opt_mode = opt_mode & this.availableModes ? opt_mode : this.defaultMode;
    }

    this.element_ = diffTool.isDef(opt_element) ? opt_element :
        document.createElement('div');

    this.setMode(diffTool.isDef(opt_mode) ? opt_mode : this.defaultMode);
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
      var singleModeController = new diffTool.SingleEditorController(
          this.element_);
      var doubleModeController = new diffTool.DoubleEditorController(
          this.element_);

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

    this.controller_.setEnabled(true);
  };

  /**
   * @return {DiffTool.Mode}
   */
  DiffTool.prototype.getMode = function() {
    return this.mode_;
  };

  /**
   * @return {diffTool.EditorController}
   */
  DiffTool.prototype.getController = function() {
    return this.controller_;
  };

  Module.add('diff', {
    getDiffTool: {
      method: function() {
        return DiffTool;
      },
      override: true
    },

    // NB! diffTool namespace is exporting only to make possible to test
    // items from it. diffTool namespace should be encapsulated by DiffTool,
    // to leave only one entering point to application.
    getDiffToolUtils: {
      method: function() {
        return diffTool;
      },
      override: true
    }
  });

  return DiffTool;
});
