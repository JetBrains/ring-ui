import loginDialogService from '../login-dialog/service';

import AuthResponseParser from './response-parser';

export default class WindowFlow {
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
      {request_credentials: 'required'},
      {nonRedirect: true}
    );

    return new Promise((resolve, reject) => {

      this.reject = reject;

      const cleanUp = () => {
        /* eslint-disable no-use-before-define */
        hideDialog();
        removeStateListener();
        removeTokenListener();
        /* eslint-enable no-use-before-define */
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

      const hideDialog = loginDialogService({
        url: authRequest.url
      });
    });
  }

  _reset = () => {
    this._promise = null;
    this._loginWindow = null;
  };

  stop() {
    if (this._loginWindow !== null) {
      this._loginWindow.close();
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
