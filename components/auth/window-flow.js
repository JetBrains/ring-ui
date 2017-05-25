/* eslint-disable camelcase */

import AuthResponseParser from './response-parser';

const NAVBAR_HEIGHT = 50;

export default class WindowFlow {
  constructor(requestBuilder, storage) {
    this._requestBuilder = requestBuilder;
    this._storage = storage;
    this._reset();
  }

  /**
   * Opens window with the given URL
   * @param {string} url
   * @private
   */
  _openWindow(url) {
    const height = 700;
    const width = 750;
    const screenHalves = 2;
    const top = (window.screen.height - height - NAVBAR_HEIGHT) / screenHalves;
    const left = (window.screen.width - width) / screenHalves;

    return window.open(
      url,
      'HubLoginWindow',
      `height=${height}, width=${width}, left=${left}, top=${top}`
    );
  }

  /**
   * Initates authorization in window
   */
  async _load() {
    const authRequest = await this._requestBuilder.prepareAuthRequest(
      {request_credentials: 'required'},
      {nonRedirect: true}
    );

    return new Promise((resolve, reject) => {
      let cleanRun;

      const cleanUp = () => {
        if (cleanRun) {
          return;
        }
        cleanRun = true;
        /* eslint-disable no-use-before-define */
        removeStateListener();
        removeTokenListener();
        /* eslint-enable no-use-before-define */

        this._loginWindow.close();
      };

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

      if (this._loginWindow === null || this._loginWindow.closed === true) {
        this._loginWindow = this._openWindow(authRequest.url);
      } else {
        this._loginWindow.location = authRequest.url;
      }
    });
  }

  _reset = () => {
    this._promise = null;
    this._loginWindow = null;
  }

  stop() {
    if (this._loginWindow !== null) {
      this._loginWindow.close();
    }
    this._reset();
  }

  authorize() {
    if (this._promise !== null && this._loginWindow !== null && this._loginWindow.closed !== true) {
      this._loginWindow.focus();

      return this._promise;
    }

    this._promise = this._load();

    this._promise.then(this._reset, this._reset);

    return this._promise;
  }
}
