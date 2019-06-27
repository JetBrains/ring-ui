import {fixUrl, getAbsoluteBaseURL} from '../global/url';
import Listeners from '../global/listeners';
import HTTP from '../http/http';
import promiseWithTimeout from '../global/promise-with-timeout';

import AuthStorage from './storage';
import AuthResponseParser from './response-parser';
import AuthRequestBuilder from './request-builder';
import BackgroundFlow from './background-flow';
import TokenValidator from './token-validator';

/* eslint-disable no-magic-numbers */
export const DEFAULT_EXPIRES_TIMEOUT = 40 * 60;
export const DEFAULT_BACKGROUND_TIMEOUT = 10 * 1000;
const DEFAULT_BACKEND_CHECK_TIMEOUT = 10 * 1000;
const BACKGROUND_REDIRECT_TIMEOUT = 20 * 1000;
/* eslint-enable no-magic-numbers */

export const USER_CHANGED_EVENT = 'userChange';
export const DOMAIN_USER_CHANGED_EVENT = 'domainUser';
export const LOGOUT_EVENT = 'logout';
export const LOGOUT_POSTPONED_EVENT = 'logoutPostponed';
export const USER_CHANGE_POSTPONED_EVENT = 'changePostponed';

function noop() {}

const DEFAULT_CONFIG = {
  reloadOnUserChange: true,
  embeddedLogin: false,
  EmbeddedLoginFlow: null,
  clientId: '0-0-0-0-0',
  redirectUri: getAbsoluteBaseURL(),
  redirect: false,
  requestCredentials: 'default',
  backgroundRefreshTimeout: null,
  scope: [],
  userFields: ['guest', 'id', 'name', 'login', 'profile/avatar/url'],
  cleanHash: true,
  onLogout: noop,
  onPostponeChangedUser: () => {},
  onPostponeLogout: () => {},
  enableBackendStatusCheck: true,
  backendCheckTimeout: DEFAULT_BACKEND_CHECK_TIMEOUT,
  checkBackendIsUp: () => Promise.resolve(null),
  onBackendDown: () => {},

  defaultExpiresIn: DEFAULT_EXPIRES_TIMEOUT,
  translations: {
    login: 'Log in',
    loginTo: 'Log in to %serviceName%',
    cancel: 'Cancel',
    postpone: 'Postpone',
    youHaveLoggedInAs: 'You have logged in as another user: %userName%',
    applyChange: 'Apply change',
    backendIsNotAvailable: 'Backend is not available',
    checkAgain: 'Check again',
    nothingHappensLink: 'Click here if nothing happens'
  }
};

export default class Auth {
  static DEFAULT_CONFIG = DEFAULT_CONFIG;
  static API_PATH = 'api/rest/';
  static API_AUTH_PATH = 'oauth2/auth';
  static API_PROFILE_PATH = 'users/me';
  static CLOSE_BACKEND_DOWN_MESSAGE = 'backend-check-succeeded';
  static CLOSE_WINDOW_MESSAGE = 'close-login-window';
  static shouldRefreshToken = TokenValidator.shouldRefreshToken;
  static storageIsUnavailable = !navigator.cookieEnabled;

  config = {};
  listeners = new Listeners();
  http = null;
  _service = {};
  _storage = null;
  _responseParser = new AuthResponseParser();
  _requestBuilder = null;
  _backgroundFlow = null;
  _embeddedFlow = null;
  _tokenValidator = null;
  _postponed = false;
  _backendCheckPromise = null;
  _authDialogService = undefined;

