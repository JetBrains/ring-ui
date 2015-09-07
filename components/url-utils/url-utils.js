/**
 * @fileoverview Helpers to work with URLs.
 * @author igor.alexeenko (Igor Alekseyenko)
 */

export default class urlUtils {
  /**
   * @const {RegExp}
   */
  static ORIGIN_PATTERN = /^[a-z]+:\/\/[^/]+/i;

  /**
   * @const {RegExp}
   */
  static ABSOLUTE_URL_PATTERN = /^[a-z]+:\/\//i;

  /**
   * @const {RegExp}
   */
  static ENDING_SLASH_PATTERN = /\/$/;

  /**
   * @return {string|undefined}
   */
  static getBaseURI() {
    let baseElement = document.getElementsByTagName('base')[0];
    return baseElement ? baseElement.href : undefined;
  }

  /**
   * @return {string}
   */
  static getAbsoluteBaseURL() {
    let baseUrl = urlUtils.getBaseURI();
    let host = window.location.protocol + '//' + window.location.host;

    let uri;
    if (baseUrl) {
      uri = urlUtils.ABSOLUTE_URL_PATTERN.test(baseUrl) ? baseUrl : host + baseUrl;
    } else {
      uri = host;
    }

    return uri;
  }

  /**
   * Get origin from the URL
   * @param {string} url
   * @returns {string|undefined}
   */
  static getOrigin(url) {
    let matches = url.match(urlUtils.ORIGIN_PATTERN);

    if (matches) {
      return matches[0];
    }
  }

  /**
   * Fixes the URL
   * If the URL is relative and the page contains a <base> TAG, the URL will be converted to absolute
   * <base href="/">: some/path => /some/path
   * @param {string} url
   * @return {string}
   */
  static fixUrl(url) {
    if (url.indexOf('http://') === -1 && url.indexOf('https://') === -1 && url.indexOf('/') !== 0) {
      let baseUrl = urlUtils.getBaseURI();
      if (baseUrl) {
        url = baseUrl + url;
      }
    }

    return url;
  }
}
