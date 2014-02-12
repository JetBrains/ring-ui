/**
 * @fileoverview Class for alert element.
 * @author igor.alexeenko (Igor Alekseyenko)
 */

define([
  'jquery',
  'handlebars',
  'global/global__utils',
  'diff/diff__tools'
], function($, Handlebars, utils, d) {
  /**
   * @enum {string}
   */
  var Selector = {
    CAPTION: '.ring-alert__caption',
    CLOSE: '.ring-alert__close',
    ICON: '.ring-alert__icon',
    INNER: '.ring-alert__inner'
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

  var KEYFRAME_RULE = 'appearing';

  /**
   * @param {string=} opt_caption
   * @param {Alert.Type=} opt_type
   * @param {boolean=} opt_closeable
   * @constructor
   */
  var Alert = function(opt_caption, opt_type, opt_closeable) {
    // todo(igor.alexeenko): Pretty dirty code.
    if (!d.isDef(Alert.templateKeyframeRule_)) {
      var fakeStylesheet = document.createElement('style');
      fakeStylesheet.type = 'text/css';
      fakeStylesheet.appendChild(document.createTextNode(''));
      document.head.appendChild(fakeStylesheet);

      fakeStylesheet.sheet.insertRule(
          d.style.getPrefixedKeyframesRule() + ' appearing ' +
          '{ 0% { height: 0; } 100% { height: auto; } }', 0);

      Alert.templateKeyframeRule_ = fakeStylesheet.sheet.cssRules[0];
    }

    /**
     * @type {boolean}
     * @private
     */
    this.shown_ = false;

    /**
     * @type {Alert.Type}
     * @private
     */
    this.type_ = d.isDef(opt_type) ? opt_type :
        Alert.Type.MESSAGE;

    if (!d.isDef(opt_closeable)) {
      opt_closeable = true;
    }

    /**
     * @type {boolean}
     * @private
     */
    this.closeable_ = opt_closeable;

    this.render_();

    if (d.isDef(opt_caption)) {
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

    if (!this.closeable_) {
      $(Alert.getCloseElement(this)).remove();
    }
  };

  /**
   * @param {Element=} opt_parentEl
   */
  Alert.prototype.show = function(opt_parentEl) {
    if (this.shown_ === true) {
      return;
    }

    this.shown_ = true;

    if (!d.isDef(opt_parentEl)) {
      opt_parentEl = document.body;
    }

    // todo(igor.alexeenko): this.setCloseable(true);
    if (this.closeable_) {
      if (!this.closeElement_) {
        /**
         * @type {Element=}
         * @private
         */
        this.closeElement_ = Alert.getCloseElement(this);
      }

      if (!this.onCloseClickHandler_) {
        /**
         * @type {function(this, evt: Event): undefined}
         * @private
         */
        this.onCloseClickHandler_ = d.bindContext(this.onCloseClick_,
            this);
      }

      $(this.closeElement_).on('click', this.onCloseClickHandler_);
    }

    $(opt_parentEl).prepend(this.element_);

    var animationName = this.addShowRule();

    $(this.element_).toggleClass(ClassName.HIDDEN, false);
    $(this.element_).toggleClass(ClassName.SHOWN, true);

    var elementHeight = this.element_.clientHeight;
    var innerElement = Alert.getInnerElement(this);

    if (innerElement) {
      elementHeight = innerElement.clientHeight;
    }

    this.element_.style.height = elementHeight + 'px';
    d.style.appendAnimationVendorRule(this.element_, 'animationName',
        animationName);

    $(this.element_).trigger(Alert.EventType.SHOW);
  };

  /**
   * @return {string}
   */
  Alert.prototype.addShowRule = function() {
    var animationName = d.getAnimationUniqueName(KEYFRAME_RULE);
    var elementHeight = this.element_.clientHeight;
    var innerElement = Alert.getInnerElement(this);

    if (innerElement) {
      elementHeight = innerElement.clientHeight;
    }

    var newRule = d.mixin({}, Alert.templateKeyframeRule_);

    newRule.cssText = newRule.cssText.
        replace('auto', [elementHeight, 'px'].join('')).
        replace(KEYFRAME_RULE, animationName);

    d.style.addCSSRule(newRule, d.peekArray(document.styleSheets));

    return animationName;
  };

  /**
   * Hides element.
   */
  Alert.prototype.hide = function() {
    if (this.shown_ === false) {
      return;
    }

    this.shown_ = false;

    if (this.closeable_) {
      $(this.closeElement_).off('click', this.onCloseClickHandler_);
    }

    if (!this.onAnimationEndHandler_) {
      /**
       * @type {function(this, evt: Event): undefined}
       * @private
       */
      this.onAnimationEndHandler_ = d.bindContext(this.onAnimationEnd_,
          this);
    }

    // todo(igor.alexeenko): Remove unused CSS animations, defined before.
    d.style.removeAnimationVendorRule(this.element_, 'animation');

    d.addAnimationCallback(this.element_, this.onAnimationEndHandler_);

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

  /**
   * Hides element and disposes when animation ends.
   */
  Alert.prototype.hideAndDispose = function() {
    /**
     * @type {function(this, evt: Event): undefined}
     * @private
     */
    this.hideAndDisposeHandler_ = d.bindContext(this.onHideAnimationEnd_,
        this);

    d.addAnimationCallback(this.element_, this.hideAndDisposeHandler_);
    this.hide();
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
   * @return {Element?}
   */
  Alert.getInnerElement = function(alert) {
    if (!alert.getElement()) {
      return null;
    }

    return alert.getElement().querySelector(Selector.INNER);
  };

  /**
   * @static
   * @param {Alert} alert
   * @return {Array.<string>}
   */
  Alert.getClassNames = function(alert) {
    var classes = [];

    if (!Alert.typesToClasses_) {
      /**
       * Lookup table of types of {@code Alert}s to according class names.
       * @type {Object.<Alert.Type, ClassName>}
       * @private
       */
      Alert.typesToClasses_ = d.createObject(
          Alert.Type.ERROR, ClassName.ERROR,
          Alert.Type.SUCCESS, ClassName.SUCCESS,
          Alert.Type.WARNING, ClassName.WARNING);
    }

    var typeClass = Alert.typesToClasses_[alert.getType()];

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
    var typesToClasses = d.createObject(
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
