/**
 * @name Analytics
 * @category Utilities
 * @tags Ring UI Language
 * @description Provides a façade to Google Analytics and other web analytics services through a system of plugins.
 * @example
   <example name="Analytics">
    <file name="index.html">
      <div>
        <p>Click the link below and check the console output:</p>
        <div>
          <a href id="click-me">
            Track click event
          </a>
        </div>
      </div>
    </file>
    <file name="index.js">
      import analytics from '@jetbrains/ring-ui/components/analytics/analytics';
      import linkStyles from '@jetbrains/ring-ui/components/link/link.css';
      import AnalyticsCustomPlugin from '@jetbrains/ring-ui/components/analytics/analytics__custom-plugin';

      const FLUSH_INTERVAL = 100;

      const customPlugin = new AnalyticsCustomPlugin(events => (
        console.log('Custom plugin receives:', events[0].category, events[0].action)
      ), false, FLUSH_INTERVAL);

      analytics.config([customPlugin]);

      document.getElementById('click-me').className = linkStyles.link;

      document.getElementById('click-me').addEventListener('click', event => {
        analytics.trackEvent('test-category', 'test-action');
        event.preventDefault();
      });
    </file>
   </example>
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
