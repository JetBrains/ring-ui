import AuthResponseParser from './response-parser';
import {type LoginFlow} from './auth-core';

import type AuthRequestBuilder from './request-builder';
import type AuthStorage from './storage';

const NAVBAR_HEIGHT = 50;
const CLOSED_CHECK_INTERVAL = 200;

export default class WindowFlow implements LoginFlow {
  private _timeoutId: number | undefined = undefined;
  private _requestBuilder: AuthRequestBuilder;
  private _storage: AuthStorage;
  reject?: (reason: unknown) => void;
  private _loginWindow?: Window | null;
  private _promise?: Promise<string> | null;

  constructor(requestBuilder: AuthRequestBuilder, storage: AuthStorage) {
    this._requestBuilder = requestBuilder;
    this._storage = storage;
    this._reset();
  }

  /**
   * Opens window with the given URL
   * @param {string} url
   * @private
   */
  private _openWindow(url: string) {
    const height = 700;
    const width = 750;
    const screenHalves = 2;
    const top = (window.screen.height - height - NAVBAR_HEIGHT) / screenHalves;
    const left = (window.screen.width - width) / screenHalves;

    return window.open(url, 'HubLoginWindow', `height=${height}, width=${width}, left=${left}, top=${top}`);
  }

  /**
   * Initiates authorization in window
   */
  private async _load(): Promise<string> {
    const authRequest = await this._requestBuilder.prepareAuthRequest(
      {request_credentials: 'required', auth_mode: 'bypass_to_login'},
      {nonRedirect: true},
    );

    return new Promise((resolve, reject) => {
      this.reject = reject;
      let cleanRun: boolean;

      const cleanUp = () => {
        if (cleanRun) {
          return;
        }
        cleanRun = true;
        /* eslint-disable @typescript-eslint/no-use-before-define */
        removeStateListener();
        removeTokenListener();
        /* eslint-enable @typescript-eslint/no-use-before-define */

        this._loginWindow?.close();
        clearTimeout(this._timeoutId);
      };

      const removeTokenListener = this._storage.onTokenChange(token => {
        if (token) {
          cleanUp();
          resolve(token.accessToken);
        }
      });

      const removeStateListener = this._storage.onStateChange(authRequest.stateId, state => {
        if (state && state.error) {
          cleanUp();
          reject(new AuthResponseParser.AuthError(state));
        }
      });

      if (
        this._loginWindow === null ||
        this._loginWindow === undefined ||
        (this._loginWindow && this._loginWindow.closed)
      ) {
        this._loginWindow = this._openWindow(authRequest.url);
      } else if (this._loginWindow) {
        this._loginWindow.location.href = authRequest.url;
      }

      this.checkIsClosed();
    });
  }

  checkIsClosed = () => {
    if (this._loginWindow?.closed) {
      this.stop();
      return;
    }
    this._timeoutId = window.setTimeout(this.checkIsClosed, CLOSED_CHECK_INTERVAL);
  };

  _reset = () => {
    this._promise = null;
    this._loginWindow = null;
    clearTimeout(this._timeoutId);
  };

  stop() {
    if (this._loginWindow !== null && this._loginWindow !== undefined) {
      this._loginWindow.close();
    }
    if (this.reject) {
      this.reject('Authorization window closed');
    }
    this._reset();
  }

  authorize(): Promise<string> {
    if (this._promise && this._loginWindow && !this._loginWindow.closed) {
      this._loginWindow.focus();

      return this._promise;
    }

    this._promise = this._load();

    this._promise.then(this._reset, this._reset);

    return this._promise;
  }
}
