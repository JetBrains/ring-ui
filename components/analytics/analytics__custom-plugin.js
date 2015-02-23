'use sctrict';

var $ = require('jquery');
var AnalyticsCustomPluginUtils = require('./analytics__custom-plugin-utils');

var AnalyticsCustomPlugin = function(send, isDevelopment) {
  this._data = [];
  var self = this;
  this._flush = function () {
    if (self._data.length > 0) {
      send(self._data);
      self._data = [];
    }
  };
  this._isDevelopment = isDevelopment;
};

AnalyticsCustomPlugin.prototype.trackEvent = function(category, action) {
  this._processEvent(category, action);
  /**
   * Save last user action to track 'pageview-last-action'
   */
  this._lastUserEventPresentation = category + '$' + action;
};

AnalyticsCustomPlugin.prototype.trackPageView = function(path) {
  this._trackPageViewAdditionalInfo(path);
  this._processEvent('page', path);
  this._processEvent('navigator_user-agent', AnalyticsCustomPluginUtils.getUserAgentPresentation());
  this._processEvent('navigator_platform', navigator.platform);
  this._processEvent('navigator_lang', navigator.language);
};

AnalyticsCustomPlugin.prototype._initSendSchedule = function () {
  var self = this;
  //TODO: no jquery
  $(window).on('beforeunload', function () {
    self._trackPageViewAdditionalInfo();
    return self._flush();
  });
  setInterval(self._flush, 10000);
  this._hasSendSchedule = true;
};

AnalyticsCustomPlugin.prototype._processEvent = function (category, action) {
  if (!this._hasSendSchedule && this._flush) {
    this._initSendSchedule();
  }
  if (this._isDevelopment) {
    console.log('TRACKING DATA = ', category, action);
  }
  this._data.push({
    category: AnalyticsCustomPluginUtils.reformatString(category),
    action: AnalyticsCustomPluginUtils.reformatString(action)
  });
};

AnalyticsCustomPlugin.prototype._trackPageViewAdditionalInfo = function (newPagePath) {
  var currentTime = (new Date()).getTime();
  if (this._lastPagePath) {
    this._processEvent('pageview-last-action_' + this._lastPagePath, this._lastUserEventPresentation || 'left-with-no-action');
    if (this._lastPageViewTime) {
      var duration = AnalyticsCustomPluginUtils.getPageViewDurationPresentation(currentTime - this._lastPageViewTime);
      this._processEvent('pageview-duration_' + this._lastPagePath, duration);
    }
  }
  this._lastPageViewTime = currentTime;
  this._lastPagePath = newPagePath;
  this._lastUserEventPresentation = undefined;
};

module.exports = AnalyticsCustomPlugin;
