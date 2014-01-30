/**
 * @fileoverview DiffTool — tool, which allows to display diff of two files
 * in single-, double- and triple-pane modes. In multi-pane mode content might
 * be editable, but this is optional. In multi-pane modes there are connectors
 * between changed parts of code in different panels. When scroll the through
 * the connector, speed of scrolling in part in which more code increases.
 * @author igor.alexeenko (Igor Alekseyenko)
 */

define([
  'diff/diff__tools',
  'global/global__modules',
  'jquery',
  'diff/diff__editorcontroller_single',
  'diff/diff__editorcontroller_double',
  'diff/diff__editorcontroller_plain'
], function(d, Module, $) {
  /**
   * @param {Element=} opt_element
   * @param {DiffTool.Mode=} opt_mode
   * @constructor
   */
  var DiffTool = function(opt_element, opt_mode) {
    if (d.isDef(opt_mode)) {
      opt_mode = Boolean(opt_mode & this.availableModes) ?
          opt_mode :
          this.defaultMode;
    }

    this.element_ = d.isDef(opt_element) ? opt_element :
        document.createElement('div');

    this.setMode(d.isDef(opt_mode) ? opt_mode : this.defaultMode);
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
    TRIPLE_PANE: 0x04,

    /**
     * If content of one of files is missing, shows content of file without
     * any other marks.
     */
    PLAIN_FILE: 0x08,

    /**
     * Not implemented yet. Will show two contents of binary files.
     */
    BINARY: 0x10
  };

  /**
   * @enum {string}
   */
  DiffTool.EventType = {
    AFTER_RENDER: 'afterrender'
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
      DiffTool.Mode.PLAIN_FILE |
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
   * @type {d.EditorController}
   * @private
   */
  DiffTool.prototype.controller_ = null;

  /**
   * @type {boolean}
   * @private
   */
  DiffTool.prototype.modeIsActive_ = false;

  /**
   * @param {DiffTool.Mode} mode
   */
  DiffTool.prototype.setMode = function(mode) {
    if (Boolean(this.availableModes & mode) && this.mode_ !== mode) {
      this.mode_ = mode;
    }
  };

  /**
   * @throws {d.NoSuchModeException}
   * @protected
   */
  DiffTool.prototype.activateMode = function() {
    if (this.modeIsActive_ === true) {
      return;
    }

    this.modeIsActive_ = true;
    var mode = this.mode_;

    if (!this.modeToController_) {
      /**
       * Lookup table of {@link DiffTool.Mode}s to {d.EditorController}s.
       * @type {Object.<DiffTool.Mode, d.EditorController>}
       * @private
       */
      this.modeToController_ = d.createObject(
          DiffTool.Mode.PLAIN_FILE, new d.PlainEditorController(this.element_),
          DiffTool.Mode.SINGLE_PANE,
              new d.SingleEditorController(this.element_),
          DiffTool.Mode.DOUBLE_PANE,
              new d.DoubleEditorController(this.element_));
    }

    if (this.controller_ !== null) {
      this.controller_.setEnabled(false);
    }

    this.controller_ = this.modeToController_[mode];

    if (!d.isDef(this.controller_)) {
      throw new d.NoSuchModeException(d.NoSuchModeException.getMessage(mode));
    }

    this.controller_.setEnabled(true);
  };

  /**
   * @protected
   */
  DiffTool.prototype.deactivateMode = function() {
    if (this.modeIsActive_ !== false) {
      this.modeIsActive_ = false;
    }
  };

  /**
   * @return {DiffTool.Mode}
   */
  DiffTool.prototype.getMode = function() {
    return this.mode_;
  };

  /**
   * @param {DiffTool.Mode}
   * @return {boolean}
   */
  DiffTool.prototype.hasMode = function(mode) {
    return Boolean(this.mode_ & mode);
  };

  /**
   * @return {d.EditorController}
   */
  DiffTool.prototype.getController = function() {
    return this.controller_;
  };

  /**
   * Sets content to controller, but first, checks, whether selected mode
   * is correct for given content. If not, changes mode and sets content
   * to according controller.
   * @param {string} original
   * @param {string} modified
   * @param {d.Parser.Diff} diff
   * @param {boolean=} opt_refresh
   */
  DiffTool.prototype.setContent = function(original, modified, diff,
                                           opt_refresh) {
    var overriddenMode = DiffTool.getModeByContent_(original, modified);
    if (overriddenMode && !this.hasMode(overriddenMode)) {
      this.deactivateMode();
      this.setMode(overriddenMode);
    }

    this.activateMode();
    this.controller_.setContent(original, modified, diff, opt_refresh);

    this.getHandler().trigger(DiffTool.EventType.AFTER_RENDER);
  };

  /**
   * Returns {@link DiffTool.Mode.NONE_} if content fits for selected mode.
   * Otherwise, returns the best mode, which can be applied to editor.
   * @static
   * @param {string} original
   * @param {string} modified
   * @return {DiffTool.Mode}
   * @private
   */
  DiffTool.getModeByContent_ = function(original, modified) {
    var mode = DiffTool.Mode.NONE_;

    if (d.isEmptyString(original) || d.isEmptyString(modified)) {
      return DiffTool.Mode.PLAIN_FILE;
    }

    return mode;
  };

  /**
   * @return {jQuery}
   */
  DiffTool.prototype.getHandler = function() {
    if (!this.eventHandler_) {
      /**
       * @type {jQuery}
       * @private
       */
      this.eventHandler_ = $({});
    }

    return this.eventHandler_;
  };

  /**
   * @return {Element}
   */
  DiffTool.prototype.getElement = function() {
    return this.element_;
  };

  /**
   * Prepares to be deleted by disabling all controllers to remove event
   * handlers from them and by removing all instance properties.
   */
  DiffTool.prototype.dispose = function() {
    if (this.isDisposed) {
      return;
    }

    this.isDisposed = true;

    this.controller_.setEnabled(false);
    this.controller_ = null;

    this.element_.innerHTML = '';
    this.element_ = null;

    this.eventHandler_.off();
    this.eventHandler_ = null;

    this.mode_ = null;
  };

  /**
   * Factory, which creates {@code DiffTool} instance in a certain mode and
   * automatically sets content.
   * @param {Element} element
   * @param {string} contentOriginal
   * @param {string} contentModified
   * @param {d.Parser.Diff} diff
   * @param {DiffTool.Mode} mode
   * @return {DiffTool}
   */
  function decorateDiffTool(element, contentOriginal, contentModified, diff,
                            mode) {
    var d = new DiffTool(element, mode);
    d.setContent(contentOriginal, contentModified, diff);

    return d;
  }

  Module.add('diff', {
    getDiffTool: {
      method: function() {
        return DiffTool;
      },
      override: true
    },

    singlePaneDiff: {
      method: function(element, contentOriginal, contentModified, diff) {
        return decorateDiffTool(element, contentOriginal, contentModified,
            diff, DiffTool.Mode.SINGLE_PANE);
      },
      override: true
    },

    doublePaneDiff: {
      method: function(element, contentOriginal, contentModified, diff) {
        return decorateDiffTool(element, contentOriginal, contentModified,
            diff, DiffTool.Mode.DOUBLE_PANE);
      },
      override: true
    },

    // todo(igor.alexeenko): Remove d namespace as DiffTool part and move it
    // to ring utils.
    getDiffToolUtils: {
      method: function() {
        return d;
      },
      override: true
    }
  });

  // todo(igor.alexeenko): I should move this class to separate file
  // I'll do it as soon as I realize how to get access to list of modes
  // outside of this file.

  /**
   * Fired, when mode is not supported by {@link DiffTool}.
   * @param {string} message
   * @constructor
   * @extends {Error}
   */
  d.NoSuchModeException = function(message) {
    this.name = 'd.NoSuchModeException';
    this.message = message;
  };
  d.inherit(d.NoSuchModeException, Error);

  /**
   * Returns mode string name by {@link DiffTool.Mode}.
   * @param {DiffTool.Mode} mode
   * @return {string}
   */
  d.NoSuchModeException.getModeName = function(mode) {
    /**
     * Lookup table of {@code DiffTool.Mode}s to their text description.
     * @type {Object.<DiffTool.Mode, string>}
     */
    var modeToName = d.createObject(
        DiffTool.Mode.ALL_, 'ALL',
        DiffTool.Mode.BINARY, 'BINARY',
        DiffTool.Mode.DOUBLE_PANE, 'DOUBLE_PANE',
        DiffTool.Mode.NONE_, 'NONE_',
        DiffTool.Mode.PLAIN_FILE, 'PLAIN_FILE',
        DiffTool.Mode.SINGLE_PANE, 'SINGLE_PANE',
        DiffTool.Mode.TRIPLE_PANE, 'TRIPLE_PANE');

    var name = modeToName[mode];
    if (!name) {
      name = '';
    }

    return name;
  };

  /**
   * @param {DiffTool.Mode} mode
   * @return {string}
   */
  d.NoSuchModeException.getMessage = function(mode) {
    return (
        'Unsupported mode ' + d.NoSuchModeException.getModeName(mode) + '. ' +
        'It does not exist or exists, but is not supported by this ' +
        'DiffTool.');
  };

  return DiffTool;
});
