/**
 * @name Analytics
 */
class Analytics {
  constructor() {
    this._plugins = [];
  }

  config(plugins) {
    this._plugins = plugins;
  }

  track(rawTrackingData, /* optional */ additionalData) {
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

  trackPageView(path) {
    this._plugins.forEach(plugin => {
      plugin.trackPageView(path);
    });
  }

  trackEvent(category, action, /* optional */ additionalData) {
    const subaction = additionalData ? action + this._buildSuffix(additionalData) : null;
    this._plugins.forEach(plugin => {
      plugin.trackEvent(category, action);
      if (subaction) {
        plugin.trackEvent(category, subaction);
      }
    });
  }

  trackShortcutEvent(category, action, /* optional */ additionalData) {
    this.trackEvent(category, action, additionalData);
    this.trackEvent('ring-shortcut', `${category}$${action}`, additionalData);
  }

  trackEntityProperties(entityName, entity, propertiesNames, /* optional */ additionalData) {
    for (let i = 0; i < propertiesNames.length; ++i) {
      const keys = propertiesNames[i].split('.');
      let value = entity;

      if (!keys.length) {
        continue;
      }

      for (let j = 0; j < keys.length; ++j) {
        if (value.hasOwnProperty(keys[j])) {
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

  _buildSuffix(additionalData) {
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
