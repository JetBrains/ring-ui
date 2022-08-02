import ExtendableError from 'es6-error';

import {CODE} from '../http/http';

export default class TokenValidator {
  constructor(config, getUser, storage) {
    this._getUser = getUser;
    this._config = config;
    this._storage = storage;
  }

  /**
   * Returns epoch - seconds since 1970.
   * Used for calculation of expire times.
   * @return {number} epoch, seconds since 1970
   * @private
   */
  static _epoch() {
    const milliseconds = 1000.0;
    return Math.round(Date.now() / milliseconds);
  }

  /**
   * @const {number}
   */
  // eslint-disable-next-line no-magic-numbers
  static DEFAULT_REFRESH_BEFORE = 10 * 60; // 20 min in s

  /**
   * Error class for auth token validation
   *
   * @param {string} message Error message
   * @param {Error=} cause Error that caused this error
   */
  static TokenValidationError = class TokenValidationError extends ExtendableError {
    constructor(message, cause) {
      super(message);
      this.cause = cause;
      this.authRedirect = true;
    }
  };

  /**
   * Check token validity against all conditions.
   * @returns {Promise.<string>}
   */
  validateTokenLocally() {
    return this._getValidatedToken([
      TokenValidator._validateExistence,
      TokenValidator._validateExpiration,
      this._validateScopes.bind(this)
    ]);
  }

  /**
   * Check token validity against all conditions.
   * @returns {Promise.<string>}
   */
  validateToken() {
    return this._getValidatedToken([
      TokenValidator._validateExistence,
      TokenValidator._validateExpiration,
      this._validateScopes.bind(this),
      this._validateAgainstUser.bind(this)
    ]);
  }


  /**
   * Check if there is a token
   * @param {StoredToken} storedToken
   * @return {Promise.<StoredToken>}
   * @private
   */
  static _validateExistence(storedToken) {
    if (!storedToken || !storedToken.accessToken) {
      throw new TokenValidator.TokenValidationError('Token not found');
    }
  }

  /**
   * Check expiration
   * @param {StoredToken} storedToken
   * @return {Promise.<StoredToken>}
   * @private
   */
  static _validateExpiration({expires, lifeTime}) {
    const REFRESH_BEFORE_RATIO = 6;
    const refreshBefore = lifeTime
      ? Math.ceil(lifeTime / REFRESH_BEFORE_RATIO)
      : TokenValidator.DEFAULT_REFRESH_BEFORE;

    if (expires && expires < (TokenValidator._epoch() + refreshBefore)) {
      throw new TokenValidator.TokenValidationError('Token expired');
    }
  }

  /**
   * Check scopes
   * @param {StoredToken} storedToken
   * @return {Promise.<StoredToken>}
   * @private
   */
  _validateScopes(storedToken) {
    const {scope, optionalScopes} = this._config;
    const requiredScopes = optionalScopes
      ? scope.filter(scopeId => !optionalScopes.includes(scopeId))
      : scope;

    const hasAllScopes = requiredScopes.every(scopeId => storedToken.scopes.includes(scopeId));
    if (!hasAllScopes) {
      throw new TokenValidator.TokenValidationError('Token doesn\'t match required scopes');
    }
  }

  /**
   * Check by error code if token should be refreshed
   * @param {string} error
   * @return {boolean}
   */
  static shouldRefreshToken(error) {
    return error === 'invalid_grant' ||
      error === 'invalid_request' ||
      error === 'invalid_token';
  }

  /**
   * Check scopes
   * @param {StoredToken} storedToken
   * @return {Promise.<StoredToken>}
   * @private
   */
  async _validateAgainstUser(storedToken) {
    try {
      return await this._getUser(storedToken.accessToken);
    } catch (errorResponse) {

      let response = {};
      try {
        response = await errorResponse.response.json();
      } catch (e) {
        // Skip JSON parsing errors
      }

      if (
        errorResponse.status === CODE.UNAUTHORIZED ||
        TokenValidator.shouldRefreshToken(response.error)
      ) {
        // Token expired
        throw new TokenValidator.TokenValidationError(
          response.error || errorResponse.message,
          errorResponse.data?.error
        );
      }

      // Request unexpectedly failed
      throw errorResponse;
    }
  }

  /**
   * Token Validator function
   * @typedef {(function(StoredToken): Promise<StoredToken>)} TokenValidator
   */

  /**
   * Gets stored token and applies provided validators
   * @param {TokenValidator[]} validators An array of validation
   * functions to check the stored token against.
   * @return {Promise.<string>} promise that is resolved to access token if the stored token is valid. If it is
   * invalid then the promise is rejected. If invalid token should be re-requested then rejection object will
   * have {authRedirect: true}.
   * @private
   */
  async _getValidatedToken(validators) {
    const storedToken = await this._storage.getToken();

    for (let i = 0; i < validators.length; i++) {
      await validators[i](storedToken);
    }

    return storedToken.accessToken;
  }
}
