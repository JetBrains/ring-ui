/**
 * @fileoverview Helpers to work with URLs.
 * @author igor.alexeenko (Igor Alekseyenko)
 */

/** @namespace */
var urlUtils = {};


urlUtils.ORIGIN_PATTERN = /^[a-z]+:\/\/[^/]+/i;

/**
 * @return {string|undefined}
 */
urlUtils.getBaseURI = function() {
  var baseElement = document.getElementsByTagName('base')[0];
  return baseElement ? baseElement.href : undefined;
};

/**
 * Get origin from the URL
 * @param {string} url
 * @returns {string|undefined}
 */
urlUtils.getOrigin = function(url) {
  var matches = url.match(this.ORIGIN_PATTERN);

  if (matches) {
    return matches[0];
  }
};

/**
 * Fixes the URL
 * If the URL is relative and the page contains a <base> TAG, the URL will be converted to absolute
 * <base href="/">: some/path => /some/path
 * @param {string} url
 * @return {string}
 */
urlUtils.fixUrl = function(url) {
  if (url.indexOf('http://') === -1 && url.indexOf('https://') === -1 && url.indexOf('/') !== 0) {
    var baseUrl = urlUtils.getBaseURI();
    if (baseUrl) {
      url = baseUrl + url;
    }
  }

  return url;
};

module.exports = urlUtils;
