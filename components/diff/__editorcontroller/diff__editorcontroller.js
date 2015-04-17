/**
 * @fileoverview Base editor controller. Abstracts editor interactions
 * and provides a basic interface: enabling, disabling,
 * setting content, setting editor editable.
 * @author igor.alexeenko (Igor Alekseyenko)
 */

var Tools = require('./../diff__tools');
var Parser = require('./../__parser/diff__parser');

/**
 * @param {Element} element
 * @param {function=} opt_parser
 * @constructor
 */
var EditorController = function (element, opt_parser) {
  this.element_ = element;

  this.codeParser_ = Tools.isDef(opt_parser) ? opt_parser : new Parser();
};

/**
 * @type {boolean}
 * @private
 */
EditorController.prototype.enabled_ = false;

/**
 * @type {Element}
 * @protected
 */
EditorController.prototype.element_ = null;

/**
 * @type {Parser}
 * @protected
 */
EditorController.prototype.codeParser_ = null;

/**
 * @param {string} original
 * @param {string} modified
 * @param {Array.<Parser.LineModification>} diff
 * @param {boolean=} opt_refresh
 */
EditorController.prototype.setContent = function (original, modified, diff, opt_refresh) {
  if (!this.isEnabled()) {
    throw new Error('Controller is not enableTools. You can not set content ' +
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
     * Description of differences between original and modified content.
     * @type {Array.<Parser.LineModification>}
     * @private
     */
    this.diff_ = diff;
  }

  this.setContentInternal(original, modified, diff, opt_refresh);
};

/**
 * @param {string} original
 * @param {string} modified
 * @param {Array.<Parser.LineModification>} diff
 * @param {boolean=} opt_refresh
 * @protected
 */
EditorController.prototype.setContentInternal =
  Tools.nullFunction;

/**
 * @return {string}
 */
EditorController.prototype.getOriginal = function () {
  return this.contentOriginal_;
};

/**
 * @return {string}
 */
EditorController.prototype.getModified = function () {
  return this.contentModified_;
};

/**
 * @return {Array.<Parser.LineModification>}
 */
EditorController.prototype.getDiff = function () {
  return this.diff_;
};

/**
 * @return {Element}
 */
EditorController.prototype.getElement = function () {
  return this.element_;
};

/**
 * @param {boolean} enabled
 */
EditorController.prototype.setEnabled = function (enabled) {
  if (enabled !== this.enabled_) {
    this.enabled_ = enabled;
    this.setEnabledInternal(enabled);
  }
};

/**
 * @param {boolean} enabled
 */
EditorController.prototype.setEnabledInternal =
  Tools.nullFunction;

/**
 * @return {boolean}
 */
EditorController.prototype.isEnabled = function () {
  return this.enabled_;
};

module.exports = EditorController;
