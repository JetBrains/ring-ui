import AnalyticsCustomPluginUtils from './analytics__custom-plugin-utils';

export default class AnalyticsCustomPlugin {

  constructor(send, isDevelopment, flushInterval, flushingAllowedChecker) {
    this._data = [];
    this.config({
      send,
      isDevelopment,
      flushInterval,
      flushingAllowedChecker
    });
  }

  /**
   * @param config
   * @property {function} config.send
   * @property {boolean} config.isDevelopment
   * @property {number} config.flushInterval
   * @property {function} config.flushingAllowedChecker
   * @property {number} config.flushMaxPackSize
   */
  config(config) {
    let checkFlushingAllowed = config.flushingAllowedChecker;
    if (typeof checkFlushingAllowed !== 'function') {
      checkFlushingAllowed = function () {
        return true;
      };
    }

    this._flush = () => {
      if (this._data.length > 0 && checkFlushingAllowed()) {
        config.send(this._data);
        this._data = [];
      }
    };

    this._isDevelopment = config.isDevelopment;
    this._flushInterval = config.flushInterval || 10000;
    this._flushMaxPackSize = config.flushMaxPackSize || 100;
  }

  trackEvent(category, action) {
    this._processEvent(category, action);
  }

  trackPageView(path) {
    if (this._lastPagePath === path) {
      return;
    }

    this._trackPageViewAdditionalInfo(path);
    this._processEvent('ring-page', path);
    this._processEvent(
      'ring-navigator_user-agent',
      AnalyticsCustomPluginUtils.getUserAgentPresentation()
    );
    this._processEvent(
      'ring-navigator_platform',
      AnalyticsCustomPluginUtils.npeSaveLowerCase(navigator.platform)
    );
    this._processEvent(
      'ring-navigator_lang',
      AnalyticsCustomPluginUtils.npeSaveLowerCase(navigator.language)
    );
    this._processEvent(
      'ring-device-pixel-ratio',
      AnalyticsCustomPluginUtils.getDevicePixelRatioPresentation()
    );
    this._processEvent(
      'ring-screen-width',
      AnalyticsCustomPluginUtils.getScreenWidthPresentation()
    );
  }

  _initSendSchedule() {
    window.addEventListener('beforeunload', () => {
      this._trackPageViewAdditionalInfo();
      return this._flush();
    });

    setInterval(this._flush, this._flushInterval);
    this._hasSendSchedule = true;
  }

  _processEvent(rawCategory, rawAction) {
    if (!this._hasSendSchedule && this._flush) {
      this._initSendSchedule();
    }
    const category = AnalyticsCustomPluginUtils.reformatString(rawCategory, true);
    const action = AnalyticsCustomPluginUtils.reformatString(rawAction);
    if (this._isDevelopment) {
      console.log('TRACKING DATA = ', category, action); // eslint-disable-line no-console
    }
    this._addDataToFlushingPack({category, action});
  }

  _trackPageViewAdditionalInfo(newPagePath) {
    const currentTime = (new Date()).getTime();
    if (this._lastPagePath) {
      if (this._lastPageViewTime) {
        const duration = AnalyticsCustomPluginUtils.
          getPageViewDurationPresentation(currentTime - this._lastPageViewTime);
        this._processEvent(`ring-pageview-duration_${this._lastPagePath}`, duration);
      }
    }
    this._lastPageViewTime = currentTime;
    this._lastPagePath = newPagePath;
  }

  _addDataToFlushingPack(sendingData) {
    this._data.push(sendingData);

    if (this._data.length >= this._flushMaxPackSize) {
      this._flush();
    }
  }
}