  constructor(config) {
    if (!config) {
      throw new Error('Config is required');
    }

    if (config.serverUri == null) {
      throw new Error('\"serverUri\" property is required');
    }

    const unsupportedParams = ['redirect_uri', 'request_credentials', 'client_id'].filter(param => config.hasOwnProperty(param));
    if (unsupportedParams.length !== 0) {
      throw new Error(`The following parameters are no longer supported: ${unsupportedParams.join(', ')}. Please change them from snake_case to camelCase.`);
    }

    config.userFields = config.userFields || [];

    this.config = {...Auth.DEFAULT_CONFIG, ...config};

    const {clientId, redirect, redirectUri, requestCredentials, scope} = this.config;
    const serverUriLength = this.config.serverUri.length;

    if (serverUriLength > 0 && this.config.serverUri.charAt(serverUriLength - 1) !== '/') {
      this.config.serverUri += '/';
    }

    this.config.userParams = {
      query: {
        fields: [...new Set(Auth.DEFAULT_CONFIG.userFields.concat(config.userFields))].join()
      }
    };

    if (!scope.includes(Auth.DEFAULT_CONFIG.clientId)) {
      scope.push(Auth.DEFAULT_CONFIG.clientId);
    }

    this._storage = new AuthStorage({
      messagePrefix: `${clientId}-message-`,
      stateKeyPrefix: `${clientId}-states-`,
      tokenKey: `${clientId}-token`
    });

    this._domainStorage = new AuthStorage({messagePrefix: 'domain-message-'});

    this._requestBuilder = new AuthRequestBuilder({
      authorization: this.config.serverUri + Auth.API_PATH + Auth.API_AUTH_PATH,
      clientId,
      redirect,
      redirectUri,
      requestCredentials,
      scopes: scope
    }, this._storage);

    let {backgroundRefreshTimeout} = this.config;
    if (!backgroundRefreshTimeout) {
      backgroundRefreshTimeout = this.config.embeddedLogin
        ? DEFAULT_BACKGROUND_TIMEOUT
        : BACKGROUND_REDIRECT_TIMEOUT;
    }

    this._backgroundFlow = new BackgroundFlow(
      this._requestBuilder, this._storage, backgroundRefreshTimeout
    );
    if (this.config.EmbeddedLoginFlow) {
      this._embeddedFlow = new this.config.EmbeddedLoginFlow(
        this._requestBuilder,
        this._storage,
        this.config.translations
      );
    }

    const API_BASE = this.config.serverUri + Auth.API_PATH;
    const fetchConfig = config.fetchCredentials
      ? {credentials: config.fetchCredentials}
      : undefined;
    this.http = new HTTP(this, API_BASE, fetchConfig);

    const getUser = async token => {
      const user = await this.getUser(token);
      this.user = user;
      return user;
    };

    this._tokenValidator = new TokenValidator(this.config, getUser, this._storage);

    if (this.config.onLogout) {
      this.addListener(LOGOUT_EVENT, this.config.onLogout);
    }

    if (this.config.reloadOnUserChange === true) {
      this.addListener(USER_CHANGED_EVENT, () => this._reloadCurrentPage());
    }

    this.addListener(LOGOUT_POSTPONED_EVENT, () => this._setPostponed(true));
    this.addListener(USER_CHANGE_POSTPONED_EVENT, () => this._setPostponed(true));
    this.addListener(USER_CHANGED_EVENT, () => this._setPostponed(false));
    this.addListener(USER_CHANGED_EVENT, user => user && this._updateDomainUser(user.id));

    this._createInitDeferred();

    this.setUpPreconnect(config.serverUri);
  }

  _setPostponed(postponed = false) {
    this._postponed = postponed;
  }

  _updateDomainUser(userID) {
    this._domainStorage.sendMessage(DOMAIN_USER_CHANGED_EVENT, {
      userID,
      serviceID: this.config.clientId
    });
  }

  addListener(event, handler) {
    this.listeners.add(event, handler);
  }

  removeListener(event, handler) {
    this.listeners.remove(event, handler);
  }

  setAuthDialogService(authDialogService) {
    this._authDialogService = authDialogService;
  }

  setCurrentService(service) {
    this._service = service;
  }

  _createInitDeferred() {
    this._initDeferred = {};
    this._initDeferred.promise = new Promise((resolve, reject) => {
      this._initDeferred.resolve = resolve;
      this._initDeferred.reject = reject;
    });
  }

