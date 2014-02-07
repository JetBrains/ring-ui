define([
  'alert/alert',
  'global/global__modules',
  'diff/diff__tools'
], function(Alert, Module, d) {
  /**
   * @type {string}
   * @const
   */
  var CLASS_NAME = 'ring-alerts';

  /**
   * @param {Element=} opt_parent
   * @constructor
   */
  var Alerts = function(opt_parent) {
    /**
     * @type {Array.<Alert>}
     * @private
     */
    this.stack_ = [];

    /**
     * @type {Element}
     * @private
     */
    this.element_ = document.createElement('div');
    this.element_.className = CLASS_NAME;

    /**
     * @type {Alert}
     * @private
     */
    this.animatedAlert_ = null;

    if (!d.isDef(opt_parent)) {
      opt_parent = document.body;
    }

    opt_parent.appendChild(this.element_);
  };

  /**
   * @param {string} message
   * @param {Alert.Type} opt_type
   * @param {boolean=} opt_closeable
   * @param {number=} opt_timeout
   * @return {Alert}
   */
  Alerts.prototype.showAlert = function(message, opt_type, opt_closeable,
                                        opt_timeout) {
    if (!d.isDef(opt_type)) {
      opt_type = Alert.Type.MESSAGE;
    }

    var alert = new Alert(message, opt_type, opt_closeable);
    this.add(alert, opt_timeout);

    return alert;
  };

  /**
   * @param {Alert} alert
   * @param {number=} opt_timeout
   */
  Alerts.prototype.add = function(alert, opt_timeout) {
    if (!this.animatedAlert_) {
      this.showAlert_(alert, opt_timeout);
    } else {
      // todo(igor.alexeenko): kind a dirty solution. Implement {AnimationQueue}
      // as in Google Closure Library.
      d.addAnimationCallback(this.animatedAlert_.getElement(),
          d.bindContext(function() {
        this.add(alert, opt_timeout);
      }, this));
    }
  };

  /**
   * @param {Alert} alert
   * @param {number=} opt_timeout
   * @private
   */
  Alerts.prototype.showAlert_ = function(alert, opt_timeout) {
    this.stack_.push(alert);
    this.animatedAlert_ = alert;

    if (!this.onAnimationEndHandler_) {
      this.onAnimationEndHandler_ = d.bindContext(this.onAnimationEnd_,
          this);
    }

    d.addAnimationCallback(this.animatedAlert_.getElement(),
        this.onAnimationEndHandler_);

    alert.show(this.element_);

    if (d.isDef(opt_timeout)) {
      var addTimeoutFn = d.bindContext(function() {
        /**
         * ID of alert hide timeout to make it possible to prevent it.
         * @type {number}
         * @private
         */
        this.hideTimeout_ = setTimeout(d.bindContext(function() {
          this.remove(alert);
        }, this), opt_timeout);
      }, this);

      if (d.isDocumentHidden()) {
        d.addDocumentVisibilityChangeCallback(addTimeoutFn);
      } else {
        addTimeoutFn();
      }
    }
  };

  /**
   * @private
   */
  Alerts.prototype.onAnimationEnd_ = function() {
    this.animatedAlert_ = null;
  };

  /**
   * @param {Alert} alert
   */
  Alerts.prototype.remove = function(alert) {
    var index = this.stack_.indexOf(alert);

    if (index > -1) {
      this.removeAt(index);
    }
  };

  /**
   * @param {number} index
   */
  Alerts.prototype.removeAt = function(index) {
    if (!this.stack_[index]) {
      return;
    }

    var alert = this.stack_[index];
    d.deleteFromArray(this.stack_, alert);
    alert.hideAndDispose();
  };

  // todo(igor.alexeenko): Implement stack disposal.

  var alerts = null;

  /**
   * Adds alert.
   * @param {string} message
   * @param {Alert.type} type
   * @param {boolean=} opt_closeable
   * @param {number=} opt_timeout
   * @return {Alert}
   */
  var addAlert = function(message, type, opt_closeable, opt_timeout) {
    if (!alerts) {
      alerts = new Alerts();
    }

    return alerts.showAlert(message, type, opt_closeable, opt_timeout);
  };

  /**
   * Removes alert.
   * @param {Alert|number} alert
   */
  var removeAlert = function(alert) {
    if (typeof alert === 'number') {
      alerts.removeAt(alert);
    } else {
      alerts.remove(alert);
    }
  };

  Module.add('alerts', {
    getAlert: {
      method: function() {
        return Alert;
      },
      override: true
    },

    getAlerts: {
      method: function() {
        return Alerts;
      },
      override: true
    },

    getAlertTypes: {
      method: function() {
        return Alert.Type;
      },
      override: true
    },

    add: {
      method: addAlert,
      override: true
    },

    remove: {
      method: removeAlert,
      override: true
    }
  });

  return Alerts;
});
