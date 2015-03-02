/**
 * @fileoverview Helpers to work with URL.
 * @author igor.alexeenko (Igor Alekseyenko)
 */

/** @namespace */
var urlUtils = {};

/**
 * @return {string|undefined}
 */
urlUtils.baseURI = function() {
  if (document.baseURI) {
    return document.baseURI;
  }

  var baseElement = document.getElementsByName('base')[0];
  return baseElement ? baseElement.href : undefined;
};


/**
 * @param {string} url
 * @return {string}
 */
urlUtils.fixUrl = function(url) {
  if (url.indexOf('http://') === -1 && url.indexOf('https://') === -1 && url.indexOf('/') !== 0) {
    var baseUrl = urlUtils.baseURI();
    if (baseUrl) {
      url = baseUrl + url;
    }
  }

  return url;
};

module.exports = urlUtils;
