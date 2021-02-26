import { d as _defineProperty, _ as _inherits, a as _createSuper, b as _classCallCheck, c as _createClass, l as _asyncToGenerator } from './_rollupPluginBabelHelpers-ab14fb00.js';
import ExtendableError from 'es6-error';
import { p as parseQueryString } from './url-a3cbb96f.js';

/**
 * @typedef {Object} AuthResponse
 * @property {?string} accessToken
 * @property {?string} state
 * @property {?string} token_type
 * @property {?string} expiresIn
 * @property {?string} scope
 * @property {?string} error
 */

var AuthResponseParser = /*#__PURE__*/function () {
  function AuthResponseParser() {
    _classCallCheck(this, AuthResponseParser);

    this._authResponse = this.readAuthResponseFromURL();
  }

  _createClass(AuthResponseParser, [{
    key: "getAuthResponseFromURL",

    /**
     * Check if the hash contains an access token.
     * If it does, return auth response. Otherwise return undefined.
     * Always clears the hash part of the URL.
     *
     * @throws {Error} if the auth server returned an error
     * @return {?AuthResponse}
     */
    value: function getAuthResponseFromURL() {
      return this.validateAuthResponse(this._authResponse);
    }
    /**
     * Validates given authResponse.
     * If it contains a token - returns the token, if an error is found - throws the error,
     * otherwise - null
     * Always clears the hash part of the URL.
     *
     * @param authResponse {AuthResponse} parsed authResponse
     * @throws {Error} if the auth server returned an error
     * @return {?AuthResponse}
     */

  }, {
    key: "validateAuthResponse",
    value: function validateAuthResponse(authResponse) {
      // Check for errors
      if (authResponse.error) {
        throw new AuthResponseParser.AuthError(authResponse);
      } // If there is no token in the hash


      if (!authResponse.accessToken) {
        return null;
      }

      return authResponse;
    }
    /**
     * Reads the current accessToken from the URL.
     * Doesn't modify URL
     *
     * @return {AuthResponse}
     */

  }, {
    key: "readAuthResponseFromURL",
    value: function readAuthResponseFromURL() {
      var authResponse = {};
      var rawAuthResponse = parseQueryString(this.getHash());
      Object.keys(rawAuthResponse).forEach(function (key) {
        if (key.indexOf('_') !== -1) {
          authResponse[AuthResponseParser.convertKey(key)] = rawAuthResponse[key];
          return;
        }

        authResponse[key] = rawAuthResponse[key];
      });
      return authResponse;
    }
    /**
     * @return {string} part of the URL after # sign.
     * @private
     */

  }, {
    key: "getHash",
    value: function getHash() {
      // Because of stupid Firefox bug — https://bugzilla.mozilla.org/show_bug.cgi?id=483304
      var location = this.getLocation();
      return location && location.replace(/^[^#]*#?/, '');
    }
    /**
     * Current page location.
     * @return {string}
     */

  }, {
    key: "getLocation",
    value: function getLocation() {
      return window.location.toString();
    }
  }], [{
    key: "convertKey",
    value: function convertKey(key) {
      return key.replace(/_([a-z])/g, function (_, letter) {
        return letter.toUpperCase();
      });
    }
  }]);

  return AuthResponseParser;
}();

_defineProperty(AuthResponseParser, "AuthError", /*#__PURE__*/function (_ExtendableError) {
  _inherits(AuthError, _ExtendableError);

  var _super = _createSuper(AuthError);

  // Supports weird IE 11 failing test issue
  function AuthError() {
    var _this;

    var authResponse = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, AuthError);

    _this = _super.call(this, authResponse.errorDescription);
    _this.code = authResponse.error;
    _this.uri = authResponse.errorUri;
    _this.stateId = authResponse.state;
    return _this;
  }

  return AuthError;
}(ExtendableError));

var HUB_AUTH_PAGE_OPENED = 'HUB_AUTH_PAGE_OPENED';

var BackgroundFlow = /*#__PURE__*/function () {
  function BackgroundFlow(requestBuilder, storage, timeout) {
    _classCallCheck(this, BackgroundFlow);

    this._requestBuilder = requestBuilder;
    this._storage = storage;
    this._timeout = timeout;
  }
  /**
   * Creates a hidden iframe
   * @return {HTMLIFrameElement}
   * @private
   */


  _createClass(BackgroundFlow, [{
    key: "_createHiddenFrame",
    value: function _createHiddenFrame() {
      var iframe = document.createElement('iframe');
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

  }, {
    key: "_redirectFrame",
    value: function _redirectFrame(iframe, url) {
      iframe.src = "".concat(url, "&rnd=").concat(Math.random());
    }
    /**
     * Refreshes the access token in an iframe.
     *
     * @return {Promise.<string>} promise that is resolved to access the token when it is loaded in a background iframe. The
     * promise is rejected if no token was received after {@link BackgroundToken.BACKGROUND_TIMEOUT} ms.
     */

  }, {
    key: "_load",
    value: function () {
      var _load2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        var _this = this;

        var authRequest;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return this._requestBuilder. // eslint-disable-next-line camelcase
                prepareAuthRequest({
                  request_credentials: 'silent'
                }, {
                  nonRedirect: true
                });

              case 2:
                authRequest = _context.sent;
                return _context.abrupt("return", new Promise(function (resolve, reject) {
                  function onMessage(e) {
                    if (e.data === HUB_AUTH_PAGE_OPENED) {
                      reject(new Error('Failed to obtain/refresh token in background'));
                      cleanUp();
                    }
                  }

                  window.addEventListener('message', onMessage);

                  var iframe = _this._createHiddenFrame();

                  var cleanRun;
                  var timeout = setTimeout(function () {
                    reject(new Error('Failed to refresh authorization'));
                    cleanUp();
                  }, _this._timeout);

                  var removeTokenListener = _this._storage.onTokenChange(function (token) {
                    if (token) {
                      cleanUp();
                      resolve(token.accessToken);
                    }
                  });

                  var removeStateListener = _this._storage.onStateChange(authRequest.stateId, function (state) {
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

                  _this._redirectFrame(iframe, authRequest.url);
                }));

              case 4:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function _load() {
        return _load2.apply(this, arguments);
      }

      return _load;
    }()
  }, {
    key: "authorize",
    value: function authorize() {
      var _this2 = this;

      if (this._promise) {
        return this._promise;
      }

      var resetPromise = function resetPromise() {
        _this2._promise = null;
      };

      this._promise = this._load();

      this._promise.then(resetPromise, resetPromise);

      return this._promise;
    }
  }]);

  return BackgroundFlow;
}();

export { AuthResponseParser as A, BackgroundFlow as B, HUB_AUTH_PAGE_OPENED as H };
