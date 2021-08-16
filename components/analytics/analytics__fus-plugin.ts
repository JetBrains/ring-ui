import AnalyticsPluginUtils from './analytics__plugin-utils';
import {AnalyticsPlugin} from './analytics';

export interface AnalyticsFUSPluginGroup {
  id: string
  version: string
  baseline: string
}

export interface AnalyticsFUSPluginConfig {
  productId?: string | undefined
  productBuild?: string | undefined
  recorderVersion?: number | string | undefined
  isDevelopment?: boolean | undefined
  groups?: readonly AnalyticsFUSPluginGroup[] | undefined
}

interface FusraInitParams {
  recorderCode?: string | undefined,
  recorderVersion: number | string,
  productCode?: string | undefined,
  productBuild?: string | undefined,
  internal: boolean,
  eventCountDelay?: number | undefined,
  reportingFrequency?: number | undefined,
  groups?: readonly AnalyticsFUSPluginGroup[] | undefined,
  useForSubdomains?: boolean | undefined
}
interface FusraEventParams {
  groupId: string,
  groupVersion?: number | string | undefined,
  eventData?: Record<string, unknown> | undefined,
  eventId: string
}
declare global {
  interface Window {
    fusra?: {
      (method: 'init', params: FusraInitParams): void
      (method: 'event', params: FusraEventParams): void
      query?: ['init' | 'event', FusraInitParams | FusraEventParams][]
    }
  }
}

/**
 * @name AnalyticsFUSPlugin
 *
 * @param * @param {{
 *   productId: string,
 *   productBuild: string,
 *   recorderVersion: string?,
 *   isDevelopment: boolean?,
 *   groups: object[]?
 * }} config
 * @constructor
 */
export default class AnalyticsFUSPlugin implements AnalyticsPlugin {
  private _recorderVersion?: number | string;
  private _lastPagePath?: string;
  private _groups: readonly AnalyticsFUSPluginGroup[] | undefined;
  constructor({
    productId,
    productBuild,
    recorderVersion = '1',
    isDevelopment = false,
    groups = []
  }: AnalyticsFUSPluginConfig) {
    if (!productId && !isDevelopment) {
      return;
    }
    ((i, s, o: 'script', g, r: 'fusra') => {
      i[r] = i[r] || function addArgumentsToQueueForWaitingTheScriptLoading(...args) {
        const fn = i[r];
        if (fn != null) {
          (fn.query = fn.query || []).push(args);
        }
      };
      const script = document.createElement(o);
      script.async = true;
      script.src = g;
      const firstScript = document.getElementsByTagName(o)[0];
      firstScript.parentNode?.insertBefore(script, firstScript);
    })(window, document, 'script', '//resources.jetbrains.com/storage/fus/api/fus-reporting-api.js', 'fusra');
    window.fusra?.('init', {
      recorderCode: productId,
      recorderVersion,
      productCode: productId,
      productBuild,
      internal: isDevelopment,
      groups,
      useForSubdomains: true
    });

    this._recorderVersion = recorderVersion;
    this._groups = groups;
  }

  trackEvent(category: string, action: string, additionalInfo?: Record<string, unknown>) {
    this._processEvent(category, action, additionalInfo);
  }

  trackPageView(path: string) {
    if (this._lastPagePath === path) {
      return;
    }

    this._lastPagePath = path;

    this._processEvent('ring.page.view', 'open', {
      path,
      browser: AnalyticsPluginUtils.getUserAgentPresentation(),
      platform: AnalyticsPluginUtils.npeSaveLowerCase(navigator.platform),
      lang: AnalyticsPluginUtils.npeSaveLowerCase(navigator.language),
      ['page-view-duration']: AnalyticsPluginUtils.getPageViewDurationPresentation(),
      ['pixel-ratio']: AnalyticsPluginUtils.getDevicePixelRatioPresentation(),
      screen: AnalyticsPluginUtils.getScreenWidthPresentation()
    });
  }

  get serializeAdditionalInfo() {
    return false;
  }

  private _processEvent(
    category: string,
    action: string,
    additionalInfo: Record<string, unknown> | undefined
  ) {
    const groupId = category.replace(/[-]/g, '.');

    const group = (this._groups || []).filter(
      currentGroup => currentGroup.id === groupId
    )[0];

    if (group && window.fusra) {
      window.fusra('event', {
        groupId,
        groupVersion: group.version || this._recorderVersion,
        eventId: action,
        eventData: additionalInfo
      });
    }
  }
}
