'use strict';

var $ = require('jquery');
var AnaliticsUtils = require('./analytics__utils');

var Analytics = function () {
  this._data = [];
};

/**
 * @param {{
   *   send: function,
   *   googleAnalyticsId: string? (google analytics is disabled if googleAnalyticsId is not defined and isDevelopment == false)
   *   isDevelopment: boolean?
   *   analyticsIsAllowed: boolean?
   * }} config
 */
Analytics.prototype.config = function (config) {
  this._isAllowed = typeof config.analyticsIsAllowed === 'boolean' && config.analyticsIsAllowed;
  if (!this._isAllowed) {
    return;
  }
  var self = this;
  this._flush = function () {
    if (self._data.length > 0) {
      config.send(self._data);
      self._data = [];
    }
  };
  this._isDevelopment = config.isDevelopment;

  if (config.googleAnalyticsId || this._isDevelopment) {
    /* jshint ignore:start */
    (function (i, s, o, g, r, a, m) {
      i.GoogleAnalyticsObject = r;
      i[r] = i[r] || function () {
        (i[r].q = i[r].q || []).push(arguments)
      }, i[r].l = 1 * new Date();
      a = s.createElement(o),
        m = s.getElementsByTagName(o)[0];
      a.async = 1;
      a.src = g;
      m.parentNode.insertBefore(a, m)
    })(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');
    /* jshint ignore:end */
    /**
     * UA-57284711-1 - ga key for test purpose
     */
    var key = config.googleAnalyticsId || 'UA-57284711-1';
    /* global ga */
    ga('create', key, (this._isDevelopment ? {'cookieDomain': 'none'} : {}));
    console.log('Analytics initialized');
  }
};

Analytics.prototype.track = function (rawTrackingData) {
  if (!rawTrackingData || !this._isAllowed) {
    return;
  }
  var params = rawTrackingData.split(':');
  var category = (params.length > 0) ? params[0] : '';
  var trackingEvent = (params.length > 1) ? params[1] : '';
  this.trackEvent(category, trackingEvent);
};

Analytics.prototype.trackPageView = function (path) {
  if (!this._isAllowed) {
    return;
  }
  if (window.ga) {
    ga('send', 'pageview', path);
  }
  this._trackPageViewAdditionalInfo(path);
  this._processEvent('page', path);
  this._processEvent('navigator_user-agent', AnaliticsUtils.getUserAgentPresentation());
  this._processEvent('navigator_platform', navigator.platform);
  this._processEvent('navigator_lang', navigator.language);
};

Analytics.prototype.trackEvent = function (category, evt) {
  if (!this._isAllowed) {
    return;
  }
  if (window.ga) {
    var eventOptions = {
      eventCategory: category,
      eventAction: evt
    };
    ga('send', 'event', eventOptions);
  }
  this._processEvent(category, evt);
  /**
   * Save last user action to track 'pageview-last-action'
   */
  this._lastUserEventPresentation = category + '$' + evt;
};

Analytics.prototype._processEvent = function (category, action) {
  if (!this._hasSendSchedule && this._flush) {
    this._initSendSchedule();
  }
  if (this._isDevelopment) {
    console.log('TRACKING DATA = ', category, action);
  }
  this._data.push({
    category: AnaliticsUtils.reformatString(category),
    action: AnaliticsUtils.reformatString(action)
  });
};

Analytics.prototype._trackPageViewAdditionalInfo = function (newPagePath) {
  var currentTime = (new Date()).getTime();
  if (this._lastPagePath) {
    this._processEvent('pageview-last-action_' + this._lastPagePath, this._lastUserEventPresentation);
    if (this._lastPageViewTime) {
      var duration = AnaliticsUtils.getPageViewDurationPresentation(currentTime - this._lastPageViewTime);
      this._processEvent('pageview-duration_' + this._lastPagePath, duration);
    }
  }
  this._lastPageViewTime = currentTime;
  this._lastPagePath = newPagePath;
  this._lastUserEventPresentation = undefined;
};

Analytics.prototype._initSendSchedule = function () {
  var self = this;
  $(window).on('beforeunload', function () {
    self._trackPageViewAdditionalInfo();
    return self._flush();
  });
  setInterval(self._flush, 10000);
  this._hasSendSchedule = true;
};

module.exports = new Analytics();
