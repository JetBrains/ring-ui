/**
 * @deprecated Will be removed in Ring UI 9.0. No longer maintained; implement your own solution if needed.
 */
export type Serializable =
  | string
  | number
  | boolean
  | null
  | undefined
  | {
      [K in string | number]?: Serializable;
    };

/**
 * @deprecated Will be removed in Ring UI 9.0. No longer maintained; implement your own solution if needed.
 */
export interface AnalyticsPlugin {
  trackEvent(category: string, action: string, additionalData?: Record<string, Serializable>): void;
  trackPageView(path: string): void;
}

/**
 * @name Analytics
 * @deprecated Will be removed in Ring UI 9.0. No longer maintained; implement your own solution if needed.
 */
export class Analytics {
  private _plugins: readonly AnalyticsPlugin[];

  constructor() {
    this._plugins = [];
  }

  config(plugins: readonly AnalyticsPlugin[]) {
    this._plugins = plugins;
  }

  trackEvent(category: string, action: string, additionalData?: Record<string, Serializable>) {
    this._plugins.forEach(plugin => {
      plugin.trackEvent(category, action, additionalData);
    });
  }
}

export default new Analytics();
