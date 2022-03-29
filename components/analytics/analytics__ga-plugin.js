/**
 *
 * @param {string?} gaId Google Analytics ID (should be undefined in development)
 * @constructor
 */
export default class AnalyticsGAPlugin {
  constructor(gaId, isDevelopment, domain, cookielessUserIdentifier) {
    if (!gaId && !isDevelopment) {
      return;
    }
    ((i, s, o, g, r) => {
      i.GoogleAnalyticsObject = r;
      i[r] = i[r] || function addArgumentsToQueueForWaitingTheScriptLoading() {
        (i[r].q = i[r].q || []).push(arguments);
      };
      i[r].l = 1 * new Date();
      const a = s.createElement(o);
      const m = s.getElementsByTagName(o)[0];
      a.async = 1;
      a.src = g;
      m.parentNode.insertBefore(a, m);
    })(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');
    /**
     * UA-57284711-1 - ga key for development purpose
     */
    const key = gaId || 'UA-57284711-1';
    /* global ga */
    if (cookielessUserIdentifier) {
      ga('create', key, {
        storage: 'none',
        clientId: cookielessUserIdentifier
      });
    } else {
      const gaCookieParams = domain ? {cookieDomain: domain} : {};
      ga('create', key, (!gaId ? {cookieDomain: 'none'} : gaCookieParams));
    }

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

  get serializeAdditionalInfo() {
    return true;
  }
}
