/**
 * @fileoverview Helpers to work with URLs.
 * @author igor.alexeenko (Igor Alekseyenko)
 */

/** @namespace */
var urlUtils = {};

/**
 * @const {RegExp}
 */
urlUtils.ORIGIN_PATTERN = /^[a-z]+:\/\/[^/]+/i;

/**
 * @const {RegExp}
 */
urlUtils.ABSOLUTE_URL_PATTERN = /^[a-z]+:\/\//i;

/**
 * @const {RegExp}
 */
urlUtils.ENDING_SLASH_PATTERN = /\/$/;

/**
 * @return {string|undefined}
 */
urlUtils.getBaseURI = function() {
  var baseElement = document.getElementsByTagName('base')[0];
  return baseElement ? baseElement.href : undefined;
};

/**
 * @return {string}
 */
urlUtils.getAbsoluteBaseURL = function () {
  var baseUrl = urlUtils.getBaseURI();
  var host = window.location.protocol + '//' + window.location.host;

  var uri;
  if (baseUrl) {
    uri = urlUtils.ABSOLUTE_URL_PATTERN.test(baseUrl) ? baseUrl : host + baseUrl;
  } else {
    uri = host;
  }

  return uri;
};

/**
 * Get origin from the URL
 * @param {string} url
 * @returns {string|undefined}
 */
urlUtils.getOrigin = function(url) {
  var matches = url.match(urlUtils.ORIGIN_PATTERN);

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