  /**
   * @return {Promise.<string>} absolute URL promise that is resolved to a URL
   * that should be restored after returning back from auth server.
   */
  async init() {
    this._storage.onTokenChange(token => {
      const isGuest = this.user ? this.user.guest : false;

      if (isGuest && !token) {
        return;
      }

      if (!token) {
        this.logout();
      } else {
        this._detectUserChange(token.accessToken);
      }
    });

    this._domainStorage.onMessage(DOMAIN_USER_CHANGED_EVENT, ({userID, serviceID}) => {
      if (serviceID === this.config.clientId) {
        return;
      }
      if (this.user && userID === this.user.id) {
        return;
      }
      this.forceTokenUpdate();
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


      // Checking if there is a message left by another app on this domain
      const message = await this._domainStorage._messagesStorage.get(`domain-message-${DOMAIN_USER_CHANGED_EVENT}`);
      if (message) {
        const {userID, serviceID} = message;
        if (serviceID !== this.config.clientId && (!userID || this.user.id !== userID)) {
          this.forceTokenUpdate();
        }
      }

      // Access token appears to be valid.
      // We may resolve restoreLocation URL now
      if (!state) {
        // Check if we have requested to restore state anyway
        state = await this._checkForStateRestoration();
      }
      this._initDeferred.resolve(state && state.restoreLocation);
      return state?.restoreLocation;
    } catch (error) {
      if (Auth.storageIsUnavailable) {
        this._initDeferred.resolve(); // No way to handle if cookies are disabled
        await this.requestUser(); // Someone may expect user to be loaded as a part of token validation
        return null;
      }
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
        await this._backgroundFlow.authorize();
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
    if (this._postponed) {
      throw new Error('You should log in to be able to make requests');
    }

    try {
      await this._initDeferred.promise;

      if (Auth.storageIsUnavailable) {
        return null; // Forever guest if storage is unavailable
      }
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
      if (!this._backendCheckPromise) {
        this._backendCheckPromise = this._checkBackendsStatusesIfEnabled();
      }
      await this._backendCheckPromise;
    } catch (e) {
      throw new Error('Cannot refresh token: backend is not available. Postponed by user.');
    } finally {
      this._backendCheckPromise = null;
    }

    try {
      return await this._backgroundFlow.authorize();
    } catch (error) {

      if (this._canShowDialogs()) {
        return this._showAuthDialog({nonInteractive: true, error});
      } else {
        const authRequest = await this._requestBuilder.prepareAuthRequest();
        this._redirectCurrentPage(authRequest.url);
      }

      throw new TokenValidator.TokenValidationError(error.message);
    }
  }

  async loadCurrentService() {
    if (this._service.serviceName) {
      return;
    }
    try {
      const {serviceName, iconUrl: serviceImage} = await this.http.get(`oauth2/interactive/login/settings?client_id=${this.config.clientId}`) || {};
      this.setCurrentService({serviceImage, serviceName});
    } catch (e) {
      // noop
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

    // If user was fetched during token request
    if (this.user) {
      return this.user;
    }

    const user = await this.getUser(accessToken);
    this.user = user;

    return user;
  }

  async updateUser() {
    this._setPostponed(false);
    const accessToken = await this.requestToken();
    const user = await this.getUser(accessToken);
    this.user = user;
    this.listeners.trigger(USER_CHANGED_EVENT, user);
  }

  async _detectUserChange(accessToken) {
    const windowWasOpen = this._isLoginWindowOpen;

    try {
      const user = await this.getUser(accessToken);
      const onApply = () => {
        this.user = user;
        this.listeners.trigger(USER_CHANGED_EVENT, user);
      };

      if (user && this.user && this.user.id !== user.id) {
        if (!this._canShowDialogs() || this.user.guest || windowWasOpen) {
          onApply();
          return;
        }
        if (user.guest) {
          this._showAuthDialog({nonInteractive: true});
          return;
        }

        await this._showUserChangedDialog({
          newUser: user,
          onApply,
          onPostpone: () => {
            this.listeners.trigger(USER_CHANGE_POSTPONED_EVENT);
            this.config.onPostponeChangedUser(this.user, user);
          }
        });

      }
    } catch (e) {
      // noop
    }
  }

  _beforeLogout(params) {
    if (this._canShowDialogs()) {
      this._showAuthDialog(params);
      return;
    }

    this.logout();
  }

  async _showAuthDialog({nonInteractive, error, canCancel} = {}) {
    const {embeddedLogin, onPostponeLogout, translations} = this.config;
    const cancelable = this.user.guest || canCancel;

    this._createInitDeferred();

    const closeDialog = () => {
      /* eslint-disable no-use-before-define */
      stopTokenListening();
      stopMessageListening();
      hide();
      /* eslint-enable no-use-before-define */
    };

    const onConfirm = () => {
      if (embeddedLogin !== true) {
        closeDialog();
        this.logout();
        return;
      }
      this._runEmbeddedLogin();
    };

    const onCancel = () => {
      this._embeddedFlow.stop();
      this._storage.sendMessage(Auth.CLOSE_WINDOW_MESSAGE, Date.now());
      closeDialog();
      if (!cancelable) {
        this._initDeferred.resolve();
        this.listeners.trigger(LOGOUT_POSTPONED_EVENT);
        onPostponeLogout();
        return;
      }

      if (this.user.guest && nonInteractive) {
        this.forceTokenUpdate();
      } else {
        this._initDeferred.resolve();
      }
    };

    const hide = this._authDialogService({
      ...this._service,
      loginCaption: translations.login,
      loginToCaption: translations.loginTo,
      confirmLabel: translations.login,
      cancelLabel: cancelable ? translations.cancel : translations.postpone,
      errorMessage: error && error.toString ? error.toString() : null,
      onConfirm,
      onCancel
    });

    const stopTokenListening = this._storage.onTokenChange(token => {
      if (token) {
        closeDialog();
        this._initDeferred.resolve();
      }
    });

    const stopMessageListening = this._storage.onMessage(
      Auth.CLOSE_WINDOW_MESSAGE,
      () => this._embeddedFlow.stop()
    );
  }

  async _showUserChangedDialog({newUser, onApply, onPostpone} = {}) {
    const {translations} = this.config;

    this._createInitDeferred();

    const done = () => {
      this._initDeferred.resolve();
      // eslint-disable-next-line no-use-before-define
      hide();
    };

    const hide = this._authDialogService({
      ...this._service,
      title: translations.youHaveLoggedInAs.replace('%userName%', newUser.name),
      loginCaption: translations.login,
      loginToCaption: translations.loginTo,
      confirmLabel: translations.applyChange,
      cancelLabel: translations.postpone,
      onConfirm: () => {
        done();
        onApply();
      },
      onCancel: () => {
        done();
        onPostpone();
      }
    });
  }

  async _showBackendDownDialog(backendError) {
    const {onBackendDown, translations} = this.config;
    const REPEAT_TIMEOUT = 5000;
    let timerId = null;

    return new Promise((resolve, reject) => {
      const done = () => {
        /* eslint-disable no-use-before-define */
        hide();
        window.removeEventListener('online', onCheckAgain);
        stopListeningCloseMessage();
        /* eslint-enable no-use-before-define */
        this._storage.sendMessage(Auth.CLOSE_BACKEND_DOWN_MESSAGE, Date.now());
        this._awaitingForBackendPromise = null;
        clearTimeout(timerId);
      };

      const stopListeningCloseMessage = this._storage.onMessage(
        Auth.CLOSE_BACKEND_DOWN_MESSAGE,
        () => {
          stopListeningCloseMessage();
          done();
          resolve();
        }
      );

      const onCheckAgain = async () => {
        await this._checkBackendsAreUp();
        done();
        resolve();
      };

      const onPostpone = () => {
        done();
        reject(new Error('Auth(@jetbrains/ring-ui): postponed by user'));
      };

      const hide = onBackendDown({onCheckAgain, onPostpone, backendError, translations});

      window.addEventListener('online', onCheckAgain);

      function networkWatchdog() {
        if (navigator && navigator.onLine) {
          onCheckAgain();
        }
        timerId = setTimeout(networkWatchdog, REPEAT_TIMEOUT);
      }

      timerId = setTimeout(networkWatchdog, REPEAT_TIMEOUT);
    });
  }

  /**
   * Wipe accessToken and redirect to auth page with required authorization
   */
  async logout(extraParams) {
    const requestParams = {
      // eslint-disable-next-line camelcase
      request_credentials: 'required',
      ...extraParams
    };

    await this._checkBackendsStatusesIfEnabled();
    await this.listeners.trigger(LOGOUT_EVENT);
    this._updateDomainUser(null);
    await this._storage.wipeToken();

    const authRequest = await this._requestBuilder.prepareAuthRequest(requestParams);
    this._redirectCurrentPage(authRequest.url);
  }

  async _runEmbeddedLogin() {
    this._storage.sendMessage(Auth.CLOSE_WINDOW_MESSAGE, Date.now());
    try {
      this._isLoginWindowOpen = true;
      return await this._embeddedFlow.authorize();
    } catch (e) {
      throw e;
    } finally {
      this._isLoginWindowOpen = false;
    }
  }

  /**
   * Wipe accessToken and redirect to auth page to obtain authorization data
   * if user is logged in or log her in otherwise
   */
  async login() {
    if (this.config.embeddedLogin) {
      await this._runEmbeddedLogin();
      return;
    }

    await this._checkBackendsStatusesIfEnabled();
    try {
      const accessToken = await this._backgroundFlow.authorize();
      const user = await this.getUser(accessToken);

      if (user.guest) {
        this._beforeLogout();
      } else {
        this.user = user;
        this.listeners.trigger(USER_CHANGED_EVENT, user);
      }
    } catch (e) {
      this._beforeLogout();
    }
  }

  async switchUser() {
    if (this.config.embeddedLogin) {
      await this._runEmbeddedLogin();
    }

    throw new Error('Auth: switchUser only supported for "embeddedLogin" mode');
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
    const {scope: defaultScope, defaultExpiresIn, cleanHash} = this.config;

    if (authResponse && cleanHash) {
      this.setHash('');
    }

    if (!authResponse) {
      return undefined;
    }

    const {state: stateId, scope, expiresIn, accessToken} = authResponse;
    const newState = await (stateId && this._storage.getState(stateId)) || {};

    const scopes = scope ? scope.split(' ') : newState.scopes || defaultScope || [];
    const effectiveExpiresIn = expiresIn ? parseInt(expiresIn, 10) : defaultExpiresIn;
    const expires = TokenValidator._epoch() + effectiveExpiresIn;

    await this._storage.saveToken({accessToken, scopes, expires, lifeTime: effectiveExpiresIn});

    return newState;
  }

  async _checkForStateRestoration() {
    const authResponse = this._responseParser._authResponse;
    if (authResponse && this.config.cleanHash) {
      this.setHash('');
    }
    const stateId = authResponse?.restoreAuthState;
    return await (stateId && this._storage.getState(stateId)) || {};
  }

  _checkBackendsAreUp() {
    const {backendCheckTimeout} = this.config;
    return Promise.all([
      promiseWithTimeout(
        this.http.fetch('settings/public?fields=id'),
        backendCheckTimeout,
        {error: new Error('The authorization server is taking too long to respond. Please try again later.')}
      ),
      this.config.checkBackendIsUp()
    ]).catch(err => {
      if (err instanceof TypeError) {
        throw new TypeError('Could not connect to the server due to network error. Please check your connection and try again.');
      }
      throw err;
    });
  }

  async _checkBackendsStatusesIfEnabled() {
    if (!this.config.enableBackendStatusCheck) {
      return;
    }
    try {
      await this._checkBackendsAreUp();
    } catch (backendDownErr) {
      await this._showBackendDownDialog(backendDownErr);
    }
  }

  /**
   * Adds preconnect tag to help browser to establish connection to URL.
   * See https://w3c.github.io/resource-hints/
   * @param url Url to preconnect to.
   */
  async setUpPreconnect(url) {
    const linkNode = document.createElement('link');
    linkNode.rel = 'preconnect';
    linkNode.href = url;
    linkNode.pr = '1.0';
    document.head.appendChild(linkNode);
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

  _canShowDialogs() {
    return this.config.embeddedLogin && this._authDialogService;
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

      const hashIfExist = hash ? `#${hash}` : '';

      history.replaceState(undefined, undefined, `${cleanedUrl}${hashIfExist}`);
    } else {
      window.location.hash = hash;
    }
  }
}
