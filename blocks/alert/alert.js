/**
 * @fileoverview Class for alert element.
 * @author igor.alexeenko (Igor Alekseyenko)
 */

define([
  'jquery',
  'handlebars',
  'global/global__views',
  'global/global__utils',
  'diff/diff__tools'
], function($, Handlebars, View, utils, diffTool) {
  /**
   * @enum {string}
   */
  var Selector = {
    CAPTION: '.ring-alert__caption',
    CLOSE: '.ring-alert__close',
    ICON: '.ring-alert__icon'
  };

  /**
   * @enum {string}
   */
  var ClassName = {
    BASE: 'ring-alert',
    ERROR: 'ring-alert_error',
    HIDDEN: 'ring-alert_hidden',
    SHOWN: 'ring-alert_shown',
    SUCCESS: 'ring-alert_success',
    WARNING: 'ring-alert_warning'
  };

  /**
   * @enum {string}
   */
  var IconClassName = {
    BASE: 'ring-font-icon',
    ERROR: 'ring-font-icon_warning',
    SUCCESS: 'ring-font-icon_ok',
    WARNING: 'ring-font-icon_minus'
  };

  /**
   * ID of {@link Handlebars} templates.
   * @type {string}
   * @const
   */
  var TEMPLATE_ID = 'alert';

  /**
   * @param {string=} opt_caption
   * @param {Alert.Type=} opt_type
   * @constructor
   */
  var Alert = function(opt_caption, opt_type) {
    /**
     * @type {View}
     * @private
     */
    this.view_ = new View();

    /**
     * @type {boolean}
     * @private
     */
    this.shown_ = false;

    /**
     * @type {Alert.Type}
     * @private
     */
    this.type_ = diffTool.isDef(opt_type) ? opt_type :
        Alert.Type.MESSAGE;

    this.render_();

    if (diffTool.isDef(opt_caption)) {
      this.setCaption(opt_caption);
    }
  };

  /**
   * IDs of types of alert.
   * @enum {string}
   */
  Alert.Type = {
    MESSAGE: 'message',
    ERROR: 'error',
    SUCCESS: 'success',
    WARNING: 'warning'
  };

  /**
   * @enum {string}
   */
  Alert.EventType = {
    SHOW: 'show',
    HIDE: 'hide'
  };

  /**
   * @private
   */
  Alert.prototype.render_ = function() {
    if (!this.element_) {
      this.element_ = document.createElement('div');
      this.element_.className = Alert.getClassNames(this).join(' ');
    }

    if (!this.template_) {
      this.template_ = Handlebars.partials[TEMPLATE_ID];
    }

    this.element_.innerHTML = this.template_();

    var icon = Alert.getIcon(this);
    $(icon).addClass(Alert.getIconClassNames(this).join(' '));
  };

  /**
   * @param {Element=} opt_parentEl
   */
  Alert.prototype.show = function(opt_parentEl) {
    if (this.shown_ === true) {
      return;
    }

    this.shown_ = true;

    if (!diffTool.isDef(opt_parentEl)) {
      opt_parentEl = document.body;
    }

    if (!this.closeElement_) {
      /**
       * @type {Element=}
       * @private
       */
      this.closeElement_ = Alert .getCloseElement(this);
    }

    if (!this.onCloseClickHandler_) {
      /**
       * @type {function(this, evt: Event): undefined}
       * @private
       */
      this.onCloseClickHandler_ = diffTool.bindContext(this.onCloseClick_,
          this);
    }

    $(this.closeElement_).on('click', this.onCloseClickHandler_);

    $(opt_parentEl).prepend(this.element_);
    $(this.element_).toggleClass(ClassName.HIDDEN, false);
    $(this.element_).toggleClass(ClassName.SHOWN, true);

    $(this.element_).trigger(Alert.EventType.SHOW);
  };

  /**
   * Hides element.
   */
  Alert.prototype.hide = function() {
    if (this.shown_ === false) {
      return;
    }

    this.shown_ = false;

    $(this.closeElement_).off('click', this.onCloseClickHandler_);

    if (!this.onAnimationEndHandler_) {
      /**
       * @type {function(this, evt: Event): undefined}
       * @private
       */
      this.onAnimationEndHandler_ = diffTool.bindContext(this.onAnimationEnd_,
          this);
    }

    diffTool.addAnimationCallback(this.element_, this.onAnimationEndHandler_);

    $(this.element_).toggleClass(ClassName.SHOWN, false);
    $(this.element_).toggleClass(ClassName.HIDDEN, true);

    $(this.element_).trigger(Alert.EventType.HIDE);
  };

  /**
   * @private
   */
  Alert.prototype.onAnimationEnd_ = function() {
    $(this.element_).remove();
  };

  Alert.prototype.hideAndDispose = function() {
    /**
     * @type {function(this, evt: Event): undefined}
     * @private
     */
    this.hideAndDisposeHandler_ = diffTool.bindContext(this.onHideAnimationEnd_,
        this);

    // todo(igor.alexeenko): Check if callback always works even in corner
    // cases.
    this.hide();
    diffTool.addAnimationCallback(this.element_, this.hideAndDisposeHandler_);
  };

  /**
   * @private
   */
  Alert.prototype.onHideAnimationEnd_ = function() {
    this.dispose();
  };

  /**
   * Disposal of element. Removes all instance methods and properties and hides
   * element.
   */
  Alert.prototype.dispose = function() {
    this.hide();

    this.caption_ = null;
    this.closeElement_ = null;
    this.element_ = null;
    this.onCloseClickHandler_ = null;
    this.onAnimationEndHandler_ = null;
    this.type_ = null;
    this.view_ = null;
  };

  /**
   * @param {string} caption
   */
  Alert.prototype.setCaption = function(caption) {
    if (this.caption_ === caption) {
      return;
    }

    this.caption_ = caption;
    Alert.updateCaption(this);
  };

  /**
   * @return {string}
   */
  Alert.prototype.getCaption = function() {
    return this.caption_;
  };

  /**
   * @return {Element}
   */
  Alert.prototype.getElement = function() {
    return this.element_;
  };

  /**
   * @return {Alert.Type}
   */
  Alert.prototype.getType = function() {
    return this.type_;
  };

  /**
   * @param {Event} evt
   * @private
   */
  Alert.prototype.onCloseClick_ = function(evt) {
    evt.preventDefault();
    this.hide();
  };

  // todo(igor.alexeenko): All static method below should be moved to renderer.

  /**
   * @static
   * @param {Alert} alert
   */
  Alert.updateCaption = function(alert) {
    var captionElement = Alert.getCaptionElement(alert);
    captionElement.innerHTML = alert.getCaption();
  };

  /**
   * @static
   * @param alert
   * @return {Element?}
   */
  Alert.getCaptionElement = function(alert) {
    if (!alert.getElement()) {
      return null;
    }

    return alert.getElement().querySelector(Selector.CAPTION);
  };

  /**
   * @static
   * @param {Alert} alert
   * @return {Element?}
   */
  Alert.getCloseElement = function(alert) {
    if (!alert.getElement()) {
      return null;
    }

    return alert.getElement().querySelector(Selector.CLOSE);
  };

  /**
   * @static
   * @param {Alert} alert
   * @return {Element?}
   */
  Alert.getIcon = function(alert) {
    if (!alert.getElement()) {
      return null;
    }

    return alert.getElement().querySelector(Selector.ICON);
  };

  /**
   * @static
   * @param {Alert} alert
   * @return {Array.<string>}
   */
  Alert.getClassNames = function(alert) {
    var classes = [];
    var typesToClasses = diffTool.createObject(
        Alert.Type.ERROR, ClassName.ERROR,
        Alert.Type.SUCCESS, ClassName.SUCCESS,
        Alert.Type.WARNING, ClassName.WARNING);

    var typeClass = typesToClasses[alert.getType()];

    classes.push(ClassName.BASE);

    if (typeClass) {
      classes.push(typeClass);
    }

    return classes;
  };

  /**
   * @static
   * @param {Alert} alert
   * @return {Array.<string>}
   */
  Alert.getIconClassNames = function(alert) {
    var classes = [];
    var typesToClasses = diffTool.createObject(
        Alert.Type.ERROR, IconClassName.ERROR,
        Alert.Type.SUCCESS, IconClassName.SUCCESS,
        Alert.Type.WARNING, IconClassName.WARNING);

    var typeClass = typesToClasses[alert.getType()];

    classes.push(IconClassName.BASE);

    if (typeClass) {
      classes.push(typeClass);
    }

    return classes;
  };

  return Alert;
});
