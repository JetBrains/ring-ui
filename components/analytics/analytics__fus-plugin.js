import AnalyticsPluginUtils from './analytics__plugin-utils';

/**
 * @name AnalyticsFUSPlugin
 *
 * @param * @param {{
 *   productId: string,
 *   productBuild: string,
 *   recorderVersion: string?,
 *   isDevelopment: boolean?,
 *   groups: object[]?
 * }} config
 * @constructor
 */
export default class AnalyticsFUSPlugin {
  constructor({
    productId,
    productBuild,
    recorderVersion = '1',
    isDevelopment = false,
    groups = []
  }) {
    if (!productId && !isDevelopment) {
      return;
    }
    ((i, s, o, g, r) => {
      i[r] = i[r] || function addArgumentsToQueueForWaitingTheScriptLoading() {
        (i[r].query = i[r].query || []).push(arguments);
      };
      const script = document.createElement(o);
      script.async = true;
      script.src = g;
      const firstScript = document.getElementsByTagName(o)[0];
      firstScript.parentNode.insertBefore(script, firstScript);
    })(window, document, 'script', '//resources.jetbrains.com/storage/fus/api/fus-reporting-api.js', 'fusra');
    /* global fusra */
    fusra('init', {
      recorderCode: productId,
      recorderVersion,
      productCode: productId,
      productBuild,
      internal: isDevelopment,
      groups,
      useForSubdomains: true
    });

    this._recorderVersion = recorderVersion;
    this._groups = groups;
  }

  trackEvent(category, action, additionalInfo) {
    this._processEvent(category, action, additionalInfo);
  }

  trackPageView(path) {
    if (this._lastPagePath === path) {
      return;
    }

    this._lastPagePath = path;

    this._processEvent('ring.page.view', 'open', {
      path,
      browser: AnalyticsPluginUtils.getUserAgentPresentation(),
      platform: AnalyticsPluginUtils.npeSaveLowerCase(navigator.platform),
      lang: AnalyticsPluginUtils.npeSaveLowerCase(navigator.language),
      ['page-view-duration']: AnalyticsPluginUtils.getPageViewDurationPresentation(),
      ['pixel-ratio']: AnalyticsPluginUtils.getDevicePixelRatioPresentation(),
      screen: AnalyticsPluginUtils.getScreenWidthPresentation()
    });
  }

  get serializeAdditionalInfo() {
    return false;
  }

  _processEvent(category, action, additionalInfo) {
    const groupId = category.replace(/[-]/g, '.');

    const group = (this._groups || []).filter(
      currentGroup => currentGroup.id === groupId
    )[0];

    if (group && window.fusra) {
      fusra('event', {
        groupId,
        groupVersion: group.version || this._recorderVersion,
        eventId: action,
        eventData: additionalInfo
      });
    }
  }
}
