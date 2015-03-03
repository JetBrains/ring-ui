var deepMixIn = require('mout/object/deepMixIn');

var Analytics = function () {
  this._plugins = [];
};

deepMixIn(Analytics.prototype, {
  /**
   * @param [{{
   *   trackPageView: function,
   *   trackEvent: function
   * }}] plugins
   */
  config: function (plugins) {
    this._plugins = plugins;
  },

  track: function (rawTrackingData) {
    if (!rawTrackingData) {
      return;
    }
    var params = rawTrackingData.split(':');
    var category = (params.length > 0) ? params[0] : '';
    var trackingEvent = (params.length > 1) ? params[1] : '';
    this.trackEvent(category, trackingEvent);
  },

  trackPageView: function (path) {
    this._plugins.forEach(function (plugin) {
      plugin.trackPageView(path);
    });
  },

  trackEvent: function (category, action) {
    this._plugins.forEach(function (plugin) {
      plugin.trackEvent(category, action);
    });
  }

});


module.exports = new Analytics();
