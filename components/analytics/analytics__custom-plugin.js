import AnalyticsCustomPluginUtils from './analytics__custom-plugin-utils';

export default function AnalyticsCustomPlugin(send, isDevelopment, flushInterval, flushingAlloweChecker) {
  this._data = [];

  let checkFlushingAllowed = flushingAlloweChecker;
  if (typeof checkFlushingAllowed !== 'function') {
    checkFlushingAllowed = function () {
      return true;
    };
  }

  this._flush = () => {
    if (this._data.length > 0 && checkFlushingAllowed()) {
      send(this._data);
      this._data = [];
    }
  };

  this._isDevelopment = isDevelopment;
  this._flushInterval = flushInterval || 10000;
}

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
  window.addEventListener('beforeunload', () => {
    this._trackPageViewAdditionalInfo();
    return this._flush();
  });

  setInterval(this._flush, this._flushInterval);
  this._hasSendSchedule = true;
};

AnalyticsCustomPlugin.prototype._processEvent = function (rawCategory, rawAction) {
  if (!this._hasSendSchedule && this._flush) {
    this._initSendSchedule();
  }
  const category = AnalyticsCustomPluginUtils.reformatString(rawCategory, true);
  const action = AnalyticsCustomPluginUtils.reformatString(rawAction);
  if (this._isDevelopment) {
    console.log('TRACKING DATA = ', category, action); // eslint-disable-line no-console
  }
  this._addDataToFlushingPack({category, action});
};

AnalyticsCustomPlugin.prototype._trackPageViewAdditionalInfo = function (newPagePath) {
  const currentTime = (new Date()).getTime();
  if (this._lastPagePath) {
    if (this._lastPageViewTime) {
      const duration = AnalyticsCustomPluginUtils.getPageViewDurationPresentation(currentTime - this._lastPageViewTime);
      this._processEvent(`ring-pageview-duration_${this._lastPagePath}`, duration);
    }
  }
  this._lastPageViewTime = currentTime;
  this._lastPagePath = newPagePath;
};

AnalyticsCustomPlugin.prototype._addDataToFlushingPack = function (sendingData) {
  this._data.push(sendingData);

  const flushMaxPackSize = 100;
  if (this._data.length >= flushMaxPackSize) {
    this._flush();
  }
};
