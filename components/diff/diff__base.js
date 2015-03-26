/* eslint-disable no-bitwise */
/**
 * @fileoverview DiffTool — a tool for displaying a diff of two files
 * in single-, double- and triple-pane modes. In multi-pane mode content can
 * be edited (optionally).
 * @author igor.alexeenko (Igor Alekseyenko)
 */

var Tools = require('./diff__tools');
var $ = require('jquery');

var EditorController = {
  Plain: require('./__editorcontroller/diff__editorcontroller_plain'),
  Single: require('./__editorcontroller/diff__editorcontroller_single'),
  Double: require('./__editorcontroller/diff__editorcontroller_double')
};

/**
 * @param {Element=} opt_element
 * @param {Diff.Mode=} opt_mode
 * @constructor
 */
var Diff = function (opt_element, opt_mode) {
  if (Tools.isDef(opt_mode)) {
    opt_mode = Boolean(opt_mode & this.availableModes) ?
      opt_mode :
      this.defaultMode;
  }

  this.element_ = Tools.isDef(opt_element) ? opt_element :
    document.createElement('div');

  this.setMode(Tools.isDef(opt_mode) ? opt_mode : this.defaultMode);
};

/**
 * Mode IDs
 * @enum {number}
 */
Diff.Mode = {
  /**
   * All modes are disabled
   */
  NONE_: 0x00,

  /**
   * All modes are enabled
   */
  ALL_: 0xFF,

  /**
   * Single-pane, similar to patch file
   */
  SINGLE_PANE: 0x01,

  /**
   * Two-pane diff with original content on the left, modified content on the right. Original
   * content can be made editable.
   */
  DOUBLE_PANE: 0x02,

  /**
   * Not implemented yet.
   */
  TRIPLE_PANE: 0x04,

  /**
   * Shows contents of a file without any marks if one of the files is missing.
   */
  PLAIN_FILE: 0x08,

  /**
   * Not implemented yet. Original/modified content of binary file.
   */
  BINARY: 0x10
};

/**
 * Lookup table of {@code Diff.Mode}s to their text description.
 * @type {Object.<Diff.Mode, string>}
 */
Diff.modeToName = Tools.createObject(
  Diff.Mode.ALL_, 'ALL',
  Diff.Mode.BINARY, 'BINARY',
  Diff.Mode.DOUBLE_PANE, 'DOUBLE_PANE',
  Diff.Mode.NONE_, 'NONE_',
  Diff.Mode.PLAIN_FILE, 'PLAIN_FILE',
  Diff.Mode.SINGLE_PANE, 'SINGLE_PANE',
  Diff.Mode.TRIPLE_PANE, 'TRIPLE_PANE',
  Diff.Mode.NULL, ''
);

Diff.NoSuchModeException = new Tools.NoSuchModeExceptionFactory('Diff', Diff.modeToName);

/**
 * @enum {string}
 */
Diff.EventType = {
  AFTER_RENDER: 'afterrender'
};

/**
 * Default mode.
 * @type {number}
 * @protected
 */
Diff.prototype.defaultMode = Diff.Mode.SINGLE_PANE;

/**
 * Available modes.
 * @type {number}
 * @protected
 */
Diff.prototype.availableModes =
  Diff.Mode.PLAIN_FILE |
  Diff.Mode.SINGLE_PANE |
  Diff.Mode.DOUBLE_PANE;

/**
 * Current mode. Default value is
 * {@link Diff.Mode.NONE_}, it can be overridden in the constructor.
 * @type {Diff.Mode}
 * @private
 */
Diff.prototype.mode_ = Diff.Mode.NONE_;

/**
 * @type {Element}
 * @private
 */
Diff.prototype.element_ = null;

/**
 * @type {EditorController}
 * @private
 */
Diff.prototype.controller_ = null;

/**
 * @type {boolean}
 * @private
 */

/**
 * @param {Diff.Mode} mode
 */
Diff.prototype.setMode = function (mode) {
  if (Boolean(this.availableModes & mode) && this.mode_ !== mode) {
    this.mode_ = mode;
    this.activateMode();
  }
};

/**
 * @throws {Tools.NoSuchModeException}
 * @protected
 */
Diff.prototype.activateMode = function () {
  var lazyInstantiationOfController = function (Controller, element) {
    var controller;

    return function () {
      controller = controller || new Controller(element);
      return controller;
    };
  };

  var mode = this.mode_;

  if (!this.modeToController_) {

    /**
     * Lookup table of {@link Diff.Mode}s to {EditorController}s.
     * @type {Object.<Diff.Mode, EditorController>}
     * @private
     */
    this.modeToController_ = Tools.createObject(
      Diff.Mode.PLAIN_FILE, lazyInstantiationOfController(EditorController.Plain, this.element_),
      Diff.Mode.SINGLE_PANE, lazyInstantiationOfController(EditorController.Single, this.element_),
      Diff.Mode.DOUBLE_PANE, lazyInstantiationOfController(EditorController.Double, this.element_)
    );
  }

  if (this.controller_ !== null) {
    this.controller_.setEnabled(false);
  }

  this.controller_ = this.modeToController_[mode]();

  if (!Tools.isDef(this.controller_)) {
    throw new Diff.NoSuchModeException(mode);
  }

  this.controller_.setEnabled(true);
};

/**
 * @return {Diff.Mode}
 */
Diff.prototype.getMode = function () {
  return this.mode_;
};

/**
 * @param {Diff.Mode} mode
 * @return {boolean}
 */
Diff.prototype.hasMode = function (mode) {
  return Boolean(this.mode_ & mode);
};

/**
 * @return {EditorController}
 */
Diff.prototype.getController = function () {
  return this.controller_;
};

/**
 * Checks whether the selected mode is suitable for given content, then sets content.
 * @param {string} original
 * @param {string} modified
 * @param {Array.<Parser.LineModification>} diff
 * @param {boolean=} opt_refresh
 */
Diff.prototype.setContent = function (original, modified, diff, opt_refresh) {
  var overriddenMode = Diff.getModeByContent_(original, modified);
  if (overriddenMode && !this.hasMode(overriddenMode)) {
    this.setMode(overriddenMode);
  }

  this.controller_.setContent(original, modified, diff, opt_refresh);
  this.getHandler().trigger(Diff.EventType.AFTER_RENDER);
};

/**
 * Returns {@link Diff.Mode.NONE_} if content fits for selected mode.
 * Otherwise, returns the best mode that can be applied to editor.
 * @static
 * @param {string} original
 * @param {string} modified
 * @return {Diff.Mode}
 * @private
 */
Diff.getModeByContent_ = function (original, modified) {
  var mode = Diff.Mode.NONE_;

  if (Tools.isEmptyString(original) || Tools.isEmptyString(modified)) {
    return Diff.Mode.PLAIN_FILE;
  }

  return mode;
};

/**
 * @return {jQuery}
 */
Diff.prototype.getHandler = function () {
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
Diff.prototype.getElement = function () {
  return this.element_;
};

/**
 * Prepares to be destroyed by disabling all controllers, removing event listeners, removing instance properties.
 */
Diff.prototype.dispose = function () {
  if (this.isDisposed) {
    return;
  }

  this.isDisposed = true;

  this.controller_.setEnabled(false);
  this.controller_ = null;

  this.element_ = null;

  this.eventHandler_.off();
  this.eventHandler_ = null;

  this.mode_ = null;
};

module.exports = Diff;
