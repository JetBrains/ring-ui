type Serializable = string | number | boolean | null | undefined | {
  [K in string | number]?: Serializable
}

export interface AnalyticsPlugin {
  serializeAdditionalInfo: boolean
  trackEvent(
    category: string,
    action: string,
    additionalData?: Record<string, unknown> | undefined
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

  track(rawTrackingData: string, additionalData?: Record<string, unknown> | undefined) {
    if (!rawTrackingData) {
      return;
    }

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

  trackPageView(path: string) {
    this._plugins.forEach(plugin => {
      plugin.trackPageView(path);
    });
  }

  trackEvent(
    category: string,
    action: string,
    additionalData?: Record<string, unknown> | undefined
  ) {
    const subaction = additionalData ? action + this._buildSuffix(additionalData) : null;
    this._plugins.forEach(plugin => {
      if (plugin.serializeAdditionalInfo) {
        plugin.trackEvent(category, action);
        if (subaction) {
          plugin.trackEvent(category, subaction);
        }
      } else {
        plugin.trackEvent(category, action, additionalData);
      }
    });
  }

  trackShortcutEvent(
    category: string,
    action: string,
    additionalData?: Record<string, unknown> | undefined
  ) {
    this.trackEvent(category, action, additionalData);
    this.trackEvent('ring-shortcut', `${category}$${action}`, additionalData);
  }

  trackEntityProperties(
    entityName: string,
    entity: Serializable,
    propertiesNames: readonly string[],
    additionalData?: Record<string, unknown> | undefined
  ) {
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

  private _buildSuffix(additionalData: Record<string, unknown> | undefined) {
    if (!additionalData) {
      return '';
    }

    let suffix = '';
    let key;
    for (key in additionalData) {
      if (additionalData.hasOwnProperty(key)) {
        suffix += `__${key}$${additionalData[key]}`;
      }
    }

    return suffix;
  }
}

export default new Analytics();
