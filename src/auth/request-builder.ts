import uuid from 'simply-uuid';

import {encodeURL} from '../global/url';

import type {AuthState} from './storage';
import type AuthStorage from './storage';

export interface AuthRequestBuilderConfig {
  authorization: string;
  logout?: string | null | undefined;
  redirectUri?: string | null | undefined;
  requestCredentials?: string | null | undefined;
  clientId?: string | null | undefined;
  scopes: readonly string[];
  redirect?: boolean | null | undefined;
}

export default class AuthRequestBuilder {
  config: AuthRequestBuilderConfig;
  storage: AuthStorage | undefined;
  /**
   * @param {{
   *   authorization: string,
   *   redirectUri: string?,
   *   requestCredentials: string?,
   *   clientId: string?,
   *   scopes: string[]
   * }} config
   * @param {AuthStorage} storage
   */
  constructor(config: AuthRequestBuilderConfig, storage?: AuthStorage) {
    this.config = config;
    this.storage = storage;
  }

  /**
   * @return {string} random string used for state
   */
  static _uuid = uuid.generate;

  /**
   * Save state and build an auth server redirect URL.
   *
   * @param {object=} extraParams additional query parameters for auth request
   * @param {object=} extraState additional state parameters to save
   * @return {Promise.<string>} promise that is resolved to authURL
   */
  async prepareAuthRequest(extraParams?: Record<string, unknown> | null | undefined, extraState?: Partial<AuthState>) {
    // eslint-disable-next-line no-underscore-dangle
    const stateId = AuthRequestBuilder._uuid();
    const scopes = this.config.scopes.map(scope => encodeURIComponent(scope));

    const request = Object.assign(
      {
        response_type: 'token',
        state: stateId,
        redirect_uri: this.config.redirectUri,
        request_credentials: this.config.requestCredentials,
        client_id: this.config.clientId,
        scope: scopes.join(' '),
      },
      extraParams || {},
    );

    const authURL = encodeURL(this.config.authorization, request);

    const state = Object.assign(
      {
        restoreLocation: window.location.href,
        scopes: this.config.scopes,
      },
      extraState || {},
    );

    await this._saveState(stateId, state);
    return {
      url: authURL,
      stateId,
    };
  }

  /**
   * Build a logout URL for RP-initiated logout flow.
   * See: https://youtrack.jetbrains.com/projects/HUB/articles/HUB-A-43#rp-initiated-logout
   *
   * @param {object=} extraParams additional query parameters for logout request
   * @return {string} logout URL with required parameters
   */
  prepareLogoutRequest(extraParams?: Record<string, unknown> | null | undefined) {
    if (!this.config.logout) {
      throw new Error('Logout URL is not configured');
    }

    // eslint-disable-next-line no-underscore-dangle
    const state = AuthRequestBuilder._uuid();

    const logoutParams = {
      post_logout_redirect_uri: this.config.redirectUri,
      client_id: this.config.clientId,
      state,
      ...extraParams,
    };

    return {
      url: encodeURL(this.config.logout, logoutParams),
      state,
    };
  }

  /**
   * @param {string} id
   * @param {StoredState} storedState
   * @return {Promise}
   * @private
   */
  _saveState(id: string, storedState: AuthState) {
    return this.storage?.saveState(id, storedState);
  }
}
