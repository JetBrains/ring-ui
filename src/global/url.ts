/**
 * @description Provides a set of utilities for URL manipulation.
 */

/**
 * @const {RegExp}
 */
const ORIGIN_PATTERN = /^[a-z]+:\/\/[^/]+/i;

/**
 * @const {RegExp}
 */
const ABSOLUTE_URL_PATTERN = /^[a-z]+:\/\//i;

/**
 * @const {RegExp}
 */
export const ENDING_SLASH_PATTERN = /\/$/;

/**
 * Get URI from the <base> tag
 * @return {string|undefined} base URI
 */
export function getBaseURI() {
  const baseElement = document.getElementsByTagName('base')[0];
  return baseElement ? baseElement.href : undefined;
}

/**
 * Get absolute URI from the <base> tag
 * @return {string} absolute base URI
 */
export function getAbsoluteBaseURL() {
  const baseUrl = getBaseURI();
  const host = `${window.location.protocol}//${window.location.host}`;

  let uri;
  if (baseUrl) {
    uri = ABSOLUTE_URL_PATTERN.test(baseUrl) ? baseUrl : host + baseUrl;
  } else {
    uri = host;
  }

  return uri;
}

/**
 * Get origin from the URL
 * @param {string} url URL to extract origin from
 * @returns {string|undefined} origin
 */
export function getOrigin(url: string) {
  const matches = url.match(ORIGIN_PATTERN);

  if (matches) {
    return matches[0];
  }

  return undefined;
}

/**
 * Get absolute URI from current page
 * @return {string} absolute URL of current page
 */
export function getAbsoluteURL() {
  return window.location.href.split('#')[0];
}

/**
 * Fixes the URL
 * If the URL is relative and the page contains a <base> TAG, the URL will be converted to absolute
 * <base href="/">: some/path => /some/path
 * @param {string} url URL to fix
 * @param {Function} baseURIGetter a function that returns base URI
 * @return {string} fixed URL
 */
export function fixUrl(url: string, baseURIGetter = getBaseURI) {
  if (url.indexOf('http://') === -1 && url.indexOf('https://') === -1 && url.indexOf('/') !== 0) {
    const baseUrl = baseURIGetter();

    if (baseUrl) {
      return baseUrl + url;
    }
  }

  return url;
}

export function joinBaseURLAndPath(baseUrl: string | null | undefined, path: string) {
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
export function parseQueryString(queryString: string | null | undefined) {
  if (!queryString) {
    return {};
  }

  const queryParameterPairRE = /([^&;=]+)=?([^&;]*)/g;
  const FIRST_PAIR_ELEMENT = 1;
  const SECOND_PAIR_ELEMENT = 2;
  const urlParams: Record<string, string> = {};

  function decode(s: string) {
    return decodeURIComponent(s.replace(/\+/g, ' '));
  }

  let matchedQueryPair;
  while (queryString && (matchedQueryPair = queryParameterPairRE.exec(queryString))) {
    urlParams[decode(matchedQueryPair[FIRST_PAIR_ELEMENT])] = decode(matchedQueryPair[SECOND_PAIR_ELEMENT]);
  }

  return urlParams;
}

function customEncodeURIComponent(str: unknown) {
  return encodeURIComponent(String(str)).replace(/%2C/g, ',').replace(/%24/g, '$');
}

/**
 * Takes a URL as input and a params object.
 * Each property in the params is added to the URL as query string parameters
 * @param {string} url URL to add parameters to
 * @param {Object} params parameters to add
 * @returns {string} encoded URL
 */
export function encodeURL(url: string, params: Record<string, unknown>) {
  const equalsSign = '=';
  const firstSeparator = url.indexOf('?') === -1 ? '?' : '&';

  let res = url;
  let k;
  let i = 0;

  for (k in params) {
    if (Object.prototype.hasOwnProperty.call(params, k) && params[k] !== null && params[k] !== undefined) {
      res +=
        (i++ === 0 ? firstSeparator : '&') +
        customEncodeURIComponent(k) +
        equalsSign +
        customEncodeURIComponent(params[k]);
    }
  }

  return res;
}

export function isDataURI(uri: string) {
  return uri.indexOf('data:') === 0;
}
