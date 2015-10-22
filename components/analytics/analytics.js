var Analytics = function () {
  this._plugins = [];
};

/**
 * @param plugins [{{
   *   trackPageView: function,
   *   trackEvent: function
   * }}] plugins
 */
Analytics.prototype.config = function (plugins) {
  this._plugins = plugins;
};

Analytics.prototype.track = function (rawTrackingData, /* optional */ additionalData) {
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
};

Analytics.prototype.trackPageView = function (path) {
  this._plugins.forEach(function(plugin) {
    plugin.trackPageView(path);
  });
};

Analytics.prototype.trackEvent = function (category, action, /* optional */ additionalData) {
  var subaction = additionalData ? action + this._buildSuffix(additionalData) : null;
  this._plugins.forEach(function(plugin) {
    plugin.trackEvent(category, action);
    if (subaction) {
      plugin.trackEvent(category, subaction);
    }
  });
};

Analytics.prototype.trackShortcutEvent = function (category, action, /* optional */ additionalData) {
  this.trackEvent(category, action, additionalData);
  this.trackEvent('ring-shortcut', category + '$' + action, additionalData);
};

Analytics.prototype.trackEntityProperties = function(entityName, entity, propertiesNames, /* optional */ additionalData) {
  for (var i = 0; i < propertiesNames.length; ++i) {
    var value = entity;
    var keys = propertiesNames[i].split('.');
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
      value = value.toLowerCase().replace(/[\._]+/g, '-');
    }
    var resultAction = keys.join('-') + '__' + value;
    this.trackEvent(entityName, resultAction, additionalData);
  }
};

Analytics.prototype._buildSuffix = function(additionalData) {
  if (!additionalData) {
    return '';
  }
  var suffix = '';
  for (var key in additionalData) {
    if (additionalData.hasOwnProperty(key)) {
      suffix += '__' + key + '$' + additionalData[key];
    }
  }
  return suffix;
};

module.exports = new Analytics();
