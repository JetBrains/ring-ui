/* eslint-disable google-camelcase/google-camelcase */
/**
 * @typedef {{
 *   access_token: string?,
 *   state: string?,
 *   token_type: string?,
 *   expires_in: string?,
 *   scope: string?,
 *   error: string?
 * }} AuthResponse
 */

/**
 *
 * @constructor
 */
var AuthResponseParser = function () {
  this._authResponse = this.readAuthResponseFromURL();
};

/**
 * Check if the hash contains an access token.
 * And if it does return auth response. Otherwise return undefined.
 * Always clears a hash part of the URL.
 *
 * @throws {Error} if auth server returned an error
 * @return {?AuthResponse}
 */
AuthResponseParser.prototype.getAuthResponseFromURL = function () {
  return this.validateAuthResponse(this._authResponse);
};

/**
 * Validates given authResponse.
 * If it contains token - returns token, if error - throws error,
 * otherwise - null
 * Always clears a hash part of the URL.
 *
 * @param authResponse {AuthResponse} parsed authResponse
 * @throws {Error} if auth server returned an error
 * @return {?AuthResponse}
 */
AuthResponseParser.prototype.validateAuthResponse = function (authResponse) {

  // Check for errors
  if (authResponse.error) {
    throw new Error(authResponse.error);
  }

  // If there is no token in the hash
  if (!authResponse.access_token) {
    return null;
  }

  return authResponse;
};

/**
 * Reads current accessToken from URL.
 * Doesn't modify URL
 *
 * @return {AuthResponse}
 */
AuthResponseParser.prototype.readAuthResponseFromURL = function () {
  return AuthResponseParser.parseQueryString(this.getHash());
};

/**
 * @return {string} part of the URL after # sign.
 * @private
 */
AuthResponseParser.prototype.getHash = function() {
  // Because of stupid Firefox bug — https://bugzilla.mozilla.org/show_bug.cgi?id=483304
  var location = this.getLocation();
  return location && location.replace(/^[^#]*#?/, '');
};

/**
 * Current page location.
 * @return {string}
 */
AuthResponseParser.prototype.getLocation = function () {
  return window.location.toString();
};

/**
 * Parses the queryString into the object.
 * <code>
 *   Auth.parseQueryString("access_token=2YotnFZFEjr1zCsicMWpAA&state=xyz&token_type=example&expires_in=3600");
 *   // is {access_token: "2YotnFZFEjr1zCsicMWpAA", state: "xyz", token_type: "example", expires_in: "3600"}
 * </code>
 * @param queryString query parameter string to parse
 * @return {AuthResponse} object with query parameters map
 */
AuthResponseParser.parseQueryString = function (queryString) {
  if (queryString == null) {
    return {};
  }

  var queryParameterPairRE = /([^&;=]+)=?([^&;]*)/g;
  var decode = function (s) {
    return decodeURIComponent(s.replace(/\+/g, ' '));
  };

  var urlParams = {};
  var matchedQueryPair;
  while ((matchedQueryPair = queryParameterPairRE.exec(queryString)) != null) {
    urlParams[decode(matchedQueryPair[1])] = decode(matchedQueryPair[2]);
  }
  return urlParams;
};

module.exports = AuthResponseParser;
