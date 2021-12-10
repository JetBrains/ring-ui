import {AnalyticsPlugin} from './analytics';

declare global {
  interface Window {
    'GoogleAnalyticsObject': string
  }
}

/**
 *
 * @param {string?} gaId Google Analytics ID (should be undefined in development)
 * @constructor
 */
export default class AnalyticsGAPlugin implements AnalyticsPlugin {
  constructor(gaId?: string | undefined, isDevelopment?: boolean | undefined, domain?: string) {
    if (!gaId && !isDevelopment) {
      return;
    }
    ((i, s, o: 'script', g, r: 'ga') => {
      i.GoogleAnalyticsObject = r;
      i[r] = i[r] || function addArgumentsToQueueForWaitingTheScriptLoading(...args) {
        (i[r].q = i[r].q || []).push(args);
      };
      i[r].l = Number(new Date());
      const a = s.createElement(o);
      const m = s.getElementsByTagName(o)[0];
      a.async = true;
      a.src = g;
      m.parentNode?.insertBefore(a, m);
    })(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');
    /**
     * UA-57284711-1 - ga key for development purpose
     */
    const key = gaId || 'UA-57284711-1';
    /* global ga */
    const gaCookieParams = domain ? {cookieDomain: domain} : {};
    ga('create', key, (!gaId ? {cookieDomain: 'none'} : gaCookieParams));
    ga('set', 'anonymizeIp', true);
    ga('set', 'allowAdFeatures', false);
  }

  trackEvent(category: string, action: string) {
    if (window.ga != null) {
      const eventOptions = {
        eventCategory: category,
        eventAction: action
      };
      ga('send', 'event', eventOptions);
    }
  }

  trackPageView(path: string) {
    if (window.ga != null) {
      ga('send', 'pageview', path);
    }
  }

  get serializeAdditionalInfo() {
    return true;
  }
}
