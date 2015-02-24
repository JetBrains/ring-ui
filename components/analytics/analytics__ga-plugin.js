'use sctrict';

/**
 *
 * @param {string?} gaId Google analytics id (should be undefined in development)
 * @constructor
 */
var AnalyticsGAPlugin = function(gaId) {
  /* eslint-disable */
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
  /* eslint-enable */
  /**
   * UA-57284711-1 - ga key for development purpose
   */
  var key = gaId || 'UA-57284711-1';
  /* global ga */
  ga('create', key, (!gaId ? {'cookieDomain': 'none'} : {}));
};

AnalyticsGAPlugin.prototype.trackEvent = function(category, action) {
  if (window.ga) {
    var eventOptions = {
      eventCategory: category,
      eventAction: action
    };
    ga('send', 'event', eventOptions);
  }
};

AnalyticsGAPlugin.prototype.trackPageView = function(path) {
  if (window.ga) {
    ga('send', 'pageview', path);
  }
};

module.exports = AnalyticsGAPlugin;
