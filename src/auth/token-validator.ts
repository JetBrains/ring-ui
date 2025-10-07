import {CODE} from '../http/http';

import type AuthStorage from './storage';
import type {StoredToken} from './storage';

export interface TokenValidatorConfig {
  scope: string[];
  optionalScopes?: readonly string[] | null | undefined;
}

interface ParsedResponse {
  error?: string;
}

export class TokenValidationError extends Error {
  cause: Error | undefined;
  authRedirect: true;
  constructor(message: string, cause?: Error) {
    super(message);
    this.cause = cause;
    this.authRedirect = true;
  }
}

export default class TokenValidator {
  private _getUser: (accessToken: string) => Promise<void>;
  private _config: TokenValidatorConfig;
  private _storage: AuthStorage;
  constructor(config: TokenValidatorConfig, getUser: (accessToken: string) => Promise<void>, storage: AuthStorage) {
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
  static TokenValidationError = TokenValidationError;

  /**
   * Check token validity against all conditions.
   * @mockReturnValue {Promise.<string>}
   */
  validateTokenLocally() {
    return this._getValidatedToken([
      // eslint-disable-next-line no-underscore-dangle
      TokenValidator._validateExistence,
      // eslint-disable-next-line no-underscore-dangle
      TokenValidator._validateExpiration,
      this._validateScopes.bind(this),
    ]);
  }

  /**
   * Check token validity against all conditions.
   * @mockReturnValue {Promise.<string>}
   */
  validateToken() {
    return this._getValidatedToken([
      // eslint-disable-next-line no-underscore-dangle
      TokenValidator._validateExistence,
      // eslint-disable-next-line no-underscore-dangle
      TokenValidator._validateExpiration,
      this._validateScopes.bind(this),
      this._validateAgainstUser.bind(this),
    ]);
  }

  /**
   * Check if there is a token
   * @param {StoredToken} storedToken
   * @return {Promise.<StoredToken>}
   * @private
   */
  private static _validateExistence(storedToken: StoredToken | null) {
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
  private static _validateExpiration({expires, lifeTime}: StoredToken) {
    const REFRESH_BEFORE_RATIO = 6;
    const refreshBefore = lifeTime ? Math.ceil(lifeTime / REFRESH_BEFORE_RATIO) : TokenValidator.DEFAULT_REFRESH_BEFORE;

    // eslint-disable-next-line no-underscore-dangle
    if (expires && expires < TokenValidator._epoch() + refreshBefore) {
      throw new TokenValidator.TokenValidationError('Token expired');
    }
  }

  /**
   * Check scopes
   * @param {StoredToken} storedToken
   * @return {Promise.<StoredToken>}
   * @private
   */
  private _validateScopes(storedToken: StoredToken) {
    const {scope, optionalScopes} = this._config;
    const requiredScopes = optionalScopes ? scope.filter(scopeId => !optionalScopes.includes(scopeId)) : scope;

    const hasAllScopes = requiredScopes.every(scopeId => storedToken.scopes?.includes(scopeId));
    if (!hasAllScopes) {
      throw new TokenValidator.TokenValidationError("Token doesn't match required scopes");
    }
  }

  /**
   * Check by error code if token should be refreshed
   * @param {string} error
   * @return {boolean}
   */
  static shouldRefreshToken(error: string | undefined) {
    return error === 'invalid_grant' || error === 'invalid_request' || error === 'invalid_token';
  }

  /**
   * Check scopes
   * @param {StoredToken} storedToken
   * @return {Promise.<StoredToken>}
   * @private
   */
  async _validateAgainstUser(storedToken: StoredToken) {
    try {
      return await this._getUser(storedToken.accessToken);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (errorResponse: any) {
      let response: ParsedResponse = {};
      try {
        response = await errorResponse.response.json();
      } catch (e) {
        // Skip JSON parsing errors
      }

      if (errorResponse.status === CODE.UNAUTHORIZED || TokenValidator.shouldRefreshToken(response.error)) {
        // Token expired
        throw new TokenValidator.TokenValidationError(
          response.error || errorResponse.message,
          errorResponse.data?.error ? new Error(errorResponse.data?.error) : undefined,
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
  async _getValidatedToken(validators: ((token: StoredToken) => void | Promise<void>)[]) {
    const storedToken = await this._storage.getToken();
    if (storedToken === null || storedToken === undefined) {
      throw new TokenValidator.TokenValidationError('Token not found');
    }

    for (let i = 0; i < validators.length; i++) {
      await validators[i](storedToken);
    }

    return storedToken.accessToken;
  }
}
