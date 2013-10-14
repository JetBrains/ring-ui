define([
  'alert/alert',
  'global/global__modules',
  'diff/diff__tools'
], function(Alert, Module, diffTool) {
  /**
   * @type {string}
   * @const
   */
  var CLASS_NAME = 'ring-alerts';

  /**
   * @param {Element} opt_parent
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

    /**
     * Callbacks, which allows to implement some kind of animation queue.
     * @type {Array.<function>}
     * @private
     */
    this.animationCallbacks_ = [];

    if (!diffTool.isDef(opt_parent)) {
      opt_parent = document.body;
    }

    opt_parent.appendChild(this.element_);
  };

  /**
   * @param {string} message
   * @param {Alert.Type} opt_type
   * @param {number} opt_timeout
   * @return {Alert}
   */
  Alerts.prototype.showAlert = function(message, opt_type, opt_timeout) {
    if (!diffTool.isDef(opt_type)) {
      opt_type = Alert.Type.MESSAGE;
    }

    var alert = new Alert(message, opt_type);
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
      diffTool.addAnimationCallback(this.animatedAlert_.getElement(),
          diffTool.bindContext(function() {
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
      this.onAnimationEndHandler_ = diffTool.bindContext(this.onAnimationEnd_,
          this);
    }

    diffTool.addAnimationCallback(this.animatedAlert_.getElement(),
        this.onAnimationEndHandler_);

    alert.show(this.element_);

    if (diffTool.isDef(opt_timeout)) {
      /**
       * ID of alert hide timeout to make it possible to prevent it.
       * @type {number}
       * @pri`vate
       */
      this.hideTimeout_ = setTimeout(diffTool.bindContext(function() {
        this.remove(alert);
      }, this), opt_timeout);
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
    diffTool.deleteFromArray(this.stack_, alert);
    alert.hideAndDispose();
  };

  // todo(igor.alexeenko): Implement stack disposal.

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
    }
  });

  return Alerts;
});
