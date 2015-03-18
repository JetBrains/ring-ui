/**
 * @fileoverview Helpers to work with URL.
 * @author igor.alexeenko (Igor Alekseyenko)
 */

/** @namespace */
var urlUtils = {};


urlUtils.ORIGIN_PATTERN = /^[a-z]+:\/\/[^/]+/i;

/**
 * @return {string|undefined}
 */
urlUtils.getBaseURI = function() {
  if (document.baseURI) {
    return document.baseURI;
  }

  var baseElement = document.getElementsByTagName('base')[0];
  return baseElement ? baseElement.href : undefined;
};

/**
 * Get origin from url
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
 * Gets url and fix it.
 * If url is relative and there is <base> TAG in page code url will be converted to absolute.
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
