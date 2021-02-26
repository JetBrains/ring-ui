import { c as _createClass, b as _classCallCheck } from './_rollupPluginBabelHelpers-ab14fb00.js';

/**
 * @name Analytics
 */
var Analytics = /*#__PURE__*/function () {
  function Analytics() {
    _classCallCheck(this, Analytics);

    this._plugins = [];
  }

  _createClass(Analytics, [{
    key: "config",
    value: function config(plugins) {
      this._plugins = plugins;
    }
  }, {
    key: "track",
    value: function track(rawTrackingData,
    /* optional */
    additionalData) {
      if (!rawTrackingData) {
        return;
      }

      var splitIdx = rawTrackingData.indexOf(':');

      if (splitIdx < 0) {
        splitIdx = rawTrackingData.indexOf('_');
      }

      if (splitIdx < 0) {
        splitIdx = rawTrackingData.length;
      }

      var category = rawTrackingData.substr(0, splitIdx);
      var subcategory = rawTrackingData.substr(splitIdx + 1);
      this.trackEvent(category, subcategory, additionalData);
    }
  }, {
    key: "trackPageView",
    value: function trackPageView(path) {
      this._plugins.forEach(function (plugin) {
        plugin.trackPageView(path);
      });
    }
  }, {
    key: "trackEvent",
    value: function trackEvent(category, action,
    /* optional */
    additionalData) {
      var subaction = additionalData ? action + this._buildSuffix(additionalData) : null;

      this._plugins.forEach(function (plugin) {
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
  }, {
    key: "trackShortcutEvent",
    value: function trackShortcutEvent(category, action,
    /* optional */
    additionalData) {
      this.trackEvent(category, action, additionalData);
      this.trackEvent('ring-shortcut', "".concat(category, "$").concat(action), additionalData);
    }
  }, {
    key: "trackEntityProperties",
    value: function trackEntityProperties(entityName, entity, propertiesNames,
    /* optional */
    additionalData) {
      for (var i = 0; i < propertiesNames.length; ++i) {
        var keys = propertiesNames[i].split('.');
        var value = entity;

        if (!keys.length) {
          continue;
        }

        for (var j = 0; j < keys.length; ++j) {
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

        var resultAction = "".concat(keys.join('-'), "__").concat(value);
        this.trackEvent(entityName, resultAction, additionalData);
      }
    }
  }, {
    key: "_buildSuffix",
    value: function _buildSuffix(additionalData) {
      if (!additionalData) {
        return '';
      }

      var suffix = '';
      var key;

      for (key in additionalData) {
        if (additionalData.hasOwnProperty(key)) {
          suffix += "__".concat(key, "$").concat(additionalData[key]);
        }
      }

      return suffix;
    }
  }]);

  return Analytics;
}();

var analytics = new Analytics();

export default analytics;
