var AnalyticsCustomPluginUtils = require('./analytics__custom-plugin-utils');

var AnalyticsCustomPlugin = function (send, isDevelopment, flushInterval, checkFlushingAllowed) {
  this._data = [];
  var self = this;
  if (typeof checkFlushingAllowed !== 'function') {
    checkFlushingAllowed = function () {
      return true;
    };
  }
  this._flush = function () {
    if (self._data.length > 0 && checkFlushingAllowed()) {
      send(self._data);
      self._data = [];
    }
  };
  this._isDevelopment = isDevelopment;
  this._flushInterval = flushInterval || 10000;
};

AnalyticsCustomPlugin.prototype.trackEvent = function (category, action) {
  this._processEvent(category, action);
};

AnalyticsCustomPlugin.prototype.trackPageView = function (path) {
  if (this._lastPagePath === path) {
    return;
  }
  this._trackPageViewAdditionalInfo(path);
  this._processEvent('ring-page', path);
  this._processEvent('ring-navigator_user-agent', AnalyticsCustomPluginUtils.getUserAgentPresentation());
  this._processEvent('ring-navigator_platform', AnalyticsCustomPluginUtils.npeSaveLowerCase(navigator.platform));
  this._processEvent('ring-navigator_lang', AnalyticsCustomPluginUtils.npeSaveLowerCase(navigator.language));
  this._processEvent('ring-device-pixel-ratio', AnalyticsCustomPluginUtils.getDevicePixelRatioPresentation());
  this._processEvent('ring-screen-width', AnalyticsCustomPluginUtils.getScreenWidthPresentation());
};

AnalyticsCustomPlugin.prototype._initSendSchedule = function () {
  var self = this;
  window.addEventListener('beforeunload', function () {
    self._trackPageViewAdditionalInfo();
    return self._flush();
  });
  setInterval(self._flush, self._flushInterval);
  this._hasSendSchedule = true;
};

AnalyticsCustomPlugin.prototype._processEvent = function (category, action) {
  if (!this._hasSendSchedule && this._flush) {
    this._initSendSchedule();
  }
  category = AnalyticsCustomPluginUtils.reformatString(category, true);
  action = AnalyticsCustomPluginUtils.reformatString(action);
  if (this._isDevelopment) {
    /* eslint-disable no-console*/
    console.log('TRACKING DATA = ', category, action);
    /* eslint-enable no-console*/
  }
  this._data.push({
    category: category,
    action: action
  });
};

AnalyticsCustomPlugin.prototype._trackPageViewAdditionalInfo = function (newPagePath) {
  var currentTime = (new Date()).getTime();
  if (this._lastPagePath) {
    if (this._lastPageViewTime) {
      var duration = AnalyticsCustomPluginUtils.getPageViewDurationPresentation(currentTime - this._lastPageViewTime);
      this._processEvent('ring-pageview-duration_' + this._lastPagePath, duration);
    }
  }
  this._lastPageViewTime = currentTime;
  this._lastPagePath = newPagePath;
};

module.exports = AnalyticsCustomPlugin;
