/**
 * @fileoverview Menu for double pane diff.
 * @author igor.alexeenko (Igor Alekseyenko)
 */

define([
  'diff/diff__tools',
  'handlebars',
  'jquery'
], function(d, Handlebars, $) {
  /**
   * @param {Element} element
   * @constructor
   */
  d.DoublePaneMenu = function(element) {
    this.eventHandler_ = $({});
    this.element_ = element;

    this.createDOM();
  };

  /**
   * @type {string}
   * @const
   */
  d.DoublePaneMenu.TEMPLATE = 'diff__doublepane-menu';

  /**
   * @enum {string}
   */
  d.DoublePaneMenu.Selector = {
    DOWN: '.ring-diff__menu-btn_down',
    UP: '.ring-diff__menu-btn_up',
    WHITESPACES: '.ring-diff__menu-whitespaces'
  };

  /**
   * @enum {string}
   */
  d.DoublePaneMenu.EventType = {
    DOWN: 'down',
    UP: 'up',
    WHITESPACES_ON: 'whitespaceson',
    WHITESPACES_OFF: 'whitespacesoff'
  };

  /**
   * @type {jQuery}
   * @private
   */
  d.DoublePaneMenu.prototype.eventHandler_ = null;

  /**
   * @type {Element}
   * @private
   */
  d.DoublePaneMenu.prototype.element_ = null;

  /**
   * @return {Element}
   */
  d.DoublePaneMenu.prototype.createDOM = function() {
    this.element_.innerHTML = Handlebars.partials[d.DoublePaneMenu.TEMPLATE]();

    /**
     * @type {Element}
     * @private
     */
    this.buttonDown_ = $(d.DoublePaneMenu.Selector.DOWN, this.element_)[0];

    /**
     * @type {Element}
     * @private
     */
    this.buttonUp_ = $(d.DoublePaneMenu.Selector.UP, this.element_)[0];

    /**
     * @type {HTMLInputElement}
     * @private
     */
    this.whitespacesSwitch_ = $(d.DoublePaneMenu.Selector.WHITESPACES,
        this.element_)[0];

    this.onDownClick_ = d.bindContext(this.onDownClick_, this);
    this.onUpClick_ = d.bindContext(this.onUpClick_, this);
    this.onWhitespacesClick_ = d.bindContext(this.onWhitespacesClick_, this);

    $(this.buttonDown_).on('click', this.onDownClick_);
    $(this.buttonUp_).on('click', this.onUpClick_);
    $(this.whitespacesSwitch_).on('click', this.onWhitespacesClick_);

    return this.element_;
  };

  /**
   * @param {jQuery.Event} evt
   * @private
   */
  d.DoublePaneMenu.prototype.onDownClick_ = function(evt) {
    evt.preventDefault();
    this.eventHandler_.trigger(d.DoublePaneMenu.EventType.DOWN);
  };

  /**
   * @param {jQuery.Event} evt
   * @private
   */
  d.DoublePaneMenu.prototype.onUpClick_ = function(evt) {
    evt.preventDefault();
    this.eventHandler_.trigger(d.DoublePaneMenu.EventType.UP);
  };

  /**
   * @param {jQuery.Event} evt
   * @private
   */
  d.DoublePaneMenu.prototype.onWhitespacesClick_ = function(evt) {
    this.eventHandler_.trigger(evt.currentTarget.checked ?
        d.DoublePaneMenu.EventType.WHITESPACES_OFF :
        d.DoublePaneMenu.EventType.WHITESPACES_ON);
  };

  /**
   * @return {jQuery}
   */
  d.DoublePaneMenu.prototype.getHandler = function() {
    return this.eventHandler_;
  };

  /**
   * @param {boolean} enabled
   */
  d.DoublePaneMenu.prototype.setEnabled = function(enabled) {
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
  d.DoublePaneMenu.prototype.setButtonUpEnabled = function(enabled) {
    this.buttonUp_.disabled = !enabled;
  };

  /**
   * @param {boolean} enabled
   */
  d.DoublePaneMenu.prototype.setButtonDownEnabled = function(enabled) {
    this.buttonDown_.disabled = !enabled;
  };

  return d.DoublePaneMenu;
});