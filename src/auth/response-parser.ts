import {parseQueryString} from '../global/url';
import {type AuthResponse} from './auth.interface';

export class AuthError extends Error {
  code: string | Error | AuthError | undefined;
  uri: string | undefined;
  stateId: string | undefined;
  // Supports weird IE 11 failing test issue
  constructor(authResponse: AuthResponse = {}) {
    super(authResponse.errorDescription);
    this.code = authResponse.error;
    this.uri = authResponse.errorUri;
    this.stateId = authResponse.state;
  }
}

/**
 * @typedef {Object} AuthResponse
 * @property {?string} accessToken
 * @property {?string} state
 * @property {?string} token_type
 * @property {?string} expiresIn
 * @property {?string} scope
 * @property {?string} error
 */

export default class AuthResponseParser {
  readonly _authResponse: AuthResponse;
  constructor() {
    this._authResponse = this.readAuthResponseFromURL();
  }

  static AuthError = AuthError;

  static convertKey(key: string) {
    return key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
  }

  /**
   * Check if the hash contains an access token.
   * If it does, return auth response. Otherwise return undefined.
   * Always clears the hash part of the URL.
   *
   * @throws {Error} if the auth server returned an error
   * @return {?AuthResponse}
   */
  getAuthResponseFromURL() {
    return this.validateAuthResponse(this._authResponse);
  }

  /**
   * Validates given authResponse.
   * If it contains a token - mockReturnValue the token, if an error is found - throws the error,
   * otherwise - null
   * Always clears the hash part of the URL.
   *
   * @param authResponse {AuthResponse} parsed authResponse
   * @throws {Error} if the auth server returned an error
   * @return {?AuthResponse}
   */
  validateAuthResponse(authResponse: AuthResponse): AuthResponse | null {
    // Check for errors
    if (authResponse.error) {
      throw new AuthResponseParser.AuthError(authResponse);
    }

    // If there is no token in the hash
    if (!authResponse.accessToken) {
      return null;
    }

    return {...authResponse, accessToken: authResponse.accessToken};
  }

  /**
   * Reads the current accessToken from the URL.
   * Doesn't modify URL
   *
   * @return {AuthResponse}
   */
  readAuthResponseFromURL(): AuthResponse {
    const authResponse: Record<string, string> = {};
    const rawAuthResponse = parseQueryString(this.getHash());
    Object.keys(rawAuthResponse).forEach(key => {
      if (key.indexOf('_') !== -1) {
        authResponse[AuthResponseParser.convertKey(key)] = rawAuthResponse[key];
        return;
      }

      authResponse[key] = rawAuthResponse[key];
    });

    return authResponse;
  }

  /**
   * @return {string} part of the URL after # sign.
   * @private
   */
  getHash() {
    // Because of stupid Firefox bug — https://bugzilla.mozilla.org/show_bug.cgi?id=483304
    const location = this.getLocation();
    return location && location.replace(/^[^#]*#?/, '');
  }

  /**
   * Current page location.
   * @return {string}
   */
  getLocation(): string | null {
    return window.location.toString();
  }
}
