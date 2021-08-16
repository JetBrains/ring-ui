import AnalyticsPluginUtils from './analytics__plugin-utils';
import {AnalyticsPlugin} from './analytics';

const DEFAULT_FLUSH_INTERVAL = 10000;
const DEFAULT_FLUSH_MAX_PACK_SIZE = 100;

export interface AnalyticsCustomPluginData {
  category: string
  action: string
}

export interface AnalyticsCustomPluginConfig {
  send: (data: AnalyticsCustomPluginData[]) => void
  isDevelopment?: boolean | undefined
  flushInterval?: number | undefined
  flushingAllowedChecker?: (() => boolean) | undefined
  flushMaxPackSize?: number | undefined
}

export default class AnalyticsCustomPlugin implements AnalyticsPlugin {
  _data: AnalyticsCustomPluginData[];
  private _flush?: () => void;
  private _isDevelopment?: boolean | undefined;
  private _flushInterval?: number;
  private _flushMaxPackSize?: number;
  private _lastPagePath?: string;
  private _hasSendSchedule?: boolean;
  private _lastPageViewTime?: number;

  constructor(
    send: AnalyticsCustomPluginConfig['send'],
    isDevelopment?: AnalyticsCustomPluginConfig['isDevelopment'],
    flushInterval?: AnalyticsCustomPluginConfig['flushInterval'],
    flushingAllowedChecker?: AnalyticsCustomPluginConfig['flushingAllowedChecker']
  ) {
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
  config(config: AnalyticsCustomPluginConfig) {
    const checkFlushingAllowed = typeof config.flushingAllowedChecker === 'function'
      ? config.flushingAllowedChecker
      : () => true;

    this._flush = () => {
      if (this._data.length > 0 && checkFlushingAllowed()) {
        config.send(this._data);
        this._data = [];
      }
    };

    this._isDevelopment = config.isDevelopment;
    this._flushInterval = config.flushInterval || DEFAULT_FLUSH_INTERVAL;
    this._flushMaxPackSize = config.flushMaxPackSize || DEFAULT_FLUSH_MAX_PACK_SIZE;
  }

  trackEvent(category: string, action: string) {
    this._processEvent(category, action);
  }

  trackPageView(path: string) {
    if (this._lastPagePath === path) {
      return;
    }

    this._trackPageViewAdditionalInfo(path);
    this._processEvent('ring-page', path);
    this._processEvent(
      'ring-navigator_user-agent',
      AnalyticsPluginUtils.getUserAgentPresentation()
    );
    this._processEvent(
      'ring-navigator_platform',
      AnalyticsPluginUtils.npeSaveLowerCase(navigator.platform)
    );
    this._processEvent(
      'ring-navigator_lang',
      AnalyticsPluginUtils.npeSaveLowerCase(navigator.language)
    );
    this._processEvent(
      'ring-device-pixel-ratio',
      AnalyticsPluginUtils.getDevicePixelRatioPresentation()
    );
    this._processEvent(
      'ring-screen-width',
      AnalyticsPluginUtils.getScreenWidthPresentation()
    );
  }

  private _initSendSchedule() {
    window.addEventListener('beforeunload', () => {
      this._trackPageViewAdditionalInfo();
      return this._flush?.();
    });

    if (this._flush != null) {
      setInterval(this._flush, this._flushInterval);
    }
    this._hasSendSchedule = true;
  }

  private _processEvent(rawCategory: string, rawAction: string) {
    if (!this._hasSendSchedule && this._flush) {
      this._initSendSchedule();
    }
    const category = AnalyticsPluginUtils.reformatString(rawCategory, true);
    const action = AnalyticsPluginUtils.reformatString(rawAction);
    if (this._isDevelopment) {
      console.log('TRACKING DATA = ', category, action); // eslint-disable-line no-console
    }
    this._addDataToFlushingPack({category, action});
  }

  private _trackPageViewAdditionalInfo(newPagePath?: string) {
    const currentTime = (new Date()).getTime();
    if (this._lastPagePath) {
      if (this._lastPageViewTime) {
        const duration = AnalyticsPluginUtils.
          getPageViewDurationPresentation(currentTime - this._lastPageViewTime);
        this._processEvent(`ring-pageview-duration_${this._lastPagePath}`, duration);
      }
    }
    this._lastPageViewTime = currentTime;
    this._lastPagePath = newPagePath;
  }

  private _addDataToFlushingPack(sendingData: AnalyticsCustomPluginData) {
    this._data.push(sendingData);

    if (this._flushMaxPackSize != null && this._data.length >= this._flushMaxPackSize) {
      this._flush?.();
    }
  }

  get serializeAdditionalInfo() {
    return true;
  }
}
