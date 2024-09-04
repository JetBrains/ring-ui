import {fixUrl, getAbsoluteBaseURL} from '../global/url';
import Listeners, {Handler} from '../global/listeners';
import HTTP, {HTTPAuth, RequestParams} from '../http/http';
import promiseWithTimeout from '../global/promise-with-timeout';
import type AuthDialogService from '../auth-dialog-service/auth-dialog-service';

import {getTranslations, getTranslationsWithFallback, translate} from '../i18n/i18n';

import AuthStorage, {AuthState} from './storage';
import AuthResponseParser, {AuthError, AuthResponse} from './response-parser';
import AuthRequestBuilder from './request-builder';
import BackgroundFlow from './background-flow';
import TokenValidator, {TokenValidationError, TokenValidatorConfig} from './token-validator';

/* eslint-disable @typescript-eslint/no-magic-numbers */
export const DEFAULT_EXPIRES_TIMEOUT = 40 * 60;
export const DEFAULT_BACKGROUND_TIMEOUT = 10 * 1000;
const DEFAULT_BACKEND_CHECK_TIMEOUT = 10 * 1000;
const BACKGROUND_REDIRECT_TIMEOUT = 20 * 1000;
const DEFAULT_WAIT_FOR_REDIRECT_TIMEOUT = 5 * 1000;
/* eslint-enable @typescript-eslint/no-magic-numbers */

export const USER_CHANGED_EVENT = 'userChange';
export const DOMAIN_USER_CHANGED_EVENT = 'domainUser';
export const LOGOUT_EVENT = 'logout';
export const LOGOUT_POSTPONED_EVENT = 'logoutPostponed';
export const USER_CHANGE_POSTPONED_EVENT = 'changePostponed';

function noop() {}

export interface AuthUser {
  guest?: boolean
  id: string
  name: string
  login: string
  banned?: boolean
  banReason?: string
  profile?: {
    avatar?: {
      url?: string
    }
    email?: {
      email?: string
    }
  }
}

export interface AuthTranslations {
  login: string
  loginTo: string
  cancel: string
  postpone: string
  youHaveLoggedInAs: string
  applyChange: string
  backendIsNotAvailable: string
  checkAgain: string
  tryAgainLabel: string
  nothingHappensLink: string
  errorMessage: string
}

export interface LoginFlow {
  stop(): void
  authorize(): Promise<unknown>
}

export interface LoginFlowClass {
  new (
    requestBuilder: AuthRequestBuilder,
    storage: AuthStorage,
    translations: AuthTranslations
  ): LoginFlow
}

export interface BackendDownParams {
  onCheckAgain(): Promise<void>
  onPostpone(): void
  backendError: Error
  translations: AuthTranslations
}

export interface AuthConfig extends TokenValidatorConfig {
  serverUri: string
  redirectUri: string
  requestCredentials: string
  clientId: string
  redirect: boolean
  cleanHash: boolean
  userFields: readonly string[]
  fetchCredentials?: RequestCredentials | null | undefined
  cacheCurrentUser: boolean
  reloadOnUserChange: boolean
  embeddedLogin: boolean
  EmbeddedLoginFlow?: LoginFlowClass | null | undefined
  backgroundRefreshTimeout?: number | null | undefined
  onLogout?: (() => void) | null | undefined
  onPostponeChangedUser: (prevUser: AuthUser | null, nextUser: AuthUser | null) => void
  onPostponeLogout: () => void
  enableBackendStatusCheck: boolean
  backendCheckTimeout: number
  checkBackendIsUp: () => Promise<unknown>
  onBackendDown: (params: BackendDownParams) => () => void
  defaultExpiresIn: number
  translations?: AuthTranslations | null | undefined
  userParams?: RequestParams | undefined
  waitForRedirectTimeout: number
}

