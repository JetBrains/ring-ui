import loginDialogService from '../login-dialog/service';
import Link from '../link/link';

import AuthResponseParser from './response-parser';
import {AuthTranslations, LoginFlow} from './auth__core';
import AuthRequestBuilder from './request-builder';
import AuthStorage from './storage';

export default class IFrameFlow implements LoginFlow {
  hideDialog: (() => void) | null = null;
  private _requestBuilder: AuthRequestBuilder;
  private _storage: AuthStorage;
  private _translations: AuthTranslations;
  reject?: (reason: unknown) => void;
  private _promise?: Promise<string> | null;
  private _loginWindow?: Window;

  constructor(requestBuilder: AuthRequestBuilder, storage: AuthStorage, translations: AuthTranslations) {
    this._requestBuilder = requestBuilder;
    this._storage = storage;
    this._translations = translations;
    this._reset();
  }

  /**
   * Initiates authorization in window
   */
  private async _load(): Promise<string> {
    const authRequest = await this._requestBuilder.prepareAuthRequest(
      // eslint-disable-next-line camelcase
      {request_credentials: 'required', auth_mode: 'bypass_to_login'},
      {nonRedirect: false},
    );

    const renderFallbackLink = () => (
      <Link href={authRequest.url} target="_self">
        {this._translations.nothingHappensLink}
      </Link>
    );

    return new Promise((resolve, reject) => {
      this.hideDialog = loginDialogService({
        url: authRequest.url,
        loader: true,
        onCancel: () => {
          // eslint-disable-next-line @typescript-eslint/no-use-before-define
          cleanUp();
          this.stop();
        },
        renderFallbackLink,
      });

      this.reject = reject;

      const removeTokenListener = this._storage.onTokenChange(token => {
        if (token) {
          // eslint-disable-next-line @typescript-eslint/no-use-before-define
          cleanUp();
          resolve(token.accessToken);
        }
      });

      const removeStateListener = this._storage.onStateChange(authRequest.stateId, state => {
        if (state && state.error) {
          // eslint-disable-next-line @typescript-eslint/no-use-before-define
          cleanUp();
          reject(new AuthResponseParser.AuthError(state));
        }
      });

      const cleanUp = () => {
        this.hideDialog?.();
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

  authorize(): Promise<string> {
    if (this._promise != null && this._loginWindow != null && !this._loginWindow.closed) {
      return this._promise;
    }

    this._promise = this._load();

    this._promise.then(this._reset, this._reset);

    return this._promise;
  }
}
