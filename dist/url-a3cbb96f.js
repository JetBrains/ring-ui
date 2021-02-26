/**
 * @const {RegExp}
 */

var ABSOLUTE_URL_PATTERN = /^[a-z]+:\/\//i;
/**
 * Get URI from the <base> tag
 * @return {string|undefined} base URI
 */

function getBaseURI() {
  var baseElement = document.getElementsByTagName('base')[0];
  return baseElement ? baseElement.href : undefined;
}
/**
 * Get absolute URI from the <base> tag
 * @return {string} absolute base URI
 */

function getAbsoluteBaseURL() {
  var baseUrl = getBaseURI();
  var host = "".concat(window.location.protocol, "//").concat(window.location.host);
  var uri;

  if (baseUrl) {
    uri = ABSOLUTE_URL_PATTERN.test(baseUrl) ? baseUrl : host + baseUrl;
  } else {
    uri = host;
  }

  return uri;
}
/**
 * Fixes the URL
 * If the URL is relative and the page contains a <base> TAG, the URL will be converted to absolute
 * <base href="/">: some/path => /some/path
 * @param {string} url URL to fix
 * @param {Function} baseURIGetter a function that returns base URI
 * @return {string} fixed URL
 */

function fixUrl(url) {
  var baseURIGetter = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : getBaseURI;

  if (url.indexOf('http://') === -1 && url.indexOf('https://') === -1 && url.indexOf('/') !== 0) {
    var baseUrl = baseURIGetter();

    if (baseUrl) {
      return baseUrl + url;
    }
  }

  return url;
}
function joinBaseURLAndPath(baseUrl, path) {
  if (!baseUrl || path.indexOf('http://') !== -1 || path.indexOf('https://') !== -1) {
    return path;
  }

  return baseUrl + path;
}
/**
 * Parses a queryString into an object.
 * ```
 * parseQueryString("access_token=2YotnFZFEjr1zCsicMWpAA&state=xyz&token_type=example&expires_in=3600");
 * // is {access_token: "2YotnFZFEjr1zCsicMWpAA", state: "xyz", token_type: "example", expires_in: "3600"}
 * ```
 * @param {string} queryString query parameter string to parse
 * @return {AuthResponse} object with query parameters map
 */

function parseQueryString(queryString) {
  if (queryString == null) {
    return {};
  }

  var queryParameterPairRE = /([^&;=]+)=?([^&;]*)/g;
  var FIRST_PAIR_ELEMENT = 1;
  var SECOND_PAIR_ELEMENT = 2;
  var urlParams = {};

  function decode(s) {
    return decodeURIComponent(s.replace(/\+/g, ' '));
  }

  var matchedQueryPair;

  while ((matchedQueryPair = queryParameterPairRE.exec(queryString)) != null) {
    urlParams[decode(matchedQueryPair[FIRST_PAIR_ELEMENT])] = decode(matchedQueryPair[SECOND_PAIR_ELEMENT]);
  }

  return urlParams;
}

function customEncodeURIComponent(str) {
  var commaRE = /%2C/g;
  return encodeURIComponent(str).replace(commaRE, ',');
}
/**
 * Takes a URL as input and a params object.
 * Each property in the params is added to the URL as query string parameters
 * @param {string} url URL to add parameters to
 * @param {Object} params parameters to add
 * @returns {string} encoded URL
 */


function encodeURL(url, params) {
  var equalsSign = '=';
  var firstSeparator = url.indexOf('?') === -1 ? '?' : '&';
  var res = url;
  var k;
  var i = 0;

  for (k in params) {
    if (params.hasOwnProperty(k) && params[k] != null) {
      res += (i++ === 0 ? firstSeparator : '&') + customEncodeURIComponent(k) + equalsSign + customEncodeURIComponent(params[k]);
    }
  }

  return res;
}
function isDataURI(uri) {
  return uri.indexOf('data:') === 0;
}

export { encodeURL as e, fixUrl as f, getAbsoluteBaseURL as g, isDataURI as i, joinBaseURLAndPath as j, parseQueryString as p };
