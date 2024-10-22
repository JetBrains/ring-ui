import uuid from 'simply-uuid';

import {encodeURL} from '../global/url';

import AuthStorage, {AuthState} from './storage';

export interface AuthRequestBuilderConfig {
  authorization: string;
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
    const stateId = AuthRequestBuilder._uuid();
    const scopes = this.config.scopes.map(scope => encodeURIComponent(scope));

    /* eslint-disable camelcase */
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
    /* eslint-enable camelcase */

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
   * @param {string} id
   * @param {StoredState} storedState
   * @return {Promise}
   * @private
   */
  _saveState(id: string, storedState: AuthState) {
    return this.storage?.saveState(id, storedState);
  }
}
