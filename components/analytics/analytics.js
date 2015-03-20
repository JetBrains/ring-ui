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

Analytics.prototype.track = function (rawTrackingData, /* optional */ viaShortcut) {
  if (!rawTrackingData) {
    return;
  }
  var splitIdx = rawTrackingData.indexOf(':');
  if (splitIdx < 0) {
    splitIdx = rawTrackingData.indexOf('_');
  }
  if (splitIdx < 0) {
    return;
  }
  var category = rawTrackingData.substr(0, splitIdx);
  var subcategory = rawTrackingData.substr(splitIdx + 1);
  this.trackEvent(category, subcategory, viaShortcut);
};

Analytics.prototype.trackPageView = function (path) {
  this._plugins.forEach(function(plugin) {
    plugin.trackPageView(path);
  });
};

Analytics.prototype.trackEvent = function (category, action, /* optional */ viaShortcut) {
  this._plugins.forEach(function(plugin) {
    plugin.trackEvent(category, action);
    if (viaShortcut) {
      plugin.trackEvent('ring-shortcut', category + ':' + action);
    }
  });
};

module.exports = new Analytics();
