import deprecate from 'util-deprecate';

import {AnalyticsPlugin} from './analytics';

export interface AnalyticsFUSPluginGroup {
  id: string
  version: string
  baseline: string
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
 * @deprecated
 * @name AnalyticsFUSPlugin
 */
class AnalyticsFUSPlugin implements AnalyticsPlugin {
  /**
   * @deprecated
   */
  trackEvent() {}

  /**
   * @deprecated
   */
  trackPageView() {}

  /**
   * @deprecated
   */
  get serializeAdditionalInfo() {
    return false;
  }
}


export default deprecate(AnalyticsFUSPlugin, 'AnalyticsFUSPlugin is deprecated, use AnalyticsCustomPlugin instead');
