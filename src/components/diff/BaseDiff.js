/**
 * @fileoverview DiffTool — tool, which allows to display diff of two files
 * in single-, double- and triple-pane modes. In multi-pane mode content might
 * be editable, but this is optional. In multi-pane modes there are connectors
 * between changed parts of code in different panels. When scroll the through
 * the connector, speed of scrolling in part in which more code increases.
 * @author igor.alexeenko (Igor Alekseyenko)
 */

var Tools = require('./Tools');
var $ = require('jquery');

var EditorController = {
  Plain: require('./editor-controller/plain'),
  Single: require('./editor-controller/single'),
  Double: require('./editor-controller/double')
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
 * IDs of modes in which Diff might work
 * @enum {number}
 */
Diff.Mode = {
  /**
   * Shortcut, which allows to check, whether all modes are disableTools.
   */
  NONE_: 0x00,

  /**
   * Shortcut for all enabled modes.
   */
  ALL_: 0xFF,

  /**
   * Diff displays as single pane with code which displays similarly to
   * patch files — lines of deleted code and then, lines of new code.
   */
  SINGLE_PANE: 0x01,

  /**
   * Diff displays as two separate editors with original code in left
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
 * Mode in which Diff initializes by default.
 * @type {number}
 * @protected
 */
Diff.prototype.defaultMode = Diff.Mode.SINGLE_PANE;

/**
 * Modes, which are available for current Diff.
 * @type {number}
 * @protected
 */
Diff.prototype.availableModes =
  Diff.Mode.PLAIN_FILE |
  Diff.Mode.SINGLE_PANE |
  Diff.Mode.DOUBLE_PANE;

/**
 * Bit mask of current mode of Diff. Default value is
 * {@link Diff.Mode.NONE_} but it overrides in constructor on
 * initialization of module.
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
  var element = this.element_;

  if (!this.modeToController_) {

    /**
     * Lookup table of {@link Diff.Mode}s to {EditorController}s.
     * @type {Object.<Diff.Mode, EditorController>}
     * @private
     */
    this.modeToController_ = Tools.createObject(
      Diff.Mode.PLAIN_FILE, lazyInstantiationOfController(EditorController.Plain, element),
      Diff.Mode.SINGLE_PANE, lazyInstantiationOfController(EditorController.Single, element),
      Diff.Mode.DOUBLE_PANE, lazyInstantiationOfController(EditorController.Double, element)
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
 * Sets content to controller, but first, checks, whether selected mode
 * is correct for given content. If not, changes mode and sets content
 * to according controller.
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
 * Otherwise, returns the best mode, which can be applied to editor.
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
 * Prepares to be deleted by disabling all controllers to remove event
 * handlers from them and by removing all instance properties.
 */
Diff.prototype.dispose = function () {
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

module.exports = Diff;