const DEFAULT_CONFIG: Omit<AuthConfig, 'serverUri'> = {
  cacheCurrentUser: false,
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
  onBackendDown: () => () => {},

  defaultExpiresIn: DEFAULT_EXPIRES_TIMEOUT,
  waitForRedirectTimeout: DEFAULT_WAIT_FOR_REDIRECT_TIMEOUT,
  translations: null
};

type AuthPayloadMap = {
  userChange: [AuthUser | undefined | void, void]
  logout: [void, void]
  logoutPostponed: [void, void]
  changePostponed: [void, void]
}

export interface AuthService {
  serviceName: string
  serviceImage: string
}

interface Deferred<T> {
  promise?: Promise<T>
  resolve?: (value: T) => void
  reject?: (reason: unknown) => void
}

interface AuthDialogParams {
  nonInteractive?: boolean
  error?: Error
  canCancel?: boolean
  onTryAgain?: () => Promise<void>
}

interface UserChange {
  userID: number | string | null | undefined,
  serviceID: string
}

interface UserChangedDialogParams {
  newUser: AuthUser
  onApply: () => void
  onPostpone: () => void
}

declare global {
  interface HTMLLinkElement {
    pr?: string
  }
}

export default class Auth implements HTTPAuth {
  static DEFAULT_CONFIG = DEFAULT_CONFIG;
  static API_PATH = 'api/rest/';
  static API_AUTH_PATH = 'oauth2/auth';
  static API_PROFILE_PATH = 'users/me';
  static CLOSE_BACKEND_DOWN_MESSAGE = 'backend-check-succeeded';
  static CLOSE_WINDOW_MESSAGE = 'close-login-window';
  static shouldRefreshToken = TokenValidator.shouldRefreshToken;
  static storageIsUnavailable = !navigator.cookieEnabled;

  config: AuthConfig;
  listeners = new Listeners<AuthPayloadMap>();
  http: HTTP;
  private _service: Partial<AuthService> = {};
  readonly _storage: AuthStorage<number>;
  private _responseParser = new AuthResponseParser();
  private readonly _requestBuilder: AuthRequestBuilder | null = null;
  _backgroundFlow: BackgroundFlow | null;
  private _embeddedFlow: LoginFlow | null = null;
  _tokenValidator: TokenValidator | null = null;
  private _postponed = false;
  private _backendCheckPromise: Promise<void> | null = null;
  private _authDialogService: typeof AuthDialogService | undefined = undefined;
  _domainStorage: AuthStorage<UserChange>;
  user: AuthUser | null = null;
  _initDeferred?: Deferred<string | void>;
  private _isLoginWindowOpen?: boolean;

