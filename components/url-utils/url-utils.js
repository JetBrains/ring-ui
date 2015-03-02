/**
 * @fileoverview Helpers to work with URL.
 * @author igor.alexeenko (Igor Alekseyenko)
 */

/** @namespace */
var urlUtils = {};

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
