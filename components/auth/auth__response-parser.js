/* eslint-disable camelcase */

import {parseQueryString} from '../global/url';

/**
 * @typedef {Object} AuthResponse
 * @property {string?} access_token
 * @property {string?} state
 * @property {string?} token_type
 * @property {string?} expires_in
 * @property {string?} scope
 * @property {string?} error
 */

/**
 *
 * @constructor
 */
export default function AuthResponseParser() {
  this._authResponse = this.readAuthResponseFromURL();
}

/**
 * Check if the hash contains an access token.
 * If it does, return auth response. Otherwise return undefined.
 * Always clears the hash part of the URL.
 *
 * @throws {Error} if the auth server returned an error
 * @return {?AuthResponse}
 */
AuthResponseParser.prototype.getAuthResponseFromURL = function () {
  return this.validateAuthResponse(this._authResponse);
};

/**
 * Validates given authResponse.
 * If it contains a token - returns the token, if an error is found - throws the error,
 * otherwise - null
 * Always clears the hash part of the URL.
 *
 * @param authResponse {AuthResponse} parsed authResponse
 * @throws {Error} if the auth server returned an error
 * @return {?AuthResponse}
 */
AuthResponseParser.prototype.validateAuthResponse = function (authResponse) {

  // Check for errors
  if (authResponse.error) {
    throw new AuthResponseParser.AuthError(authResponse);
  }

  // If there is no token in the hash
  if (!authResponse.access_token) {
    return null;
  }

  return authResponse;
};

/**
 * Reads the current accessToken from the URL.
 * Doesn't modify URL
 *
 * @return {AuthResponse}
 */
AuthResponseParser.prototype.readAuthResponseFromURL = function () {
  return parseQueryString(this.getHash());
};

/**
 * @return {string} part of the URL after # sign.
 * @private
 */
AuthResponseParser.prototype.getHash = function () {
  // Because of stupid Firefox bug — https://bugzilla.mozilla.org/show_bug.cgi?id=483304
  const location = this.getLocation();
  return location && location.replace(/^[^#]*#?/, '');
};

/**
 * Current page location.
 * @return {string}
 */
AuthResponseParser.prototype.getLocation = function () {
  return window.location.toString();
};

AuthResponseParser.AuthError = function AuthError(authResponse) {
  this.message = authResponse.error_description;
  this.code = authResponse.error;
  this.uri = authResponse.error_uri;
  this.stateId = authResponse.state;
};

AuthResponseParser.AuthError.prototype = Object.create(Error.prototype);
AuthResponseParser.AuthError.prototype.name = 'AuthError';
AuthResponseParser.AuthError.prototype.constructor = AuthResponseParser.AuthError;
