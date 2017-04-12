import 'core-js/modules/es7.array.includes';
import 'whatwg-fetch';
import ExtendableError from 'es6-error';

import {encodeURL, fixUrl, getAbsoluteBaseURL} from '../global/url';
import Listeners from '../global/listeners';

import AuthStorage from './auth__storage';
import AuthResponseParser from './auth__response-parser';
import AuthRequestBuilder from './auth__request-builder';

function noop() {}

/**
 * @name Auth
 * @category Components
 * @tags 3.0
 * @description Authenticates a user in [Hub](https://www.jetbrains.com/hub/).
 *
 * @prop {object} config
 * @prop {string} config.serverUri
 * @prop {string} config.redirect_uri
 * @prop {string} config.client_id
 * @prop {boolean=false} config.redirect — use redirects instead of loading the token in the background.
 * @prop {string[]} config.scope
 * @prop {string[]} config.optionalScopes
 * @prop {boolean} config.cleanHash - whether or not location.hash will be cleaned after authorization is completed.
 * Should be set to false in angular > 1.2.26 apps to prevent infinite redirect in Firefox
 * @prop {User?} user
 * @prop {string[]} config.userFields List of user data fields to be returned by auth.requestUser (default list is used in Header.HeaderHelper)
 * @prop {string[]} config.fetchCredentials
 *
 * @param {{
 *   serverUri: string,
 *   redirect_uri: string?,
 *   request_credentials: string?,
 *   client_id: string?,
 *   scope: string[]?,
 *   optionalScopes: string[]?,
 *   cleanHash: boolean?,
 *   fetchCredentials: string?,
 *   userFields: string[]?
 * }} config
 *
 * @example-file ./auth.examples.html
 */
export default class Auth {
  /* eslint-disable camelcase */
  constructor(config) {
    if (!config) {
      throw new Error('Config is required');
    }

    if (config.serverUri == null) {
      throw new Error('\"serverUri\" property is required');
    }

    config.userFields = config.userFields || [];

    this.config = Object.assign({}, Auth.DEFAULT_CONFIG, config);

    const {client_id, redirect, redirect_uri, request_credentials, scope} = this.config;
    const serverUriLength = this.config.serverUri.length;

    if (serverUriLength > 0 && this.config.serverUri.charAt(serverUriLength - 1) !== '/') {
      this.config.serverUri += '/';
    }

    this.config.userParams = {
      fields: [...new Set(Auth.DEFAULT_CONFIG.userFields.concat(config.userFields))].join()
    };

    if (!scope.includes(Auth.DEFAULT_CONFIG.client_id)) {
      scope.push(Auth.DEFAULT_CONFIG.client_id);
    }

    this._storage = new AuthStorage({
      stateKeyPrefix: `${client_id}-states-`,
      tokenKey: `${client_id}-token`
    });

    this._responseParser = new AuthResponseParser();

    this._requestBuilder = new AuthRequestBuilder({
      authorization: this.config.serverUri + Auth.API_PATH + Auth.API_AUTH_PATH,
      client_id,
      redirect,
      redirect_uri,
      request_credentials,
      scopes: scope
    }, this._storage);

    this.listeners = new Listeners();

    if (this.config.onLogout) {
      this.addListener('logout', this.config.onLogout);
    }

    if (this.config.avoidPageReload === false) {
      this.addListener('userChange', this._reloadCurrentPage.bind(this));
    }


    this._initDeferred = {};
    this._initDeferred.promise = new Promise((resolve, reject) => {
      this._initDeferred.resolve = resolve;
      this._initDeferred.reject = reject;
    });
  }

  /**
   * @const {{client_id: string, redirect_uri: string, scope: string[], default_expires_in: number}}
   */
  static DEFAULT_CONFIG = {
    avoidPageReload: false,
    client_id: '0-0-0-0-0',
    redirect_uri: getAbsoluteBaseURL(),
    redirect: false,
    request_credentials: 'default',
    scope: [],
    fetchCredentials: null,
    userFields: ['guest', 'id', 'name', 'profile/avatar/url'],
    cleanHash: true,
    onLogout: noop,
    default_expires_in: 40 * 60 // 40 mins
  };

  /**
   * @const {string}
   */
  static API_PATH = 'api/rest/';

  /**
   * @const {string}
   */
  static API_AUTH_PATH = 'oauth2/auth';

  /**
   * @const {string}
   */
  static API_PROFILE_PATH = 'users/me';

  /**
   * @const {number}
   */
  static REFRESH_BEFORE = 20 * 60; // 20 min in s

