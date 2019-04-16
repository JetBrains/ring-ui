import AuthResponseParser from './response-parser';

export const HUB_AUTH_PAGE_OPENED = 'HUB_AUTH_PAGE_OPENED';

export default class BackgroundFlow {
  constructor(requestBuilder, storage, timeout) {
    this._requestBuilder = requestBuilder;
    this._storage = storage;
    this._timeout = timeout;
  }

  /**
   * Creates a hidden iframe
   * @return {HTMLIFrameElement}
   * @private
   */
  _createHiddenFrame(reject) {
    const iframe = document.createElement('iframe');

    iframe.style.border = iframe.style.width = iframe.style.height = '0px';
    iframe.style.visibility = 'hidden';
    iframe.style.position = 'fixed';
    iframe.style.left = '-10000px';
    iframe.onload = () => {
      if (!iframe.contentDocument) {
        reject('BackgroundFlow(@jetbrains/ring-ui): could not load iFrame. Check CORS configuration.');
      }
    };
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
      // eslint-disable-next-line camelcase
      prepareAuthRequest({request_credentials: 'silent'}, {nonRedirect: true});

    return new Promise((resolve, reject) => {
      function onMessage(e) {
        if (e.data === HUB_AUTH_PAGE_OPENED) {
          reject(new Error('Failed to obtain/refresh token in background'));
          cleanUp();
        }
      }

      window.addEventListener('message', onMessage);

      const iframe = this._createHiddenFrame(reject);

      let cleanRun;

      const timeout = setTimeout(() => {
        reject(new Error('Failed to refresh authorization'));
        cleanUp();
      }, this._timeout);

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

      function cleanUp() {
        if (cleanRun) {
          return;
        }
        cleanRun = true;
        clearTimeout(timeout);
        removeStateListener();
        removeTokenListener();
        window.removeEventListener('message', onMessage);
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