  constructor(config: Partial<AuthConfig> & Pick<AuthConfig, 'serverUri'>) {
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
      tokenKey: `${clientId}-token`,
      userKey: `${clientId}-user-`
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
        this.config.translations ?? getTranslationsWithFallback()
      );
    }

    const API_BASE = this.config.serverUri + Auth.API_PATH;
    const fetchConfig = config.fetchCredentials
      ? {credentials: config.fetchCredentials}
      : undefined;
    this.http = new HTTP(this, API_BASE, fetchConfig);

    const getUser = async (token: string) => {
      const user = await this.getUser(token);
      this.user = user;
      return user;
    };

    this._tokenValidator = new TokenValidator(this.config, getUser, this._storage);

    if (this.config.onLogout) {
      this.addListener(LOGOUT_EVENT, this.config.onLogout);
    }

    if (this.config.reloadOnUserChange) {
      this.addListener(USER_CHANGED_EVENT, () => {
        // Timeout is needed to ensure all other listeners triggered before stopping current page
        setTimeout(() => this._reloadCurrentPage());
      });
    }

    this.addListener(LOGOUT_POSTPONED_EVENT, () => this._setPostponed(true));
    this.addListener(USER_CHANGE_POSTPONED_EVENT, () => this._setPostponed(true));
    this.addListener(USER_CHANGED_EVENT, () => this._setPostponed(false));
    this.addListener(USER_CHANGED_EVENT, (user: AuthUser | null | undefined | void) => {
      if (user) {
        this._updateDomainUser(user.id);
      }
    });
    if (this.config.cacheCurrentUser) {
      this.addListener(LOGOUT_EVENT, () => this._storage?.wipeCachedCurrentUser());
      this.addListener(USER_CHANGED_EVENT, () => this._storage?.onUserChanged());
    }

    this._createInitDeferred();

    this.setUpPreconnect(config.serverUri);
  }

  private _setPostponed(postponed = false) {
    this._postponed = postponed;
  }

  private _updateDomainUser(userID: number | string | null | undefined) {
    this._domainStorage.sendMessage(DOMAIN_USER_CHANGED_EVENT, {
      userID,
      serviceID: this.config.clientId
    });
  }

  addListener<E extends keyof AuthPayloadMap>(event: E, handler: Handler<AuthPayloadMap, E>) {
    this.listeners.add(event, handler);
  }

  removeListener<E extends keyof AuthPayloadMap>(event: E, handler: Handler<AuthPayloadMap, E>) {
    this.listeners.remove(event, handler);
  }

  setAuthDialogService(authDialogService: typeof AuthDialogService) {
    this._authDialogService = authDialogService;
  }

  setCurrentService(service: AuthService) {
    this._service = service;
  }

  private _createInitDeferred() {
    const deferred: Deferred<string | void> = {};
    deferred.promise = new Promise((resolve, reject) => {
      deferred.resolve = resolve;
      deferred.reject = reject;
    });
    this._initDeferred = deferred;
  }

  /**
   * @return {Promise.<string>} absolute URL promise that is resolved to a URL
   * that should be restored after returning back from auth server.
   */
  async init(): Promise<string | null | undefined> {
    this._storage?.onTokenChange(async token => {
      const isGuest = this.user ? this.user.guest : false;

      if (isGuest && !token) {
        return;
      }

      if (!token) {
        this.logout();
      } else {
        try {
          await this._detectUserChange(token.accessToken);
        } catch (error) {
          if (!(error instanceof Error)) {
            throw error;
          }
          if (this._canShowDialogs()) {
            this._showAuthDialog({nonInteractive: true, error});
          }
        }
      }
    });

    this._domainStorage.onMessage(DOMAIN_USER_CHANGED_EVENT, (message: UserChange | null) => {
      const {userID, serviceID} = message || {};
      if (serviceID === this.config.clientId) {
        return;
      }
      if (this.user && userID === this.user.id) {
        return;
      }
      this.forceTokenUpdate();
    });

    let state: AuthState | undefined;

    try {
      // Look for token or error in hash
      state = await this._checkForAuthResponse();
    } catch (error) {
      return error instanceof Error ? this.handleInitError(error) : undefined;
    }

    // Return endless promise in the background to avoid service start
    if (state && state.nonRedirect) {
      return new Promise(noop);
    }

    try {
      // Check if there is a valid token
      await this._tokenValidator?.validateToken();


      // Checking if there is a message left by another app on this domain
      const message = await this._domainStorage._messagesStorage.get<UserChange>(`domain-message-${DOMAIN_USER_CHANGED_EVENT}`);
      if (message) {
        const {userID, serviceID} = message;
        if (serviceID !== this.config.clientId && (!userID || this.user?.id !== userID)) {
          this.forceTokenUpdate();
        }
      }

      // Access token appears to be valid.
      // We may resolve restoreLocation URL now
      if (!state) {
        // Check if we have requested to restore state anyway
        state = await this._checkForStateRestoration();
      }
      this._initDeferred?.resolve?.(state && state.restoreLocation);
      return state?.restoreLocation;
    } catch (error) {
      if (Auth.storageIsUnavailable) {
        this._initDeferred?.resolve?.(); // No way to handle if cookies are disabled
        await this.requestUser(); // Someone may expect user to be loaded as a part of token validation
        return null;
      }
      return error instanceof Error ? this.handleInitValidationError(error) : undefined;
    }
  }

  async sendRedirect(error: Error): Promise<undefined> {
    const authRequest = await this._requestBuilder?.prepareAuthRequest();
    if (authRequest != null) {
      this._redirectCurrentPage(authRequest.url);
    }

    // HUB-10867 Since we already redirecting the page, there is no actual need to throw an error
    // and scare user with flashing error
    // But let's keep it just in case redirect was not successful
    await new Promise(resolve => setTimeout(resolve, this.config.waitForRedirectTimeout));

    throw error;
  }

  async handleInitError(error: Error | AuthError): Promise<undefined> {
    if ('stateId' in error && error.stateId) {
      try {
        const state = await this._storage?.getState(error.stateId);

        if (state && state.nonRedirect) {
          state.error = error;
          this._storage?.saveState(error.stateId, state);

          // Return endless promise in the background to avoid service start
          return new Promise(noop);
        }
      } catch (e) {
        // Throw the original error instead below
      }
    }

    throw error;
  }

  async handleInitValidationError(error: Error | TokenValidationError): Promise<undefined> {
    if ('cause' in error && error.cause instanceof Error && error.cause?.message === 'invalid_client') {
      // eslint-disable-next-line no-console
      console.error('RingUI Auth: invalid client detected. Logging out', error);
      await this.logout();
      return undefined;
    }
    // Redirect flow
    if ('authRedirect' in error && error.authRedirect && this.config.redirect) {
      return this.sendRedirect(error);
    }

    // Background flow
    if ('authRedirect' in error && error.authRedirect && !this.config.redirect) {
      try {
        await this._backgroundFlow?.authorize();
        await this._tokenValidator?.validateToken();
        this._initDeferred?.resolve?.();
        return undefined;
      } catch (validationError) {
        // Fallback to redirect flow
        return validationError instanceof Error ? this.sendRedirect(validationError) : undefined;
      }
    }

    this._initDeferred?.reject?.(error);
    throw error;
  }

  /**
   * Get token from local storage or request it if necessary.
   * Can redirect to login page.
   * @return {Promise.<string>}
   */
  async requestToken(): Promise<string | null> {
    if (this._postponed) {
      throw new Error('You should log in to be able to make requests');
    }

    try {
      await this._initDeferred?.promise;

      if (Auth.storageIsUnavailable) {
        return null; // Forever guest if storage is unavailable
      }
      return await this._tokenValidator?.validateTokenLocally() ?? null;
    } catch (e) {
      return this.forceTokenUpdate();
    }
  }

  /**
   * Get new token in the background or redirect to the login page.
   * @return {Promise.<string>}
   */
  async forceTokenUpdate(): Promise<string | null> {
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
      return await this._backgroundFlow?.authorize() ?? null;
    } catch (error) {
      if (!(error instanceof Error)) {
        return null;
      }
      if (this._canShowDialogs()) {
        return new Promise(resolve => {
          const onTryAgain = async () => {
            try {
              const result = await this._backgroundFlow?.authorize();
              resolve(result ?? null);
            } catch (retryError) {
              if (retryError instanceof Error) {
                this._showAuthDialog({
                  nonInteractive: true,
                  error: retryError,
                  onTryAgain
                });
              }
              throw retryError;
            }
          };
          this._showAuthDialog({
            nonInteractive: true,
            error: error as Error,
            onTryAgain
          });
        });
      } else {
        const authRequest = await this._requestBuilder?.prepareAuthRequest();
        if (authRequest != null) {
          this._redirectCurrentPage(authRequest.url);
        }
      }

      throw new TokenValidator.TokenValidationError(error.message);
    }
  }

  async loadCurrentService() {
    if (this._service.serviceName) {
      return;
    }
    try {
      const {serviceName, iconUrl: serviceImage} = await this.http.get<{
        serviceName: string
        iconUrl: string
      }>(`oauth2/interactive/login/settings?client_id=${this.config.clientId}`) || {};
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
  getUser(accessToken?: string | null | undefined) {
    if (this.config.cacheCurrentUser) {
      return this._storage?.getCachedUser(
        () => this.http.authorizedFetch(
          Auth.API_PROFILE_PATH,
          accessToken,
          this.config.userParams
        )
      );
    } else {
      return this.http.authorizedFetch(Auth.API_PROFILE_PATH, accessToken, this.config.userParams);
    }
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
    this._storage?.wipeCachedCurrentUser();
    const user = await this.getUser(accessToken);
    this.user = user;
    this.listeners.trigger(USER_CHANGED_EVENT, user);
  }

  async _detectUserChange(accessToken: string) {
    const windowWasOpen = this._isLoginWindowOpen;

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
  }

  _beforeLogout(params?: AuthDialogParams) {
    if (this._canShowDialogs()) {
      this._showAuthDialog(params);
      return;
    }

    this.logout();
  }

  _showAuthDialog({nonInteractive, error, canCancel, onTryAgain}: AuthDialogParams = {}) {
    const {embeddedLogin, onPostponeLogout, translations} = this.config;
    const cancelable = this.user?.guest || canCancel;
    const actualTranslations = translations ?? getTranslations();

    this._createInitDeferred();

    const closeDialog = () => {
      /* eslint-disable @typescript-eslint/no-use-before-define */
      stopTokenListening?.();
      stopMessageListening?.();
      hide?.();
      /* eslint-enable @typescript-eslint/no-use-before-define */
    };

    const onConfirm = () => {
      if (!embeddedLogin) {
        closeDialog();
        this.logout();
        return;
      }
      this._runEmbeddedLogin();
    };

    const onCancel = () => {
      this._embeddedFlow?.stop();
      this._storage?.sendMessage(Auth.CLOSE_WINDOW_MESSAGE, Date.now());
      closeDialog();
      if (!cancelable) {
        this._initDeferred?.resolve?.();
        this.listeners.trigger(LOGOUT_POSTPONED_EVENT);
        onPostponeLogout();
        return;
      }

      if (this.user?.guest && nonInteractive) {
        this.forceTokenUpdate();
      } else {
        this._initDeferred?.resolve?.();
      }
    };

    const onTryAgainClick = async () => {
      await onTryAgain?.();
      closeDialog();
    };

    const hide = this._authDialogService?.({
      ...this._service,
      loginCaption: actualTranslations.login,
      loginToCaption: actualTranslations.loginTo,
      confirmLabel: actualTranslations.login,
      tryAgainLabel: actualTranslations.tryAgainLabel,
      cancelLabel: cancelable ? actualTranslations.cancel : actualTranslations.postpone,
      errorMessage: this._extractErrorMessage(error, true),
      onConfirm,
      onCancel,
      onTryAgain: onTryAgain ? onTryAgainClick : undefined
    });

    const stopTokenListening = this._storage?.onTokenChange(token => {
      if (token) {
        closeDialog();
        this._initDeferred?.resolve?.();
      }
    });

    const stopMessageListening = this._storage?.onMessage(
      Auth.CLOSE_WINDOW_MESSAGE,
      () => this._embeddedFlow?.stop()
    );
  }

  _showUserChangedDialog({newUser, onApply, onPostpone}: UserChangedDialogParams) {
    const {translations} = this.config;

    this._createInitDeferred();

    const done = () => {
      this._initDeferred?.resolve?.();
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      hide?.();
    };

    const hide = this._authDialogService?.({
      ...this._service,
      title: translations?.youHaveLoggedInAs ?? translate('youHaveLoggedInAs').
        replace('%userName%', newUser.name ?? '').
        replace('{{userName}}', newUser.name ?? ''),
      loginCaption: translations?.login ?? translate('login'),
      loginToCaption: translations?.loginTo ?? translate('loginTo'),
      confirmLabel: translations?.applyChange ?? translate('applyChange'),
      tryAgainLabel: translations?.tryAgainLabel ?? translate('tryAgainLabel'),
      cancelLabel: translations?.postpone ?? translate('postpone'),
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

  private _extractErrorMessage(error: Error | AuthError | undefined, logError = false) {
    if (!error) {
      return null;
    }
    if (logError) {
      // eslint-disable-next-line no-console
      console.error('RingUI Auth error', error);
    }

    try {
      // We've got some error from this list
      // https://www.jetbrains.com/help/youtrack/devportal/OAuth-2.0-Errors.html
      if ('code' in error && error.code && typeof error.code === 'object' && 'code' in error.code && typeof error.code.code === 'string') {
        const readableCode = error.code.code.split('_').join(' ');
        return `Authorization error: ${readableCode}`;
      }
    } catch {
      // noop
    }

    return error.toString ? error.toString() : null;
  }

  private _showBackendDownDialog(backendError: Error) {
    const {onBackendDown, translations} = this.config;
    const REPEAT_TIMEOUT = 5000;
    let timerId: number | undefined;

    return new Promise<void>((resolve, reject) => {
      const done = () => {
        /* eslint-disable @typescript-eslint/no-use-before-define */
        hide();
        window.removeEventListener('online', onCheckAgain);
        stopListeningCloseMessage?.();
        /* eslint-enable @typescript-eslint/no-use-before-define */
        this._storage?.sendMessage(Auth.CLOSE_BACKEND_DOWN_MESSAGE, Date.now());
        clearTimeout(timerId);
      };

      const stopListeningCloseMessage = this._storage?.onMessage(
        Auth.CLOSE_BACKEND_DOWN_MESSAGE,
        () => {
          stopListeningCloseMessage?.();
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

      const hide = onBackendDown({
        onCheckAgain, onPostpone, backendError,
        translations: translations ?? getTranslationsWithFallback()
      });

      window.addEventListener('online', onCheckAgain);

      function networkWatchdog() {
        if (navigator && navigator.onLine) {
          onCheckAgain();
        }
        timerId = window.setTimeout(networkWatchdog, REPEAT_TIMEOUT);
      }

      timerId = window.setTimeout(networkWatchdog, REPEAT_TIMEOUT);
    });
  }

  /**
   * Wipe accessToken and redirect to auth page with required authorization
   */
  async logout(extraParams?: Record<string, unknown>) {
    const requestParams = {
      // eslint-disable-next-line camelcase
      request_credentials: 'required',
      ...extraParams
    };

    await this._checkBackendsStatusesIfEnabled();
    await this.listeners.trigger('logout');
    this._updateDomainUser(null);
    await this._storage?.wipeToken();

    const authRequest = await this._requestBuilder?.prepareAuthRequest(requestParams);
    if (authRequest != null) {
      this._redirectCurrentPage(authRequest.url);
    }
  }

  private async _runEmbeddedLogin() {
    this._storage?.sendMessage(Auth.CLOSE_WINDOW_MESSAGE, Date.now());
    try {
      this._isLoginWindowOpen = true;
      return await this._embeddedFlow?.authorize();
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
      const accessToken = await this._backgroundFlow?.authorize();
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
    if (!this.config.embeddedLogin) {
      throw new Error('Auth: switchUser only supported for "embeddedLogin" mode');
    }
    await this._runEmbeddedLogin();
  }

  _makeStateFromResponse(authResponse: AuthResponse): AuthState | null {
    const {state} = authResponse;
    if (!state) {
      throw new Error('No state in AuthResponse');
    }
    const {scope: defaultScope} = this.config;
    let urlFromState: URL | null = null;
    try {
      urlFromState = new URL(state); // checking if state contains valid URL on same origin, see HUB-11514
    } catch {
      return null;
    }
    if (urlFromState.origin !== window.location.origin) {
      throw new Error(`State contains URL with different origin: "${state}"`);
    }
    return {
      restoreLocation: state,
      created: Date.now(),
      scopes: defaultScope
    };
  }

  /**
   * Check if the hash contains an access token.
   * If it does, extract the state, compare with
   * config, and store the auth response for later use.
   *
   * @return {Promise} promise that is resolved to restoreLocation URL, or rejected
   * @private
   */
  private async _checkForAuthResponse() {
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

    let newState: AuthState | null = null;
    if (stateId) {
      newState = await this._storage.getState(stateId);
      if (!newState) {
        newState = this._makeStateFromResponse(authResponse);
      }
    }

    if (!newState) {
      throw new Error(`Could not create state where stateId="${stateId}"`);
    }
    const scopes = scope ? scope.split(' ') : newState.scopes || defaultScope || [];
    const effectiveExpiresIn = expiresIn ? parseInt(expiresIn, 10) : defaultExpiresIn;
    const expires = TokenValidator._epoch() + effectiveExpiresIn;

    if (accessToken != null) {
      await this._storage?.saveToken({accessToken, scopes, expires, lifeTime: effectiveExpiresIn});
    }

    return newState;
  }

  private async _checkForStateRestoration() {
    const authResponse = this._responseParser._authResponse;
    if (authResponse && this.config.cleanHash) {
      this.setHash('');
    }
    const stateId = authResponse?.restoreAuthState;
    return await (stateId && this._storage?.getState(stateId)) || {};
  }

  _checkBackendsAreUp() {
    const abortCtrl = new AbortController();
    const {backendCheckTimeout} = this.config;

    return Promise.all([
      promiseWithTimeout(
        this.http.fetch('settings/public?fields=id', {signal: abortCtrl.signal}),
        backendCheckTimeout,
        {
          error: new Error('The authorization server is taking too long to respond. Please try again later.'),
          onTimeout: () => abortCtrl.abort()
        }
      ),
      this.config.checkBackendIsUp()
    ]).catch(err => {
      if (err instanceof TypeError) {
        throw new TypeError('Could not connect to the server due to network error. Please check your connection and try again.');
      }
      throw err;
    });
  }

  private async _checkBackendsStatusesIfEnabled() {
    if (!this.config.enableBackendStatusCheck) {
      return;
    }
    try {
      await this._checkBackendsAreUp();
    } catch (backendDownErr) {
      if (backendDownErr instanceof Error) {
        await this._showBackendDownDialog(backendDownErr);
      }
    }
  }

  /**
   * Adds preconnect tag to help browser to establish connection to URL.
   * See https://w3c.github.io/resource-hints/
   * @param url Url to preconnect to.
   */
  setUpPreconnect(url: string) {
    const linkNode = document.createElement('link');
    linkNode.rel = 'preconnect';
    linkNode.href = url;
    linkNode.pr = '1.0';
    linkNode.crossOrigin = 'use-credentials';
    document.head.appendChild(linkNode);
  }

  /**
   * Redirects current page to the given URL
   * @param {string} url
   * @private
   */
  _redirectCurrentPage(url: string) {
    if (process.env.NODE_ENV !== 'test') {
      window.location.href = fixUrl(url);
    }
  }

  /**
   * Reloads current page
   */
  private _reloadCurrentPage() {
    this._redirectCurrentPage(window.location.href);
  }

  _canShowDialogs() {
    return this.config.embeddedLogin && this._authDialogService;
  }

  /**
   * Sets the location hash
   * @param {string} hash
   */
  setHash(hash: string) {
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

      history.replaceState(undefined, '', `${cleanedUrl}${hashIfExist}`);
    } else {
      window.location.hash = hash;
    }
  }
}