  /**
   * @const {number} non-interactive auth timeout
   */
  static BACKGROUND_TIMEOUT = 20 * 1000; // 20 sec in ms

  static HTTP_CODE = {
    OK: 200,
    REDIRECTION: 300,
    UNAUTHORIZED: 401
  }

  addListener(event, handler) {
    this.listeners.add(event, handler);
  }

  removeListener(event, handler) {
    this.listeners.remove(event, handler);
  }

  /**
   * @return {Promise.<string>} absolute URL promise that is resolved to a URL
   * that should be restored after returning back from auth server.
   */
  async init() {
    // TODO Show overlay instead of logout here
    this._storage.onTokenChange(token => {
      if (token === null) {
        this.logout();
      }
    });

    let state;

    try {
      // Look for token or error in hash
      state = await this._checkForAuthResponse();
    } catch (error) {
      return this.handleInitError(error);
    }

    // Return endless promise in the background to avoid service start
    if (state && state.nonRedirect) {
      return new Promise(noop);
    }

    try {
      // Check if there is a valid token
      await this.validateToken();

      // Access token appears to be valid.
      // We may resolve restoreLocation URL now
      this._initDeferred.resolve(state && state.restoreLocation);
      return state && state.restoreLocation;
    } catch (error) {
      return this.handleInitValidationError(error);
    }
  }

  async sendRedirect(error) {
    const authRequest = await this._requestBuilder.prepareAuthRequest();
    this._redirectCurrentPage(authRequest.url);

    throw error;
  }

  async handleInitError(error) {
    if (error.stateId) {
      try {
        const state = await this._storage.getState(error.stateId);

        if (state && state.nonRedirect) {
          state.error = error;
          this._storage.saveState(error.stateId, state);

          // Return endless promise in the background to avoid service start
          return new Promise(noop);
        }
      } catch (e) {
        // Throw the orginal error instead below
      }
    }

    throw error;
  }

  async handleInitValidationError(error) {
    // Redirect flow
    if (error.authRedirect && this.config.redirect) {
      return this.sendRedirect(error);
    }

    // Background flow
    if (error.authRedirect && !this.config.redirect) {
      try {
        await this._loadTokenInBackground();
        await this.validateToken();
        this._initDeferred.resolve();
        return undefined;
      } catch (validationError) {
        // Fallback to redirect flow
        return this.sendRedirect(validationError);
      }
    }

    this._initDeferred.reject(error);
    throw error;
  }

  /**
   * Check token validity against all conditions.
   * @returns {Promise.<string>}
   */
  validateToken() {
    return this._getValidatedToken([
      Auth._validateExistence,
      Auth._validateExpiration,
      this._validateScopes.bind(this),
      this._validateAgainstUser.bind(this)
    ]);
  }

  /**
   * Get token from local storage or request it if necessary.
   * Can redirect to login page.
   * @return {Promise.<string>}
   */
  async requestToken() {
    try {
      await this._initDeferred.promise;

      return await this._getValidatedToken([
        Auth._validateExistence,
        Auth._validateExpiration,
        this._validateScopes.bind(this)
      ]);
    } catch (e) {
      return this.forceTokenUpdate();
    }
  }

  /**
   * Get new token in the background or redirect to the login page.
   * @return {Promise.<string>}
   */
  async forceTokenUpdate() {
    try {
      const accessToken = await this._loadTokenInBackground();
      const user = await this.getApi(Auth.API_PROFILE_PATH, accessToken, this.config.userParams);

      if (user && this.user && this.user.id !== user.id) {
        // Reload page if user has been changed after background refresh
        this.listeners.trigger('userChange', user);
      }

      return accessToken;
    } catch (e) {
      const authRequest = await this._requestBuilder.prepareAuthRequest();

      this._redirectCurrentPage(authRequest.url);
      throw new Auth.TokenValidationError(e.message);
    }
  }

  static HTTPError = class HTTPError extends ExtendableError {
    constructor(response) {
      super(`${response.status} ${response.statusText}`);
      this.response = response;
      this.status = response.status;
    }
  }

  /**
   * Makes a GET request to the given URL with the given access token.
   *
   * @param {string} absoluteUrl an absolute URI to request with the given token
   * @param {string} accessToken access token to use in the request
   * @param {object?} params query parameters
   * @return {Promise} promise from fetch request
   */
  async getSecure(absoluteUrl, accessToken, params) {
    const url = encodeURL(absoluteUrl, params);
    const failedResponse = {
      status: 0,
      statusText: 'Network request failed'
    };

    const init = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    };

