var Analytics = function () {
  this._plugins = [];
};

/**
 * @param [{{
   *   trackPageView: function,
   *   trackEvent: function
   * }}] plugins
 */
Analytics.prototype.config = function (plugins) {
  this._plugins = plugins;
};

Analytics.prototype.track = function (rawTrackingData) {
  if (!rawTrackingData) {
    return;
  }
  var params = rawTrackingData.split(':');
  var category = (params.length > 0) ? params[0] : '';
  var trackingEvent = (params.length > 1) ? params[1] : '';
  this.trackEvent(category, trackingEvent);
};

Analytics.prototype.trackPageView = function (path) {
  this._plugins.forEach(function(plugin) {
    plugin.trackPageView(path);
  });
};

Analytics.prototype.trackEvent = function (category, action) {
  this._plugins.forEach(function(plugin) {
    plugin.trackEvent(category, action);
  });
};


module.exports = new Analytics();
