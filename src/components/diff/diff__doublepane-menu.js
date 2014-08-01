/**
 * @fileoverview Tools menu for double pane diff.
 * @author igor.alexeenko (Igor Alekseyenko)
 */

var Tools = require('./diff__tools');
var $ = require('jquery');

/**
 * @param {Element} element
 * @constructor
 */
var DoublePaneMenu = function (element) {
  this.eventHandler_ = $({});
  this.element_ = element;

  this.createDOM();
};

/**
 * @type {number}
 * @const
 */
DoublePaneMenu.CHECKBOX_LIFETIME = 365 * 10;

/**
 * @type {string}
 * @const
 */
DoublePaneMenu.CHECKBOX_COOKIE = 'ringdiff-ignorewhitespaces';

/**
 * @enum {string}
 */
DoublePaneMenu.Selector = {
  DOWN: '.ring-diff__menu-btn_down',
  UP: '.ring-diff__menu-btn_up',
  WHITESPACES: '.ring-diff__menu-whitespaces'
};

/**
 * @enum {string}
 */
DoublePaneMenu.EventType = {
  DOWN: 'down',
  UP: 'up',
  WHITESPACES_ON: 'whitespaceson',
  WHITESPACES_OFF: 'whitespacesoff'
};

/**
 * @type {jQuery}
 * @private
 */
DoublePaneMenu.prototype.eventHandler_ = null;

/**
 * @type {Element}
 * @private
 */
DoublePaneMenu.prototype.element_ = null;

/**
 * @return {Element}
 */
DoublePaneMenu.prototype.createDOM = function () {
  /**
   * @type {Element}
   * @private
   */
  this.buttonDown_ = $(DoublePaneMenu.Selector.DOWN, this.element_)[0];

  /**
   * @type {Element}
   * @private
   */
  this.buttonUp_ = $(DoublePaneMenu.Selector.UP, this.element_)[0];

  /**
   * @type {HTMLInputElement}
   * @private
   */
  this.whitespacesSwitch_ = $(DoublePaneMenu.Selector.WHITESPACES,
    this.element_)[0];

  this.onDownClick_ = Tools.bindContext(this.onDownClick_, this);
  this.onUpClick_ = Tools.bindContext(this.onUpClick_, this);
  this.onWhitespacesClick_ = Tools.bindContext(this.onWhitespacesClick_, this);

  $(this.buttonDown_).on('click', this.onDownClick_);
  $(this.buttonUp_).on('click', this.onUpClick_);
  $(this.whitespacesSwitch_).on('click', this.onWhitespacesClick_);

  this.whitespacesSwitch_.checked = Boolean(Tools.cookies.get(
    DoublePaneMenu.CHECKBOX_COOKIE));

  return this.element_;
};

/**
 * @param {jQuery.Event} evt
 * @private
 */
DoublePaneMenu.prototype.onDownClick_ = function (evt) {
  evt.preventDefault();
  this.eventHandler_.trigger(DoublePaneMenu.EventType.DOWN);
};

/**
 * @param {jQuery.Event} evt
 * @private
 */
DoublePaneMenu.prototype.onUpClick_ = function (evt) {
  evt.preventDefault();
  this.eventHandler_.trigger(DoublePaneMenu.EventType.UP);
};

/**
 * @param {jQuery.Event} evt
 * @private
 */
DoublePaneMenu.prototype.onWhitespacesClick_ = function (evt) {
  var checked = evt.currentTarget.checked;

  this.eventHandler_.trigger(checked ?
    DoublePaneMenu.EventType.WHITESPACES_OFF :
    DoublePaneMenu.EventType.WHITESPACES_ON);

  Tools.cookies.set(DoublePaneMenu.CHECKBOX_COOKIE, 'checked', checked ?
    DoublePaneMenu.CHECKBOX_LIFETIME : -1);
};

/**
 * @return {jQuery}
 */
DoublePaneMenu.prototype.getHandler = function () {
  return this.eventHandler_;
};

/**
 * @param {boolean} enabled
 */
DoublePaneMenu.prototype.setEnabled = function (enabled) {
  if (this.enabled_ === enabled) {
    return;
  }

  this.enabled_ = enabled;

  this.setButtonUpEnabled(enabled);
  this.setButtonDownEnabled(enabled);
};

/**
 * @param {boolean} enabled
 */
DoublePaneMenu.prototype.setButtonUpEnabled = function (enabled) {
  this.buttonUp_.disabled = !enabled;
};

/**
 * @param {boolean} enabled
 */
DoublePaneMenu.prototype.setButtonDownEnabled = function (enabled) {
  this.buttonDown_.disabled = !enabled;
};

/**
 * @return {boolean}
 */
DoublePaneMenu.prototype.isWhitespacesEnabled = function () {
  return !Boolean(Tools.cookies.get(DoublePaneMenu.CHECKBOX_COOKIE));
};

module.exports = DoublePaneMenu;
