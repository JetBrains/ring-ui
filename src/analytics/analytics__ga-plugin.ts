import {AnalyticsPlugin} from './analytics';
import AnalyticsPluginUtils from './analytics__plugin-utils';

declare global {
  interface Window {
    'GoogleAnalyticsObject': string
  }
}

/**
 * @deprecated
 * @param {string?} gaId Google Analytics ID (should be undefined in development)
 * @constructor
 */
export default class AnalyticsGAPlugin implements AnalyticsPlugin {
  constructor(
    gaId?: string | undefined,
    isDevelopment?: boolean | undefined,
    domain?: string,
    cookielessUserIdentifier?: string | undefined
  ) {
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
    ga('set', 'location', domain || '/');
    ga('set', 'allowAdFeatures', false);
  }

  /**
   * @deprecated
   */
  trackEvent(rawCategory: string, rawAction: string, additionalData?: Record<string, string>) {
    if (window.ga != null) {
      const category = AnalyticsPluginUtils.reformatString(rawCategory, true);
      const action = AnalyticsPluginUtils.reformatString(rawAction);
      ga('send', 'event', {
        eventCategory: category,
        eventAction: action
      });
      if (additionalData) {
        ga('send', 'event', {
          eventCategory: category,
          eventAction: action + this._buildSuffix(additionalData)
        });
      }
    }
  }

  /**
   * @deprecated
   */
  trackPageView(path: string) {
    if (window.ga != null) {
      ga('send', 'pageview', path);
    }
  }

  /**
   * @deprecated
   */
  get serializeAdditionalInfo() {
    return true;
  }

  private _buildSuffix(additionalData: Record<string, unknown> | undefined) {
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
