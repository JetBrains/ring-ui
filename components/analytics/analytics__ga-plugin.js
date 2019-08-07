/**
 *
 * @param {string?} gaId Google Analytics ID (should be undefined in development)
 * @constructor
 */
export default class AnalyticsGAPlugin {
  constructor(gaId, isDevelopment) {
    if (!gaId && !isDevelopment) {
      return;
    }
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
    const key = gaId || 'UA-57284711-1';
    /* global ga */
    ga('create', key, (!gaId ? {cookieDomain: 'none'} : {}));
    ga('set', 'anonymizeIp', true);
    ga('set', 'allowAdFeatures', false);
  }

  trackEvent(category, action) {
    if (window.ga) {
      const eventOptions = {
        eventCategory: category,
        eventAction: action
      };
      ga('send', 'event', eventOptions);
    }
  }

  trackPageView(path) {
    if (window.ga) {
      ga('send', 'pageview', path);
    }
  }
}
