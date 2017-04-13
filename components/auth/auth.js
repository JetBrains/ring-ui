import 'core-js/modules/es7.array.includes';
import 'whatwg-fetch';

import {fixUrl, getAbsoluteBaseURL} from '../global/url';
import Listeners from '../global/listeners';

import HTTP from '../http/http';

import AuthStorage from './storage';
import AuthResponseParser from './response-parser';
import AuthRequestBuilder from './request-builder';
import BackgroundTokenGetter from './background-token-getter';
import TokenValidator from './token-validator';

function noop() {}

/**
 * @name Auth
 * @category Components
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
      query: {
        fields: [...new Set(Auth.DEFAULT_CONFIG.userFields.concat(config.userFields))].join()
      }
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

    this._backgroundTokenGetter = new BackgroundTokenGetter(this._requestBuilder, this._storage);

    const API_BASE = this.config.serverUri + Auth.API_PATH;
    const fetchConfig = config.fetchCredentials
      ? {credentials: config.fetchCredentials}
      : undefined;
    this.http = new HTTP(this, API_BASE, fetchConfig);

    const getUser = async token => {
      const user = this.getUser(token);
      this.user = user;
      return user;
    };

    this._tokenValidator = new TokenValidator(this.config, getUser, this._storage);

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
      await this._tokenValidator.validateToken();

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
        await this._backgroundTokenGetter.get();
        await this._tokenValidator.validateToken();
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
   * Get token from local storage or request it if necessary.
   * Can redirect to login page.
   * @return {Promise.<string>}
   */
  async requestToken() {
    try {
      await this._initDeferred.promise;

      return await this._tokenValidator.validateTokenLocally();
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
      const accessToken = await this._backgroundTokenGetter.get();
      const user = await this.getUser(accessToken);

      if (user && this.user && this.user.id !== user.id) {
        // Reload page if user has been changed after background refresh
        this.listeners.trigger('userChange', user);
      }

      return accessToken;
    } catch (e) {
      const authRequest = await this._requestBuilder.prepareAuthRequest();

      this._redirectCurrentPage(authRequest.url);
      throw new TokenValidator.TokenValidationError(e.message);
    }
  }

  getAPIPath() {
    return this.config.serverUri + Auth.API_PATH;
  }

  /**
   * @return {Promise.<object>}
   */
  getUser(accessToken) {
    return this.http.authorizedFetch(Auth.API_PROFILE_PATH, accessToken, this.config.userParams);
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
      const accessToken = await this._backgroundTokenGetter.get();
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
    const expires = TokenValidator._epoch() + expiresIn;

    await this._storage.saveToken({access_token, scopes, expires});

    return newState;
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
