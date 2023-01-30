import deprecate from 'util-deprecate';

const warnOnDeprecationOfAnalyticsMethod = (methodName: string) =>
  deprecate(
    () => {},
    `Method analytics::${methodName} is deprecated, use analytics::trackEvent instead`
  )();

export type Serializable = string | number | boolean | null | undefined | {
  [K in string | number]?: Serializable
}

export interface AnalyticsPlugin {
  /**
   * @deprecated
   */
  serializeAdditionalInfo: boolean
  trackEvent(
    category: string,
    action: string,
    additionalData?: Record<string, Serializable>
  ): void
  trackPageView(path: string): void
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

  /**
   * @deprecated
   */
  track(rawTrackingData: string, additionalData: Record<string, Serializable>) {
    if (!rawTrackingData) {
      return;
    }

    warnOnDeprecationOfAnalyticsMethod('track');

    let splitIdx = rawTrackingData.indexOf(':');
    if (splitIdx < 0) {
      splitIdx = rawTrackingData.indexOf('_');
    }
    if (splitIdx < 0) {
      splitIdx = rawTrackingData.length;
    }

    const category = rawTrackingData.substr(0, splitIdx);
    const subcategory = rawTrackingData.substr(splitIdx + 1);

    this.trackEvent(category, subcategory, additionalData);
  }

  /**
   * @deprecated
   */
  trackPageView(path: string) {
    warnOnDeprecationOfAnalyticsMethod('trackPageView');
    this._plugins.forEach(plugin => {
      plugin.trackPageView(path);
    });
  }

  trackEvent(
    category: string,
    action: string,
    additionalData?: Record<string, Serializable>
  ) {
    this._plugins.forEach(plugin => {
      plugin.trackEvent(category, action, additionalData);
    });
  }

  /**
   * @deprecated
   */
  trackShortcutEvent(
    category: string,
    action: string,
    additionalData: Record<string, Serializable>
  ) {
    warnOnDeprecationOfAnalyticsMethod('trackShortcutEvent');
    this.trackEvent(category, action, additionalData);
  }

  /**
   * @deprecated
   */
  trackEntityProperties(
    entityName: string,
    entity: Serializable,
    propertiesNames: readonly string[],
    additionalData?: Record<string, Serializable>
  ) {
    warnOnDeprecationOfAnalyticsMethod('trackEntityProperties');
    for (let i = 0; i < propertiesNames.length; ++i) {
      const keys = propertiesNames[i].split('.');
      let value = entity;

      if (!keys.length) {
        continue;
      }

      for (let j = 0; j < keys.length; ++j) {
        if (typeof value === 'object' && value != null && value.hasOwnProperty(keys[j])) {
          value = value[keys[j]];
        } else {
          value = 'no-value';
          break;
        }
      }

      if (typeof value === 'string') {
        value = value.toLowerCase().replace(/[._]+/g, '-');
      }

      const resultAction = `${keys.join('-')}__${value}`;
      this.trackEvent(entityName, resultAction, additionalData);
    }
  }
}

export default new Analytics();