    // Supports Edge
    // Native fetch in Edge doesn't accept anything but non-empty strings,
    // otherwise it fails with TypeMismatchError
    if (this.config.fetchCredentials != null) {
      init.credentials = this.config.fetchCredentials;
    }

    // Empty response — strange case found in the wild
    // @see https://youtrack.jetbrains.com/issue/JT-31942
    const response = await this._fetch(url, init) || failedResponse;

    // Simulate $.ajax behavior
    // @see https://github.com/github/fetch#success-and-error-handlers
    if (response && response.status >= Auth.HTTP_CODE.OK && response.status < Auth.HTTP_CODE.REDIRECTION) {
      return response.json();
    } else {
      throw new Auth.HTTPError(response);
    }

  }

  _fetch(url, params) {
    return fetch(url, params);
  }

  /**
   * Makes a GET request to the relative API URL. For example, to fetch all services call:
   *  getApi('services', token, params)
   *
   * @param {string} relativeURI a URI relative to config.serverUri REST endpoint to make the GET request to
   * @param {string} accessToken access token to use in the request
   * @param {object?} params query parameters
   * @return {Promise} promise from fetch request
   */
  getApi(relativeURI, accessToken, params) {
    return this.getSecure(this.config.serverUri + Auth.API_PATH + relativeURI, accessToken, params);
  }

  /**
   * @return {Promise.<object>}
   */
  getUser(accessToken) {
    return this.getApi(Auth.API_PROFILE_PATH, accessToken, this.config.userParams);
  }

  /**
   * @return {Promise.<object>}
   */
  async requestUser() {
    if (this.user) {
      return this.user;
    }

    const accessToken = await this.requestToken();

    // If when was fetched during token request
    if (this.user) {
      return this.user;
    }

    const user = await this.getUser(accessToken);
    this.user = user;

    return user;
  }

  /**
   * Wipe accessToken and redirect to auth page with required authorization
   */
  async logout(extraParams) {
    const requestParams = {
      request_credentials: 'required',
      ...extraParams
    };

    await this.listeners.trigger('logout');
    await this._storage.wipeToken();

    const authRequest = await this._requestBuilder.prepareAuthRequest(requestParams);
    this._redirectCurrentPage(authRequest.url);
  }


  /**
   * Wipe accessToken and redirect to auth page to obtain authorization data
   * if user is logged in or log her in otherwise
   */
  async login() {
    try {
      const accessToken = await this._loadTokenInBackground();
      const user = await this.getUser(accessToken);

      if (user.guest) {
        return this.logout();
      } else {
        return this.listeners.trigger('userChange', user);
      }
    } catch (e) {
      return this.logout();
    }
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
   * Check if the hash contains an access token.
   * If it does, extract the state, compare with
   * config, and store the auth response for later use.
   *
   * @return {Promise} promise that is resolved to restoreLocation URL, or rejected
   * @private
   */
  async _checkForAuthResponse() {
    // getAuthResponseURL may throw an exception
    const authResponse = this._responseParser.getAuthResponseFromURL();
    const {scope: defaultScope, default_expires_in, cleanHash} = this.config;

    if (authResponse && cleanHash) {
      this.setHash('');
    }

    if (!authResponse) {
      return undefined;
    }

    const {state: stateId, scope, expires_in, access_token} = authResponse;
    const newState = await (stateId && this._storage.getState(stateId)) || {};

    /**
     * @type {string[]}
     */
    const scopes = scope ? scope.split(' ') : newState.scopes || defaultScope || [];

    /**
     * @type {number}
     */
    const expiresIn = expires_in ? parseInt(expires_in, 10) : default_expires_in;
    const expires = Auth._epoch() + expiresIn;

    await this._storage.saveToken({access_token, scopes, expires});

    return newState;
  }

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
   * Check if there is a token
   * @param {StoredToken} storedToken
   * @return {Promise.<StoredToken>}
   * @private
   */
  static async _validateExistence(storedToken) {
    if (!storedToken || !storedToken.access_token) {
      throw new Auth.TokenValidationError('Token not found');
    }
  }

  /**
   * Check expiration
   * @param {StoredToken} storedToken
   * @return {Promise.<StoredToken>}
   * @private
   */
  static async _validateExpiration(storedToken) {
    if (storedToken.expires && storedToken.expires < (Auth._epoch() + Auth.REFRESH_BEFORE)) {
      throw new Auth.TokenValidationError('Token expired');
    }
  }

  /**
   * Check scopes
   * @param {StoredToken} storedToken
   * @return {Promise.<StoredToken>}
   * @private
   */
  async _validateScopes(storedToken) {
    const {scope, optionalScopes} = this.config;
    const requiredScopes = optionalScopes ? scope.filter(scopeId => !optionalScopes.includes(scopeId)) : scope;

    const hasAllScopes = requiredScopes.every(scopeId => storedToken.scopes.includes(scopeId));
    if (!hasAllScopes) {
      throw new Auth.TokenValidationError('Token doesn\'t match required scopes');
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
      const user = await this.getApi(Auth.API_PROFILE_PATH, storedToken.access_token, this.config.userParams);
      this.user = user;
    } catch (errorResponse) {

      let response = {};
      try {
        response = await errorResponse.response.json();
      } catch (e) {
        // Skip JSON parsing errors
      }

      if (errorResponse.status === Auth.HTTP_CODE.UNAUTHORIZED || Auth.shouldRefreshToken(response.error)) {
        // Token expired
        throw new Auth.TokenValidationError(response.error || errorResponse.message);
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

    return storedToken.access_token;
  }

  /**
   * Redirects current page to the given URL
   * @param {string} url
   * @private
   */
  _redirectCurrentPage(url) {
    window.location = fixUrl(url);
  }

  /**
   * Reloads current page
   */
  _reloadCurrentPage() {
    this._redirectCurrentPage(window.location.href);
  }

  /**
   * Redirects the given iframe to the given URL
   * @param {HTMLIFrameElement} iframe
   * @param {string} url
   * @private
   */
  _redirectFrame(iframe, url) {
    iframe.src = `${url}&rnd=${Math.random()}`;
  }

  /**
   * Creates a hidden iframe
   * @return {HTMLIFrameElement}
   * @private
   */
  _createHiddenFrame() {
    const iframe = document.createElement('iframe');

    iframe.style.border = iframe.style.width = iframe.style.height = '0px';
    iframe.style.visibility = 'hidden';
    iframe.style.position = 'fixed';
    iframe.style.left = '-10000px';
    window.document.body.appendChild(iframe);

    return iframe;
  }

  /**
   * Refreshes the access token in an iframe.
   *
   * @return {Promise.<string>} promise that is resolved to access the token when it is loaded in a background iframe. The
   * promise is rejected if no token was received after {@link Auth.BACKGROUND_TIMEOUT} ms.
   */
  _loadTokenInBackground() {
    if (this._backgroundPromise) {
      return this._backgroundPromise;
    }

    const resetPromise = () => {
      this._backgroundPromise = null;
    };

    this._backgroundPromise = new Promise(async (resolve, reject) => {
      const iframe = this._createHiddenFrame();

      const authRequest = await this._requestBuilder.
        prepareAuthRequest({request_credentials: 'silent'}, {nonRedirect: true});
      let cleanRun;

      function cleanUp() {
        if (cleanRun) {
          return;
        }
        cleanRun = true;
        /* eslint-disable no-use-before-define */
        clearTimeout(timeout);
        removeStateListener();
        removeTokenListener();
        /* eslint-enable no-use-before-define */
        window.document.body.removeChild(iframe);
      }

      const timeout = setTimeout(() => {
        reject(new Error('Auth Timeout'));
        cleanUp();
      }, Auth.BACKGROUND_TIMEOUT);

      const removeTokenListener = this._storage.onTokenChange(token => {
        if (token !== null) {
          cleanUp();
          resolve(token.access_token);
        }
      });

      const removeStateListener = this._storage.onStateChange(authRequest.stateId, state => {
        if (state && state.error) {
          cleanUp();
          reject(new AuthResponseParser.AuthError(state));
        }
      });

      this._redirectFrame(iframe, authRequest.url);
    });

    (async () => {
      try {
        await this._backgroundPromise;
      } catch (e) {
        return;
      } finally {
        resetPromise();
      }
    })();

    return this._backgroundPromise;
  }

  /**
   * Sets the location hash
   * @param {string} hash
   */
  setHash(hash) {
    if (history.replaceState) {
      // NB! History.replaceState is used here, because Firefox saves
      // a record in history.
      // NB! URL to redirect is formed manually because baseURI could be messed up,
      // in which case it's not obvious where redirect will lead.
      const cleanedUrl = [
        window.location.pathname,
        window.location.search
      ].join('');

      history.replaceState(undefined, undefined, `${cleanedUrl}#${hash}`);
    } else {
      window.location.hash = hash;
    }
  }
}
