/**
 * @fileoverview Dialog UI element.
 * @author igor.alexeenko (Igor Alekseyenko)
 */

// todo(igor.alexeenko): Do I need to implement version without overlay?
// todo(igor.alexeenko): Implement separate component for overlay.
// todo(igor.alexeenko): Support different types of buttons.
// todo(igor.alexeenko): Add ARIA role for this dialog.

define([
  'jquery',
  'diff/diff__tools',
  'handlebars',
  'global/global__modules'
], function($, d, Handlebars, Module) {
  /**
   * @param {string} content
   * @param {Array.<string>=} opt_buttons
   * @param {string=} opt_title
   * @param {boolean=} opt_closeable
   * @param {boolean=} opt_show
   * @constructor
   */
  var Dialog = function(content, opt_buttons, opt_title, opt_closeable,
                        opt_show) {
    /**
     * @type {jQuery}
     * @private
     */
    this.eventHandler_ = $({});

    if (d.isDef(opt_closeable)) {
      this.closeable_ = opt_closeable;
    }

    /**
     * @type {string}
     * @private
     */
    this.content_ = content;

    /**
     * @type {string=}
     * @private
     */
    this.title_ = opt_title;

    /**
     * @type {Array.<string>=}
     * @private
     */
    this.buttonCaptions_ = opt_buttons;

    if (Boolean(opt_show)) {
      this.show();
    }
  };

  /**
   * @const
   * @type {string}
   */
  Dialog.TEMPLATE_ID = 'dialog';

  /**
   * @enum {string}
   */
  Dialog.EventType = {
    AFTER_HIDE: 'afterhide',
    AFTER_SHOW: 'aftershow',
    BUTTON_PRESS: 'buttonpress'
  };

  /**
   * @enum {string}
   */
  Dialog.Selector = {
    BUTTON: '.ring-dialog__footer__item.ring-btn',
    CLOSE: '.ring-dialog__header__close-icon',
    DIALOG: '.ring-dialog__container',
    WRAPPER: '.ring-dialog__wrapper'
  };

  /**
   * @enum {string}
   */
  Dialog.ClassName = {
    WRAPPER_ACTIVE: 'ring-dialog__wrapper_active'
  };

  /**
   * Whether to close element by pressing escape button.
   * @type {boolean}
   * @private
   */
  Dialog.prototype.closeByEscape_ = true;

  /**
   * @type {boolean}
   * @private
   */
  Dialog.prototype.closeable_ = true;

  /**
   * @type {boolean}
   * @private
   */
  Dialog.prototype.shown_ = false;

  /**
   * Creates markup and appends it to element, called this.element_.
   * @return {Element}
   */
  Dialog.prototype.createDOM = function() {
    this.element_ = document.createElement('div');
    this.element_.innerHTML = Handlebars.partials[Dialog.TEMPLATE_ID]({
      buttons: this.buttonCaptions_,
      closeable: this.closeable_,
      content: this.content_,
      hasTitle: d.isDef(this.title_) || this.closeable_,
      title: this.title_
    });

    this.rendered_ = true;

    this.wrapper_ = Dialog.getWrapper(this.element_);

    return this.element_;
  };

  /**
   * Shows dialog. If element has not been rendered before, creates markup.
   */
  Dialog.prototype.show = function() {
    if (this.shown_ === true) {
      return;
    }

    if (!this.rendered_) {
      this.createDOM();
    }

    this.shown_ = true;

    $(this.wrapper_).toggleClass(Dialog.ClassName.WRAPPER_ACTIVE, true);

    document.body.appendChild(this.element_);
    // todo(igor.alexeenko): Listen of window resizes and recalculate position.
    this.setDialogPosition();
    this.setEventHandlersEnabled_(true);
    this.eventHandler_.trigger(Dialog.EventType.AFTER_SHOW);
  };

  /**
   * Hides dialog. Optionally can dispose element after hide.
   * @param {boolean=} opt_dispose
   */
  Dialog.prototype.hide = function(opt_dispose) {
    if (this.shown_ === false) {
      return;
    }

    this.shown_ = false;

    $(this.wrapper_).toggleClass(Dialog.ClassName.WRAPPER_ACTIVE, false);

    document.body.removeChild(this.element_);
    this.setEventHandlersEnabled_(false);
    this.eventHandler_.trigger(Dialog.EventType.AFTER_HIDE);

    if (Boolean(opt_dispose)) {
      this.dispose();
    }
  };

  /**
   * @param {jQuery.Event} evt
   * @private
   */
  Dialog.prototype.onCloseClick_ = function(evt) {
    evt.preventDefault();
    this.hide();
  };

  /**
   * @param {jQuery.Event} evt
   * @private
   */
  Dialog.prototype.onButtonClick_ = function(evt) {
    evt.preventDefault();
    this.eventHandler_.trigger(Dialog.EventType.BUTTON_PRESS,
        evt.currentTarget);
  };

  /**
   * @param {jQuery.Event} evt
   * @private
   */
  Dialog.prototype.onDocumentKeydown_ = function(evt) {
    // todo(igor.alexeenko): Create list of keycodes in utils.
    if (evt.keyCode === 27 && this.closeByEscape_) {
      evt.preventDefault();
      this.hide();
    }
  };

  /**
   * @param {jQuery.Event} evt
   * @private
   */
  Dialog.prototype.onWrapperClick_ = function(evt) {
    if (!Dialog.getWrapper(this.element_).contains(evt.target)) {
      return;
    }

    if (this.closeable_) {
      this.hide();
    }
  };

  /**
   * @param {boolean} enable
   * @private
   */
  Dialog.prototype.setEventHandlersEnabled_ = function(enable) {
    if (this.handlersEnabled_ === enable) {
      return;
    }

    this.handlersEnabled_ = enable;

    this.onCloseClick_ = d.bindContext(this.onCloseClick_, this);
    this.onButtonClick_ = d.bindContext(this.onButtonClick_, this);
    this.onDocumentKeydown_ = d.bindContext(this.onDocumentKeydown_, this);
    this.onWrapperClick_ = d.bindContext(this.onWrapperClick_, this);

    if (enable) {
      $(this.element_).on('click', Dialog.Selector.CLOSE, this.onCloseClick_);
      $(this.element_).on('click', Dialog.Selector.BUTTON, this.onButtonClick_);

      if (this.closeable_) {
        $(this.element_).on('click', Dialog.Selector.WRAPPER,
            this.onWrapperClick_);
        $(document).on('keydown', this.onDocumentKeydown_);
      }
    } else {
      $(this.element).off('click');

      if (this.closeable_) {
        $(document).off('click', this.onDocumentKeydown_);
      }
    }
  };

  /**
   * Returns event handler, to make possible to subscribe to events of this
   * class.
   * @return {jQuery}
   */
  Dialog.prototype.getEventHandler = function() {
    return this.eventHandler_;
  };

  /**
   * Positions element in the middle of the screen.
   */
  Dialog.prototype.setDialogPosition = function() {
    /**
     * Height in pixels on which we should move element up to compensate
     * optical effect of element standing not on the center of the screen.
     * @type {number}
     * @const
     */
    var VERTICAL_COMPENSATION = 25;

    var dialog = Dialog.getDialogElement(this.element_);
    var viewportRect = Dialog.getWrapper(this.element_).getBoundingClientRect();

    dialog.style.marginTop = d.clamp(
        (viewportRect.height - dialog.clientHeight) / 2 - VERTICAL_COMPENSATION,
        0, Infinity) + 'px';
  };

  /**
   * Disposes element by removing all event handlers, instance variables
   * and created {@code HTMLElement}s.
   */
  Dialog.prototype.dispose = function() {
    this.hide();
    this.setEventHandlersEnabled_(false);

    this.eventHandler_.off();

    this.eventHandler_ = null;
    this.buttonCaptions_ = null;
    this.element_ = null;

    this.isDisposed = true;
  };

  /**
   * @static
   * @param {Element} element
   * @return {Element?}
   */
  Dialog.getCloseElement = function(element) {
    return element.querySelector(Dialog.Selector.CLOSE);
  };

  /**
   * @static
   * @param {Element} element
   * @return {NodeList?}
   */
  Dialog.getButtons = function(element) {
    return element.querySelectorAll(Dialog.Selector.BUTTON);
  };

  /**
   * @param {Element} element
   * @return {Element?}
   */
  Dialog.getWrapper = function(element) {
    return element.querySelector(Dialog.Selector.WRAPPER);
  };

  /**
   * @param {Element} element
   * @return {Element}
   */
  Dialog.getDialogElement = function(element) {
    return element.querySelector(Dialog.Selector.DIALOG);
  };

  Module.add('dialog', {
    getDialog: {
      method: function() {
        return Dialog;
      },
      override: true
    }
  });

  return Dialog;
});
