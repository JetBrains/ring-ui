import React from 'react';

import loginDialogService from '../login-dialog/service';
import Link from '../link/link';

import AuthResponseParser from './response-parser';

export default class WindowFlow {
  hideDialog = null;

  constructor(requestBuilder, storage) {
    this._requestBuilder = requestBuilder;
    this._storage = storage;
    this._reset();
  }

  /**
   * Initiates authorization in window
   */
  async _load() {
    const authRequest = await this._requestBuilder.prepareAuthRequest(
      // eslint-disable-next-line camelcase
      {request_credentials: 'required', auth_mode: 'bypass_to_login'},
      {nonRedirect: true}
    );

    return new Promise((resolve, reject) => {
      this.hideDialog = loginDialogService({
        url: authRequest.url,
        loader: true,
        // eslint-disable-next-line react/display-name
        renderFallbackLink: () => <Link href={authRequest.url}>{'Can\'t see login form?'}</Link>
      });

      this.reject = reject;

      const removeTokenListener = this._storage.onTokenChange(token => {
        if (token) {
          // eslint-disable-next-line no-use-before-define
          cleanUp();
          resolve(token.accessToken);
        }
      });

      const removeStateListener = this._storage.onStateChange(authRequest.stateId, state => {
        if (state && state.error) {
          // eslint-disable-next-line no-use-before-define
          cleanUp();
          reject(new AuthResponseParser.AuthError(state));
        }
      });

      const cleanUp = () => {
        this.hideDialog();
        removeStateListener();
        removeTokenListener();
      };
    });
  }

  _reset = () => {
    this._promise = null;
    this.hideDialog = null;
  };

  stop() {
    if (this.hideDialog) {
      this.hideDialog();
    }
    if (this.reject) {
      this.reject('Login form closed');
    }
    this._reset();
  }

  authorize() {
    if (this._promise !== null && this._loginWindow !== null && this._loginWindow.closed !== true) {
      return this._promise;
    }

    this._promise = this._load();

    this._promise.then(this._reset, this._reset);

    return this._promise;
  }
}
