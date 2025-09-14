import {type AnalyticsPlugin, type Serializable} from './analytics';

const DEFAULT_FLUSH_INTERVAL = 10000;
const DEFAULT_FLUSH_MAX_PACK_SIZE = 100;

export interface AnalyticsCustomPluginData {
  category: string;
  action: string;
  data?: Record<string, Serializable>;
  timestamp: number;
}

export interface AnalyticsCustomPluginConfig {
  send: (data: AnalyticsCustomPluginData[]) => void;
  isDevelopment?: boolean | undefined;
  flushInterval?: number | undefined;
  flushMaxPackSize?: number | undefined;
}

export default class AnalyticsCustomPlugin implements AnalyticsPlugin {
  _data: AnalyticsCustomPluginData[];
  private _flush?: () => void;
  private _isDevelopment?: boolean | undefined;
  private _flushInterval?: number;
  private _flushMaxPackSize?: number;
  private _hasSendSchedule?: boolean;

  constructor(
    send: AnalyticsCustomPluginConfig['send'],
    isDevelopment?: AnalyticsCustomPluginConfig['isDevelopment'],
    flushInterval?: AnalyticsCustomPluginConfig['flushInterval'],
  ) {
    this._data = [];
    this.config({
      send,
      isDevelopment,
      flushInterval,
    });
  }

  config(config: AnalyticsCustomPluginConfig) {
    this._flush = () => {
      if (this._data.length > 0) {
        config.send(this._data);
        this._data = [];
      }
    };

    this._isDevelopment = config.isDevelopment;
    this._flushInterval = config.flushInterval || DEFAULT_FLUSH_INTERVAL;
    this._flushMaxPackSize = config.flushMaxPackSize || DEFAULT_FLUSH_MAX_PACK_SIZE;
  }

  trackEvent(category: string, action: string, additionalData?: Record<string, Serializable>) {
    this._processEvent(category, action, additionalData);
  }

  trackPageView(path: string, data?: Record<string, Serializable>) {
    this._processEvent('page', 'view', data);
  }

  private _initSendSchedule() {
    window.addEventListener('beforeunload', () => this._flush?.());

    if (this._flush) {
      setInterval(this._flush, this._flushInterval);
    }
    this._hasSendSchedule = true;
  }

  private _processEvent(category: string, action: string, data?: Record<string, Serializable>) {
    if (!this._hasSendSchedule && this._flush) {
      this._initSendSchedule();
    }
    if (this._isDevelopment) {
      console.log('TRACKING DATA = ', category, action, data); // eslint-disable-line no-console
    }
    const baseSendingData = {category, action, timestamp: Date.now()};
    this._addDataToFlushingPack(data ? {...baseSendingData, data} : baseSendingData);
  }

  private _addDataToFlushingPack(sendingData: AnalyticsCustomPluginData) {
    this._data.push(sendingData);

    if (this._flushMaxPackSize && this._data.length >= this._flushMaxPackSize) {
      this._flush?.();
    }
  }
}
