export type Serializable =
  | string
  | number
  | boolean
  | null
  | undefined
  | {
      [K in string | number]?: Serializable;
    };

export interface AnalyticsPlugin {
  trackEvent(category: string, action: string, additionalData?: Record<string, Serializable>): void;
  trackPageView(path: string): void;
}

/**
 * @name Analytics
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
