import AuthResponseParser from './response-parser';

/**
 * @const {number} non-interactive auth timeout
 */
const DEFAULT_TIMEOUT = 20 * 1000; // 20 sec in ms

export default class BackgroundFlow {
  constructor(requestBuilder, storage, timeout = DEFAULT_TIMEOUT) {
    this._requestBuilder = requestBuilder;
    this._storage = storage;
    this._timeout = timeout;
  }

  /**
   * Creates a hidden iframe
   * @return {HTMLIFrameElement}
   * @private
   */
  _createHiddenFrame() {
    const iframe = document.createElement('iframe');

    iframe.style.border = iframe.style.width = iframe.style.height = '0px';
    iframe.style.visibility = 'hidden';
    iframe.style.position = 'fixed';
    iframe.style.left = '-10000px';
    window.document.body.appendChild(iframe);

    return iframe;
  }

  /**
   * Redirects the given iframe to the given URL
   * @param {HTMLIFrameElement} iframe
   * @param {string} url
   * @private
   */
  _redirectFrame(iframe, url) {
    iframe.src = `${url}&rnd=${Math.random()}`;
  }

  /**
   * Refreshes the access token in an iframe.
   *
   * @return {Promise.<string>} promise that is resolved to access the token when it is loaded in a background iframe. The
   * promise is rejected if no token was received after {@link BackgroundToken.BACKGROUND_TIMEOUT} ms.
   */
  async _load() {
    const authRequest = await this._requestBuilder.
      prepareAuthRequest({requestCredentials: 'silent'}, {nonRedirect: true});

    return new Promise((resolve, reject) => {
      const iframe = this._createHiddenFrame();

      let cleanRun;

      const timeout = setTimeout(() => {
        reject(new Error('Auth Timeout'));
        cleanUp();
      }, this._timeout);

      const removeTokenListener = this._storage.onTokenChange(token => {
        if (token !== null) {
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

      function cleanUp() {
        if (cleanRun) {
          return;
        }
        cleanRun = true;
        clearTimeout(timeout);
        removeStateListener();
        removeTokenListener();
        window.document.body.removeChild(iframe);
      }

      this._redirectFrame(iframe, authRequest.url);
    });
  }

  authorize() {
    if (this._promise) {
      return this._promise;
    }

    const resetPromise = () => {
      this._promise = null;
    };

    this._promise = this._load();

    this._promise.then(resetPromise, resetPromise);

    return this._promise;
  }
}
