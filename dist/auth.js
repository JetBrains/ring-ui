import { c as _createClass, b as _classCallCheck, d as _defineProperty, l as _asyncToGenerator, k as _toConsumableArray, _ as _inherits, a as _createSuper, i as _objectSpread2 } from './_rollupPluginBabelHelpers-ab14fb00.js';
import { A as AuthResponseParser, B as BackgroundFlow } from './background-flow-9ba3b146.js';
import React from 'react';
import PropTypes from 'prop-types';
import alertService from './alert-service.js';
import Alert from './alert.js';
import Link from './link.js';
import Group from './group.js';
import styleInject from 'style-inject';
import { e as encodeURL, g as getAbsoluteBaseURL, f as fixUrl } from './url-a3cbb96f.js';
import HTTP, { CODE } from './http.js';
import ActualStorage from './storage.js';
import uuid from 'simply-uuid';
import ExtendableError from 'es6-error';
import 'react-dom';
import './get-uid-bf3ab014.js';
import 'classnames';
import '@jetbrains/icons/exception';
import '@jetbrains/icons/checkmark';
import '@jetbrains/icons/warning';
import '@jetbrains/icons/close';
import './icon.js';
import 'util-deprecate';
import './memoize-ad2c954c.js';
import './loader-inline.js';
import './theme-9a053da9.js';
import './data-tests-1a367745.js';
import 'conic-gradient';
import './dom-0ae85140.js';
import 'focus-visible';
import './clickableLink-3fc5662b.js';
import 'deep-equal';

var NAVBAR_HEIGHT = 50;
var CLOSED_CHECK_INTERVAL = 200;

var WindowFlow = /*#__PURE__*/function () {
  function WindowFlow(requestBuilder, storage) {
    var _this = this;

    _classCallCheck(this, WindowFlow);

    _defineProperty(this, "_timeoutId", null);

    _defineProperty(this, "checkIsClosed", function () {
      if (_this._loginWindow.closed) {
        _this.stop();

        return;
      }

      _this._timeoutId = setTimeout(_this.checkIsClosed, CLOSED_CHECK_INTERVAL);
    });

    _defineProperty(this, "_reset", function () {
      _this._promise = null;
      _this._loginWindow = null;
      clearTimeout(_this._timeoutId);
    });

    this._requestBuilder = requestBuilder;
    this._storage = storage;

    this._reset();
  }
  /**
   * Opens window with the given URL
   * @param {string} url
   * @private
   */


  _createClass(WindowFlow, [{
    key: "_openWindow",
    value: function _openWindow(url) {
      var height = 700;
      var width = 750;
      var screenHalves = 2;
      var top = (window.screen.height - height - NAVBAR_HEIGHT) / screenHalves;
      var left = (window.screen.width - width) / screenHalves;
      return window.open(url, 'HubLoginWindow', "height=".concat(height, ", width=").concat(width, ", left=").concat(left, ", top=").concat(top));
    }
    /**
     * Initiates authorization in window
     */

  }, {
    key: "_load",
    value: function () {
      var _load2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        var _this2 = this;

        var authRequest;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return this._requestBuilder.prepareAuthRequest( // eslint-disable-next-line camelcase
                {
                  request_credentials: 'required',
                  auth_mode: 'bypass_to_login'
                }, {
                  nonRedirect: true
                });

              case 2:
                authRequest = _context.sent;
                return _context.abrupt("return", new Promise(function (resolve, reject) {
                  _this2.reject = reject;
                  var cleanRun;

                  var cleanUp = function cleanUp() {
                    if (cleanRun) {
                      return;
                    }

                    cleanRun = true;
                    /* eslint-disable no-use-before-define */

                    removeStateListener();
                    removeTokenListener();
                    /* eslint-enable no-use-before-define */

                    _this2._loginWindow.close();

                    clearTimeout(_this2._timeoutId);
                  };

                  var removeTokenListener = _this2._storage.onTokenChange(function (token) {
                    if (token) {
                      cleanUp();
                      resolve(token.accessToken);
                    }
                  });

                  var removeStateListener = _this2._storage.onStateChange(authRequest.stateId, function (state) {
                    if (state && state.error) {
                      cleanUp();
                      reject(new AuthResponseParser.AuthError(state));
                    }
                  });

                  if (_this2._loginWindow === null || _this2._loginWindow.closed === true) {
                    _this2._loginWindow = _this2._openWindow(authRequest.url);
                  } else {
                    _this2._loginWindow.location = authRequest.url;
                  }

                  _this2.checkIsClosed();
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
    key: "stop",
    value: function stop() {
      if (this._loginWindow !== null) {
        this._loginWindow.close();
      }

      if (this.reject) {
        this.reject('Authorization window closed');
      }

      this._reset();
    }
  }, {
    key: "authorize",
    value: function authorize() {
      if (this._promise !== null && this._loginWindow !== null && this._loginWindow.closed !== true) {
        this._loginWindow.focus();

        return this._promise;
      }

      this._promise = this._load();

      this._promise.then(this._reset, this._reset);

      return this._promise;
    }
  }]);

  return WindowFlow;
}();

var css_248z = "/* https://readymag.com/artemtiunov/RingUILanguage/colours/ *//*\nUnit shouldn't be CSS custom property because it is not intended to change\nAlso it won't form in FF47 https://bugzilla.mozilla.org/show_bug.cgi?id=594933\n*/.global_clearfix__1FS6o {\n  &::after {\n    display: block;\n    clear: both;\n\n    content: '';\n  }\n}.global_font__2H0e4 {\n  font-family: var(--ring-font-family);\n  font-size: var(--ring-font-size);\n  line-height: var(--ring-line-height);\n}.global_font-lower__11Bp7 {\n\n  line-height: var(--ring-line-height-lower);\n}.global_font-smaller__2YCID {\n\n  font-size: var(--ring-font-size-smaller);\n}.global_font-smaller-lower__33Wmu {\n\n  line-height: var(--ring-line-height-lowest);\n}.global_font-larger-lower__2rrRR {\n\n  font-size: var(--ring-font-size-larger);\n}.global_font-larger__1-iV9 {\n\n  line-height: var(--ring-line-height-taller);\n}/* To be used at large sizes *//* As close as possible to Helvetica Neue Thin (to replace Gotham) */.global_thin-font__1F7aK {\n  font-family: \"Segoe UI\", \"Helvetica Neue\", Helvetica, Arial, sans-serif;\n  font-size: var(--ring-font-size);\n  font-weight: 100; /* Renders Helvetica Neue UltraLight on OS X  */\n}.global_monospace-font__1XOVq {\n  font-family: var(--ring-font-family-monospace);\n  font-size: var(--ring-font-size-smaller);\n}.global_ellipsis__xhH6M {\n  overflow: hidden;\n\n  white-space: nowrap;\n  text-overflow: ellipsis;\n}.global_resetButton__WQfrm {\n  overflow: visible;\n\n  padding: 0;\n\n  text-align: left;\n\n  color: inherit;\n  border: 0;\n\n  background-color: transparent;\n\n  font: inherit;\n\n  &::-moz-focus-inner {\n    padding: 0;\n\n    border: 0;\n  }\n}/* Note: footer also has top margin which isn't taken into account here *//* Media breakpoints (minimal values) *//* Media queries */\n\n/* stylelint-disable color-no-hex */\n\n:root {\n  --ring-unit: 8px;\n\n  /* Element */\n  --ring-line-color: #dfe5eb;\n  --ring-dark-line-color: #475159;\n  --ring-borders-color: #b8d1e5;\n  --ring-dark-borders-color: #406380;\n  --ring-icon-color: var(--ring-borders-color);\n  --ring-icon-secondary-color: #999;\n  --ring-border-disabled-color: #dbdbdb;\n  --ring-icon-disabled-color: #bbb;\n  --ring-border-hover-color: #80c6ff;\n  --ring-dark-border-hover-color: #70b1e6;\n  --ring-icon-hover-color: var(--ring-link-hover-color);\n  --ring-main-color: #008eff;\n  --ring-main-hover-color: #007ee5;\n  --ring-icon-error-color: #db5860;\n  --ring-icon-warning-color: #eda200;\n  --ring-icon-success-color: #59a869;\n  --ring-pale-control-color: #cfdbe5;\n  --ring-popup-border-components: 0, 42, 76;\n  --ring-popup-border-color: rgba(var(--ring-popup-border-components), 0.1);\n  --ring-popup-shadow-color: rgba(var(--ring-popup-border-components), 0.15);\n  --ring-message-shadow-color: rgba(var(--ring-popup-border-components), 0.3);\n  --ring-pinned-shadow-color: #737577;\n\n  /* Text */\n  --ring-search-color: #669ecc;\n  --ring-hint-color: #406380;\n  --ring-link-color: #0f5b99;\n  --ring-link-hover-color: #ff008c;\n  --ring-error-color: #c22731;\n  --ring-warning-color: #cc8b00;\n  --ring-success-color: #1b8833;\n  --ring-text-color: #1f2326;\n  --ring-dark-text-color: #fff;\n  --ring-heading-color: var(--ring-text-color);\n  --ring-secondary-color: #737577;\n  --ring-dark-secondary-color: #888;\n  --ring-disabled-color: #999;\n  --ring-dark-disabled-color: #444;\n  --ring-dark-active-color: #ccc;\n\n  /* Background */\n  --ring-content-background-color: #fff;\n  --ring-popup-background-color: #fff;\n  --ring-sidebar-background-color: #f7f9fa;\n  --ring-selected-background-color: #d4edff;\n  --ring-hover-background-color: #ebf6ff;\n  --ring-dark-selected-background-color: #002a4d;\n  --ring-message-background-color: #111314;\n  --ring-navigation-background-color: #000;\n  --ring-tag-background-color: #e6ecf2;\n  --ring-removed-background-color: #ffd5cb;\n  --ring-warning-background-color: #faeccd;\n  --ring-added-background-color: #bce8bb;\n\n  /* Code */\n  --ring-code-background-color: var(--ring-content-background-color);\n  --ring-code-color: #000;\n  --ring-code-comment-color: #707070;\n  --ring-code-meta-color: #707070;\n  --ring-code-keyword-color: #000080;\n  --ring-code-tag-background-color: #efefef;\n  --ring-code-tag-color: var(--ring-code-keyword-color);\n  --ring-code-tag-font-weight: bold;\n  --ring-code-field-color: #660e7a;\n  --ring-code-attribute-color: #00f;\n  --ring-code-number-color: var(--ring-code-attribute-color);\n  --ring-code-string-color: #007a00;\n  --ring-code-addition-color: #aadeaa;\n  --ring-code-deletion-color: #c8c8c8;\n\n  /* Metrics */\n  --ring-border-radius: 3px;\n  --ring-border-radius-small: 2px;\n  --ring-font-size-larger: 14px;\n  --ring-font-size: 13px;\n  --ring-font-size-smaller: 12px;\n  --ring-line-height-taller: 21px;\n  --ring-line-height: 20px;\n  --ring-line-height-lower: 18px;\n  --ring-line-height-lowest: 16px;\n  --ring-ease: 0.3s ease-out;\n  --ring-fast-ease: 0.15s ease-out;\n  --ring-font-family: system-ui, -apple-system, Segoe UI, Roboto, Noto Sans, Ubuntu, Cantarell, Helvetica Neue, Arial, sans-serif;\n  --ring-font-family-monospace: Menlo, \"Bitstream Vera Sans Mono\", \"Ubuntu Mono\", Consolas, \"Courier New\", Courier, monospace;\n\n  /* Common z-index-values */\n\n  /* Invisible element is an absolutely positioned element which should be below */\n  /* all other elements on the page */\n  --ring-invisible-element-z-index: -1;\n\n  /* z-index for position: fixed elements */\n  --ring-fixed-z-index: 1;\n\n  /* Elements that should overlay all other elements on the page */\n  --ring-overlay-z-index: 5;\n\n  /* Alerts should de displayed above overlays */\n  --ring-alert-z-index: 6;\n}\n\n.down-notification_title__2YZLa {\n  font-weight: 600;\n}\n\n.down-notification_error__aEWcC {\n  margin-top: 4px;\n\n  word-wrap: break-word;\n\n  color: #ccc;\n\n  color: var(--ring-dark-active-color);\n\n  line-height: 16px;\n}\n";
var styles = {"unit":"8px","title":"down-notification_title__2YZLa","error":"down-notification_error__aEWcC"};
styleInject(css_248z);

var key = null;

function renderAlert(message) {
  var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : Alert.Type.WARNING;
  var existingAlert = alertService.showingAlerts.filter(function (alert) {
    return alert.key === key;
  })[0];

  if (!existingAlert) {
    key = alertService.addAlert(message, type, 0, {
      closeable: false
    });
  } else {
    existingAlert.message = message;
    existingAlert.type = type;
    alertService.renderAlerts();
  }
}

function Message(_ref) {
  var translations = _ref.translations,
      onCheckAgain = _ref.onCheckAgain;
  var backendIsNotAvailable = translations.backendIsNotAvailable,
      checkAgain = translations.checkAgain,
      errorMessage = translations.errorMessage;
  return /*#__PURE__*/React.createElement("div", {
    "data-test": "ring-backend-down-notification"
  }, /*#__PURE__*/React.createElement(Group, null, /*#__PURE__*/React.createElement("div", {
    className: styles.title
  }, backendIsNotAvailable)), /*#__PURE__*/React.createElement("span", {
    className: styles.error
  }, errorMessage, " "), /*#__PURE__*/React.createElement(Link, {
    onClick: onCheckAgain,
    "data-test": "check-again"
  }, checkAgain));
}

Message.propTypes = {
  translations: PropTypes.shape({
    backendIsNotAvailable: PropTypes.string,
    checkAgain: PropTypes.string,
    errorMessage: PropTypes.string
  }),
  onCheckAgain: PropTypes.func
};
function onBackendDown(_ref2) {
  var onCheckAgain = _ref2.onCheckAgain,
      translations = _ref2.translations;

  function checkAgainWithoutClosing(_x) {
    return _checkAgainWithoutClosing.apply(this, arguments);
  }

  function _checkAgainWithoutClosing() {
    _checkAgainWithoutClosing = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(e) {
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              // Alert has weird behaviour of handling clicks by "a" tags
              e.stopPropagation();
              _context.prev = 1;
              renderAlert('Connecting...', Alert.Type.LOADING);
              _context.next = 5;
              return onCheckAgain();

            case 5:
              _context.next = 10;
              break;

            case 7:
              _context.prev = 7;
              _context.t0 = _context["catch"](1);
              renderAlert( /*#__PURE__*/React.createElement(Message, {
                translations: translations,
                onCheckAgain: checkAgainWithoutClosing
              }));

            case 10:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, null, [[1, 7]]);
    }));
    return _checkAgainWithoutClosing.apply(this, arguments);
  }

  renderAlert( /*#__PURE__*/React.createElement(Message, {
    translations: translations,
    onCheckAgain: checkAgainWithoutClosing
  }));
  return function () {
    return alertService.remove(key);
  };
}

var Listeners = /*#__PURE__*/function () {
  function Listeners() {
    _classCallCheck(this, Listeners);

    this.removeAll();
  }

  _createClass(Listeners, [{
    key: "trigger",
    value: function trigger(event, data) {
      var handlers = this._all.get(event);

      if (handlers) {
        return Promise.all(_toConsumableArray(handlers).map(function (fn) {
          return fn(data);
        }));
      }

      return Promise.resolve([]);
    }
  }, {
    key: "add",
    value: function add(event, handler) {
      var handlers = this._all.get(event);

      if (!handlers) {
        handlers = new Set();

        this._all.set(event, handlers);
      }

      handlers.add(handler);
    }
  }, {
    key: "remove",
    value: function remove(event, handler) {
      var handlers = this._all.get(event);

      if (handlers) {
        handlers.delete(handler);
      }
    }
  }, {
    key: "removeAll",
    value: function removeAll() {
      this._all = new Map();
    }
  }]);

  return Listeners;
}();

// Useful for using fetch with timeout
// https://github.com/github/fetch/issues/175#issuecomment-284787564
function promiseWithTimeout(promise, timeout, _ref) {
  var error = _ref.error;
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      return reject(error || new Error('Timeout'));
    }, timeout);
    promise.then(resolve, reject);
  });
}

/**
 * @typedef {Object} StoredToken
 * @property {string} accessToken
 * @property {string[]} scopes
 * @property {number} expires
 */

/**
 * @typedef {Object} StoredState
 * @property {Date} created
 * @property {string} restoreLocation
 * @property {string[]} scopes
 */

var DEFAULT_STATE_QUOTA = 102400; // 100 kb ~~ 200 tabs with a large list of scopes
// eslint-disable-next-line no-magic-numbers

var DEFAULT_STATE_TTL = 1000 * 60 * 60 * 24; // nobody will need auth state after a day

var UPDATE_USER_TIMEOUT = 1000;

var AuthStorage = /*#__PURE__*/function () {
  /**
   * Custom storage for Auth
   * @param {{stateKeyPrefix: string, tokenKey: string, onTokenRemove: Function}} config
   */
  function AuthStorage(config) {
    _classCallCheck(this, AuthStorage);

    this.messagePrefix = config.messagePrefix || '';
    this.stateKeyPrefix = config.stateKeyPrefix;
    this.tokenKey = config.tokenKey;
    this.userKey = config.userKey || 'user-key';
    this.stateTTL = config.stateTTL || DEFAULT_STATE_TTL;
    this._lastMessage = null;
    var StorageConstructor = config.storage || ActualStorage;
    this.stateQuota = Math.min(config.stateQuota || DEFAULT_STATE_QUOTA, StorageConstructor.QUOTA || Infinity);
    this._stateStorage = new StorageConstructor({
      cookieName: 'ring-state'
    });
    this._tokenStorage = new StorageConstructor({
      cookieName: 'ring-token'
    });
    this._messagesStorage = new StorageConstructor({
      cookieName: 'ring-message'
    });
    this._currentUserStorage = new StorageConstructor({
      cookieName: 'ring-user'
    });
  }
  /**
   * Add token change listener
   * @param {function(string)} fn Token change listener
   * @return {function()} remove listener function
   */


  _createClass(AuthStorage, [{
    key: "onTokenChange",
    value: function onTokenChange(fn) {
      return this._tokenStorage.on(this.tokenKey, fn);
    }
    /**
     * Add state change listener
     * @param {string} stateKey State key
     * @param {function(string)} fn State change listener
     * @return {function()} remove listener function
     */

  }, {
    key: "onStateChange",
    value: function onStateChange(stateKey, fn) {
      return this._stateStorage.on(this.stateKeyPrefix + stateKey, fn);
    }
    /**
     * Add state change listener
     * @param {string} key State key
     * @param {function(string)} fn State change listener
     * @return {function()} remove listener function
     */

  }, {
    key: "onMessage",
    value: function onMessage(key, fn) {
      return this._messagesStorage.on(this.messagePrefix + key, function (message) {
        return fn(message);
      });
    }
  }, {
    key: "sendMessage",
    value: function sendMessage(key) {
      var message = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      this._lastMessage = message;

      this._messagesStorage.set(this.messagePrefix + key, message);
    }
    /**
     * Save authentication request state.
     *
     * @param {string} id Unique state identifier
     * @param {StoredState} state State to store
     * @param {boolean=} dontCleanAndRetryOnFail If falsy then remove all stored states and try again to save state
     */

  }, {
    key: "saveState",
    value: function () {
      var _saveState = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(id, state, dontCleanAndRetryOnFail) {
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                state.created = Date.now();
                _context.prev = 1;
                _context.next = 4;
                return this._stateStorage.set(this.stateKeyPrefix + id, state);

              case 4:
                _context.next = 15;
                break;

              case 6:
                _context.prev = 6;
                _context.t0 = _context["catch"](1);

                if (dontCleanAndRetryOnFail) {
                  _context.next = 14;
                  break;
                }

                _context.next = 11;
                return this.cleanStates();

              case 11:
                return _context.abrupt("return", this.saveState(id, state, true));

              case 14:
                throw _context.t0;

              case 15:
                return _context.abrupt("return", undefined);

              case 16:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this, [[1, 6]]);
      }));

      function saveState(_x, _x2, _x3) {
        return _saveState.apply(this, arguments);
      }

      return saveState;
    }()
    /**
     * Remove all stored states
     *
     * @return {Promise} promise that is resolved when OLD states [and some selected] are removed
     */

  }, {
    key: "cleanStates",
    value: function () {
      var _cleanStates = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(removeStateId) {
        var _this = this;

        var now, removalResult, currentStates, stateStorageSize, removalPromises;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                now = Date.now();
                _context2.next = 3;
                return this._stateStorage.each(function (key, state) {
                  // Remove requested state
                  if (key === _this.stateKeyPrefix + removeStateId) {
                    return _this._stateStorage.remove(key);
                  }

                  if (key.indexOf(_this.stateKeyPrefix) === 0) {
                    // Clean old states
                    if (state.created + _this.stateTTL < now) {
                      return _this._stateStorage.remove(key);
                    } // Data to clean up due quota


                    return {
                      key: key,
                      created: state.created,
                      size: JSON.stringify(state).length
                    };
                  }

                  return undefined;
                });

              case 3:
                removalResult = _context2.sent;
                currentStates = removalResult.filter(function (state) {
                  return state;
                });
                stateStorageSize = currentStates.reduce(function (overallSize, state) {
                  return state.size + overallSize;
                }, 0);

                if (!(stateStorageSize > this.stateQuota)) {
                  _context2.next = 10;
                  break;
                }

                currentStates.sort(function (a, b) {
                  return a.created > b.created;
                });
                removalPromises = currentStates.filter(function (state) {
                  if (stateStorageSize > _this.stateQuota) {
                    stateStorageSize -= state.size;
                    return true;
                  }

                  return false;
                }).map(function (state) {
                  return _this._stateStorage.remove(state.key);
                });
                return _context2.abrupt("return", removalPromises.length && Promise.all(removalPromises));

              case 10:
                return _context2.abrupt("return", undefined);

              case 11:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function cleanStates(_x4) {
        return _cleanStates.apply(this, arguments);
      }

      return cleanStates;
    }()
    /**
     * Get state by id and remove stored states from the storage.
     *
     * @param {string} id unique state identifier
     * @return {Promise.<StoredState>}
     */

  }, {
    key: "getState",
    value: function () {
      var _getState = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(id) {
        var result;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.prev = 0;
                _context3.next = 3;
                return this._stateStorage.get(this.stateKeyPrefix + id);

              case 3:
                result = _context3.sent;
                _context3.next = 6;
                return this.cleanStates(id);

              case 6:
                return _context3.abrupt("return", result);

              case 9:
                _context3.prev = 9;
                _context3.t0 = _context3["catch"](0);
                _context3.next = 13;
                return this.cleanStates(id);

              case 13:
                throw _context3.t0;

              case 14:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this, [[0, 9]]);
      }));

      function getState(_x5) {
        return _getState.apply(this, arguments);
      }

      return getState;
    }()
    /**
     * @param {StoredToken} token
     * @return {Promise} promise that is resolved when the token is saved
     */

  }, {
    key: "saveToken",
    value: function saveToken(token) {
      return this._tokenStorage.set(this.tokenKey, token);
    }
    /**
     * @return {Promise.<StoredToken>} promise that is resolved to the stored token
     */

  }, {
    key: "getToken",
    value: function getToken() {
      return this._tokenStorage.get(this.tokenKey);
    }
    /**
     * Remove stored token if any.
     * @return {Promise} promise that is resolved when the token is wiped.
     */

  }, {
    key: "wipeToken",
    value: function wipeToken() {
      return this._tokenStorage.remove(this.tokenKey);
    }
    /**
     * @param {function} loadUser user loader
     * @return {Promise.<object>>} promise that is resolved to stored current user
     */

  }, {
    key: "getCachedUser",
    value: function () {
      var _getCachedUser = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(loadUser) {
        var _this2 = this;

        var user, loadAndCache;
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                _context4.next = 2;
                return this._currentUserStorage.get(this.userKey);

              case 2:
                user = _context4.sent;

                loadAndCache = function loadAndCache() {
                  return loadUser().then(function (response) {
                    _this2._currentUserStorage.set(_this2.userKey, response);

                    return response;
                  });
                };

                if (!(user && user.id)) {
                  _context4.next = 9;
                  break;
                }

                setTimeout(loadAndCache, UPDATE_USER_TIMEOUT);
                return _context4.abrupt("return", user);

              case 9:
                return _context4.abrupt("return", loadAndCache());

              case 10:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function getCachedUser(_x6) {
        return _getCachedUser.apply(this, arguments);
      }

      return getCachedUser;
    }()
    /**
     * Remove cached user if any
     */

  }, {
    key: "wipeCachedCurrentUser",
    value: function wipeCachedCurrentUser() {
      return this._currentUserStorage.remove(this.userKey);
    }
    /**
     * Wipes cache if user has changed
     */

  }, {
    key: "onUserChanged",
    value: function onUserChanged() {
      this.wipeCachedCurrentUser();
    }
  }]);

  return AuthStorage;
}();

var AuthRequestBuilder = /*#__PURE__*/function () {
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
  function AuthRequestBuilder(config, storage) {
    _classCallCheck(this, AuthRequestBuilder);

    this.config = config;
    this.storage = storage;
  }
  /**
   * @return {string} random string used for state
   */


  _createClass(AuthRequestBuilder, [{
    key: "prepareAuthRequest",

    /**
     * Save state and build an auth server redirect URL.
     *
     * @param {object=} extraParams additional query parameters for auth request
     * @param {object=} extraState additional state parameters to save
     * @return {Promise.<string>} promise that is resolved to authURL
     */
    value: function () {
      var _prepareAuthRequest = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(extraParams, extraState) {
        var stateId, scopes, request, authURL, state;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                stateId = AuthRequestBuilder._uuid();
                scopes = this.config.scopes.map(function (scope) {
                  return encodeURIComponent(scope);
                });
                /* eslint-disable camelcase */

                request = Object.assign({
                  response_type: 'token',
                  state: stateId,
                  redirect_uri: this.config.redirectUri,
                  request_credentials: this.config.requestCredentials,
                  client_id: this.config.clientId,
                  scope: scopes.join(' ')
                }, extraParams || {});
                /* eslint-enable camelcase */

                authURL = encodeURL(this.config.authorization, request);
                state = Object.assign({
                  restoreLocation: window.location.href,
                  scopes: this.config.scopes
                }, extraState || {});
                _context.next = 7;
                return this._saveState(stateId, state);

              case 7:
                return _context.abrupt("return", {
                  url: authURL,
                  stateId: stateId
                });

              case 8:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function prepareAuthRequest(_x, _x2) {
        return _prepareAuthRequest.apply(this, arguments);
      }

      return prepareAuthRequest;
    }()
    /**
     * @param {string} id
     * @param {StoredState} storedState
     * @return {Promise}
     * @private
     */

  }, {
    key: "_saveState",
    value: function _saveState(id, storedState) {
      return this.storage.saveState(id, storedState);
    }
  }]);

  return AuthRequestBuilder;
}();

_defineProperty(AuthRequestBuilder, "_uuid", uuid.generate);

var TokenValidator = /*#__PURE__*/function () {
  function TokenValidator(config, getUser, storage) {
    _classCallCheck(this, TokenValidator);

    this._getUser = getUser;
    this._config = config;
    this._storage = storage;
  }
  /**
   * Returns epoch - seconds since 1970.
   * Used for calculation of expire times.
   * @return {number} epoch, seconds since 1970
   * @private
   */


  _createClass(TokenValidator, [{
    key: "validateTokenLocally",

    /**
     * Check token validity against all conditions.
     * @returns {Promise.<string>}
     */
    value: function validateTokenLocally() {
      return this._getValidatedToken([TokenValidator._validateExistence, TokenValidator._validateExpiration, this._validateScopes.bind(this)]);
    }
    /**
     * Check token validity against all conditions.
     * @returns {Promise.<string>}
     */

  }, {
    key: "validateToken",
    value: function validateToken() {
      return this._getValidatedToken([TokenValidator._validateExistence, TokenValidator._validateExpiration, this._validateScopes.bind(this), this._validateAgainstUser.bind(this)]);
    }
    /**
     * Check if there is a token
     * @param {StoredToken} storedToken
     * @return {Promise.<StoredToken>}
     * @private
     */

  }, {
    key: "_validateScopes",

    /**
     * Check scopes
     * @param {StoredToken} storedToken
     * @return {Promise.<StoredToken>}
     * @private
     */
    value: function _validateScopes(storedToken) {
      var _this$_config = this._config,
          scope = _this$_config.scope,
          optionalScopes = _this$_config.optionalScopes;
      var requiredScopes = optionalScopes ? scope.filter(function (scopeId) {
        return !optionalScopes.includes(scopeId);
      }) : scope;
      var hasAllScopes = requiredScopes.every(function (scopeId) {
        return storedToken.scopes.includes(scopeId);
      });

      if (!hasAllScopes) {
        throw new TokenValidator.TokenValidationError('Token doesn\'t match required scopes');
      }
    }
    /**
     * Check by error code if token should be refreshed
     * @param {string} error
     * @return {boolean}
     */

  }, {
    key: "_validateAgainstUser",

    /**
     * Check scopes
     * @param {StoredToken} storedToken
     * @return {Promise.<StoredToken>}
     * @private
     */
    value: function () {
      var _validateAgainstUser2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(storedToken) {
        var response;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.prev = 0;
                _context.next = 3;
                return this._getUser(storedToken.accessToken);

              case 3:
                return _context.abrupt("return", _context.sent);

              case 6:
                _context.prev = 6;
                _context.t0 = _context["catch"](0);
                response = {};
                _context.prev = 9;
                _context.next = 12;
                return _context.t0.response.json();

              case 12:
                response = _context.sent;
                _context.next = 17;
                break;

              case 15:
                _context.prev = 15;
                _context.t1 = _context["catch"](9);

              case 17:
                if (!(_context.t0.status === CODE.UNAUTHORIZED || TokenValidator.shouldRefreshToken(response.error))) {
                  _context.next = 19;
                  break;
                }

                throw new TokenValidator.TokenValidationError(response.error || _context.t0.message);

              case 19:
                throw _context.t0;

              case 20:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this, [[0, 6], [9, 15]]);
      }));

      function _validateAgainstUser(_x) {
        return _validateAgainstUser2.apply(this, arguments);
      }

      return _validateAgainstUser;
    }()
    /**
     * Token Validator function
     * @typedef {(function(StoredToken): Promise<StoredToken>)} TokenValidator
     */

    /**
     * Gets stored token and applies provided validators
     * @param {TokenValidator[]} validators An array of validation
     * functions to check the stored token against.
     * @return {Promise.<string>} promise that is resolved to access token if the stored token is valid. If it is
     * invalid then the promise is rejected. If invalid token should be re-requested then rejection object will
     * have {authRedirect: true}.
     * @private
     */

  }, {
    key: "_getValidatedToken",
    value: function () {
      var _getValidatedToken2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(validators) {
        var storedToken, i;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return this._storage.getToken();

              case 2:
                storedToken = _context2.sent;
                i = 0;

              case 4:
                if (!(i < validators.length)) {
                  _context2.next = 10;
                  break;
                }

                _context2.next = 7;
                return validators[i](storedToken);

              case 7:
                i++;
                _context2.next = 4;
                break;

              case 10:
                return _context2.abrupt("return", storedToken.accessToken);

              case 11:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function _getValidatedToken(_x2) {
        return _getValidatedToken2.apply(this, arguments);
      }

      return _getValidatedToken;
    }()
  }], [{
    key: "_epoch",
    value: function _epoch() {
      var milliseconds = 1000.0;
      return Math.round(Date.now() / milliseconds);
    }
    /**
     * @const {number}
     */
    // eslint-disable-next-line no-magic-numbers

  }, {
    key: "_validateExistence",
    value: function _validateExistence(storedToken) {
      if (!storedToken || !storedToken.accessToken) {
        throw new TokenValidator.TokenValidationError('Token not found');
      }
    }
    /**
     * Check expiration
     * @param {StoredToken} storedToken
     * @return {Promise.<StoredToken>}
     * @private
     */

  }, {
    key: "_validateExpiration",
    value: function _validateExpiration(_ref) {
      var expires = _ref.expires,
          lifeTime = _ref.lifeTime;
      var REFRESH_BEFORE_RATIO = 6;
      var refreshBefore = lifeTime ? Math.ceil(lifeTime / REFRESH_BEFORE_RATIO) : TokenValidator.DEFAULT_REFRESH_BEFORE;

      if (expires && expires < TokenValidator._epoch() + refreshBefore) {
        throw new TokenValidator.TokenValidationError('Token expired');
      }
    }
  }, {
    key: "shouldRefreshToken",
    value: function shouldRefreshToken(error) {
      return error === 'invalid_grant' || error === 'invalid_request' || error === 'invalid_token';
    }
  }]);

  return TokenValidator;
}();

_defineProperty(TokenValidator, "DEFAULT_REFRESH_BEFORE", 10 * 60);

_defineProperty(TokenValidator, "TokenValidationError", /*#__PURE__*/function (_ExtendableError) {
  _inherits(TokenValidationError, _ExtendableError);

  var _super = _createSuper(TokenValidationError);

  function TokenValidationError(message, cause) {
    var _this;

    _classCallCheck(this, TokenValidationError);

    _this = _super.call(this, message);
    _this.cause = cause;
    _this.authRedirect = true;
    return _this;
  }

  return TokenValidationError;
}(ExtendableError));

/* eslint-disable no-magic-numbers */

var DEFAULT_EXPIRES_TIMEOUT = 40 * 60;
var DEFAULT_BACKGROUND_TIMEOUT = 10 * 1000;
var DEFAULT_BACKEND_CHECK_TIMEOUT = 10 * 1000;
var BACKGROUND_REDIRECT_TIMEOUT = 20 * 1000;
/* eslint-enable no-magic-numbers */

var USER_CHANGED_EVENT = 'userChange';
var DOMAIN_USER_CHANGED_EVENT = 'domainUser';
var LOGOUT_EVENT = 'logout';
var LOGOUT_POSTPONED_EVENT = 'logoutPostponed';
var USER_CHANGE_POSTPONED_EVENT = 'changePostponed';

function noop() {}

var DEFAULT_CONFIG = {
  cacheCurrentUser: false,
  reloadOnUserChange: true,
  embeddedLogin: false,
  EmbeddedLoginFlow: null,
  clientId: '0-0-0-0-0',
  redirectUri: getAbsoluteBaseURL(),
  redirect: false,
  requestCredentials: 'default',
  backgroundRefreshTimeout: null,
  scope: [],
  userFields: ['guest', 'id', 'name', 'login', 'profile/avatar/url'],
  cleanHash: true,
  onLogout: noop,
  onPostponeChangedUser: function onPostponeChangedUser() {},
  onPostponeLogout: function onPostponeLogout() {},
  enableBackendStatusCheck: true,
  backendCheckTimeout: DEFAULT_BACKEND_CHECK_TIMEOUT,
  checkBackendIsUp: function checkBackendIsUp() {
    return Promise.resolve(null);
  },
  onBackendDown: function onBackendDown() {},
  defaultExpiresIn: DEFAULT_EXPIRES_TIMEOUT,
  translations: {
    login: 'Log in',
    loginTo: 'Log in to %serviceName%',
    cancel: 'Cancel',
    postpone: 'Postpone',
    youHaveLoggedInAs: 'You have logged in as another user: %userName%',
    applyChange: 'Apply change',
    backendIsNotAvailable: 'Connection lost',
    checkAgain: 'try again',
    nothingHappensLink: 'Click here if nothing happens',
    errorMessage: 'There may be a problem with your network connection. Make sure that you are online and'
  }
};

var Auth = /*#__PURE__*/function () {
  function Auth(config) {
    var _this = this;

    _classCallCheck(this, Auth);

    _defineProperty(this, "config", {});

    _defineProperty(this, "listeners", new Listeners());

    _defineProperty(this, "http", null);

    _defineProperty(this, "_service", {});

    _defineProperty(this, "_storage", null);

    _defineProperty(this, "_responseParser", new AuthResponseParser());

    _defineProperty(this, "_requestBuilder", null);

    _defineProperty(this, "_backgroundFlow", null);

    _defineProperty(this, "_embeddedFlow", null);

    _defineProperty(this, "_tokenValidator", null);

    _defineProperty(this, "_postponed", false);

    _defineProperty(this, "_backendCheckPromise", null);

    _defineProperty(this, "_authDialogService", undefined);

    if (!config) {
      throw new Error('Config is required');
    }

    if (config.serverUri == null) {
      throw new Error('\"serverUri\" property is required');
    }

    var unsupportedParams = ['redirect_uri', 'request_credentials', 'client_id'].filter(function (param) {
      return config.hasOwnProperty(param);
    });

    if (unsupportedParams.length !== 0) {
      throw new Error("The following parameters are no longer supported: ".concat(unsupportedParams.join(', '), ". Please change them from snake_case to camelCase."));
    }

    config.userFields = config.userFields || [];
    this.config = _objectSpread2(_objectSpread2({}, Auth.DEFAULT_CONFIG), config);
    var _this$config = this.config,
        clientId = _this$config.clientId,
        redirect = _this$config.redirect,
        redirectUri = _this$config.redirectUri,
        requestCredentials = _this$config.requestCredentials,
        scope = _this$config.scope;
    var serverUriLength = this.config.serverUri.length;

    if (serverUriLength > 0 && this.config.serverUri.charAt(serverUriLength - 1) !== '/') {
      this.config.serverUri += '/';
    }

    this.config.userParams = {
      query: {
        fields: _toConsumableArray(new Set(Auth.DEFAULT_CONFIG.userFields.concat(config.userFields))).join()
      }
    };

    if (!scope.includes(Auth.DEFAULT_CONFIG.clientId)) {
      scope.push(Auth.DEFAULT_CONFIG.clientId);
    }

    this._storage = new AuthStorage({
      messagePrefix: "".concat(clientId, "-message-"),
      stateKeyPrefix: "".concat(clientId, "-states-"),
      tokenKey: "".concat(clientId, "-token"),
      userKey: "".concat(clientId, "-user-")
    });
    this._domainStorage = new AuthStorage({
      messagePrefix: 'domain-message-'
    });
    this._requestBuilder = new AuthRequestBuilder({
      authorization: this.config.serverUri + Auth.API_PATH + Auth.API_AUTH_PATH,
      clientId: clientId,
      redirect: redirect,
      redirectUri: redirectUri,
      requestCredentials: requestCredentials,
      scopes: scope
    }, this._storage);
    var backgroundRefreshTimeout = this.config.backgroundRefreshTimeout;

    if (!backgroundRefreshTimeout) {
      backgroundRefreshTimeout = this.config.embeddedLogin ? DEFAULT_BACKGROUND_TIMEOUT : BACKGROUND_REDIRECT_TIMEOUT;
    }

    this._backgroundFlow = new BackgroundFlow(this._requestBuilder, this._storage, backgroundRefreshTimeout);

    if (this.config.EmbeddedLoginFlow) {
      this._embeddedFlow = new this.config.EmbeddedLoginFlow(this._requestBuilder, this._storage, this.config.translations);
    }

    var API_BASE = this.config.serverUri + Auth.API_PATH;
    var fetchConfig = config.fetchCredentials ? {
      credentials: config.fetchCredentials
    } : undefined;
    this.http = new HTTP(this, API_BASE, fetchConfig);

    var getUser = /*#__PURE__*/function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(token) {
        var user;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return _this.getUser(token);

              case 2:
                user = _context.sent;
                _this.user = user;
                return _context.abrupt("return", user);

              case 5:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));

      return function getUser(_x) {
        return _ref.apply(this, arguments);
      };
    }();

    this._tokenValidator = new TokenValidator(this.config, getUser, this._storage);

    if (this.config.onLogout) {
      this.addListener(LOGOUT_EVENT, this.config.onLogout);
    }

    if (this.config.reloadOnUserChange === true) {
      this.addListener(USER_CHANGED_EVENT, function () {
        return _this._reloadCurrentPage();
      });
    }

    this.addListener(LOGOUT_POSTPONED_EVENT, function () {
      return _this._setPostponed(true);
    });
    this.addListener(USER_CHANGE_POSTPONED_EVENT, function () {
      return _this._setPostponed(true);
    });
    this.addListener(USER_CHANGED_EVENT, function () {
      return _this._setPostponed(false);
    });
    this.addListener(USER_CHANGED_EVENT, function (user) {
      return user && _this._updateDomainUser(user.id);
    });

    if (this.config.cacheCurrentUser) {
      this.addListener(LOGOUT_EVENT, function () {
        return _this._storage.wipeCachedCurrentUser();
      });
      this.addListener(USER_CHANGED_EVENT, function () {
        return _this._storage.onUserChanged();
      });
    }

    this._createInitDeferred();

    this.setUpPreconnect(config.serverUri);
  }

  _createClass(Auth, [{
    key: "_setPostponed",
    value: function _setPostponed() {
      var postponed = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
      this._postponed = postponed;
    }
  }, {
    key: "_updateDomainUser",
    value: function _updateDomainUser(userID) {
      this._domainStorage.sendMessage(DOMAIN_USER_CHANGED_EVENT, {
        userID: userID,
        serviceID: this.config.clientId
      });
    }
  }, {
    key: "addListener",
    value: function addListener(event, handler) {
      this.listeners.add(event, handler);
    }
  }, {
    key: "removeListener",
    value: function removeListener(event, handler) {
      this.listeners.remove(event, handler);
    }
  }, {
    key: "setAuthDialogService",
    value: function setAuthDialogService(authDialogService) {
      this._authDialogService = authDialogService;
    }
  }, {
    key: "setCurrentService",
    value: function setCurrentService(service) {
      this._service = service;
    }
  }, {
    key: "_createInitDeferred",
    value: function _createInitDeferred() {
      var _this2 = this;

      this._initDeferred = {};
      this._initDeferred.promise = new Promise(function (resolve, reject) {
        _this2._initDeferred.resolve = resolve;
        _this2._initDeferred.reject = reject;
      });
    }
    /**
     * @return {Promise.<string>} absolute URL promise that is resolved to a URL
     * that should be restored after returning back from auth server.
     */

  }, {
    key: "init",
    value: function () {
      var _init = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
        var _this3 = this;

        var state, _state, message, userID, serviceID;

        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                this._storage.onTokenChange(function (token) {
                  var isGuest = _this3.user ? _this3.user.guest : false;

                  if (isGuest && !token) {
                    return;
                  }

                  if (!token) {
                    _this3.logout();
                  } else {
                    _this3._detectUserChange(token.accessToken);
                  }
                });

                this._domainStorage.onMessage(DOMAIN_USER_CHANGED_EVENT, function (_ref2) {
                  var userID = _ref2.userID,
                      serviceID = _ref2.serviceID;

                  if (serviceID === _this3.config.clientId) {
                    return;
                  }

                  if (_this3.user && userID === _this3.user.id) {
                    return;
                  }

                  _this3.forceTokenUpdate();
                });

                _context2.prev = 2;
                _context2.next = 5;
                return this._checkForAuthResponse();

              case 5:
                state = _context2.sent;
                _context2.next = 11;
                break;

              case 8:
                _context2.prev = 8;
                _context2.t0 = _context2["catch"](2);
                return _context2.abrupt("return", this.handleInitError(_context2.t0));

              case 11:
                if (!(state && state.nonRedirect)) {
                  _context2.next = 13;
                  break;
                }

                return _context2.abrupt("return", new Promise(noop));

              case 13:
                _context2.prev = 13;
                _context2.next = 16;
                return this._tokenValidator.validateToken();

              case 16:
                _context2.next = 18;
                return this._domainStorage._messagesStorage.get("domain-message-".concat(DOMAIN_USER_CHANGED_EVENT));

              case 18:
                message = _context2.sent;

                if (message) {
                  userID = message.userID, serviceID = message.serviceID;

                  if (serviceID !== this.config.clientId && (!userID || this.user.id !== userID)) {
                    this.forceTokenUpdate();
                  }
                } // Access token appears to be valid.
                // We may resolve restoreLocation URL now


                if (state) {
                  _context2.next = 24;
                  break;
                }

                _context2.next = 23;
                return this._checkForStateRestoration();

              case 23:
                state = _context2.sent;

              case 24:
                this._initDeferred.resolve(state && state.restoreLocation);

                return _context2.abrupt("return", (_state = state) === null || _state === void 0 ? void 0 : _state.restoreLocation);

              case 28:
                _context2.prev = 28;
                _context2.t1 = _context2["catch"](13);

                if (!Auth.storageIsUnavailable) {
                  _context2.next = 35;
                  break;
                }

                this._initDeferred.resolve(); // No way to handle if cookies are disabled


                _context2.next = 34;
                return this.requestUser();

              case 34:
                return _context2.abrupt("return", null);

              case 35:
                return _context2.abrupt("return", this.handleInitValidationError(_context2.t1));

              case 36:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this, [[2, 8], [13, 28]]);
      }));

      function init() {
        return _init.apply(this, arguments);
      }

      return init;
    }()
  }, {
    key: "sendRedirect",
    value: function () {
      var _sendRedirect = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(error) {
        var authRequest;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.next = 2;
                return this._requestBuilder.prepareAuthRequest();

              case 2:
                authRequest = _context3.sent;

                this._redirectCurrentPage(authRequest.url);

                throw error;

              case 5:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function sendRedirect(_x2) {
        return _sendRedirect.apply(this, arguments);
      }

      return sendRedirect;
    }()
  }, {
    key: "handleInitError",
    value: function () {
      var _handleInitError = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(error) {
        var state;
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                if (!error.stateId) {
                  _context4.next = 13;
                  break;
                }

                _context4.prev = 1;
                _context4.next = 4;
                return this._storage.getState(error.stateId);

              case 4:
                state = _context4.sent;

                if (!(state && state.nonRedirect)) {
                  _context4.next = 9;
                  break;
                }

                state.error = error;

                this._storage.saveState(error.stateId, state); // Return endless promise in the background to avoid service start


                return _context4.abrupt("return", new Promise(noop));

              case 9:
                _context4.next = 13;
                break;

              case 11:
                _context4.prev = 11;
                _context4.t0 = _context4["catch"](1);

              case 13:
                throw error;

              case 14:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, this, [[1, 11]]);
      }));

      function handleInitError(_x3) {
        return _handleInitError.apply(this, arguments);
      }

      return handleInitError;
    }()
  }, {
    key: "handleInitValidationError",
    value: function () {
      var _handleInitValidationError = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(error) {
        return regeneratorRuntime.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                if (!(error.authRedirect && this.config.redirect)) {
                  _context5.next = 2;
                  break;
                }

                return _context5.abrupt("return", this.sendRedirect(error));

              case 2:
                if (!(error.authRedirect && !this.config.redirect)) {
                  _context5.next = 15;
                  break;
                }

                _context5.prev = 3;
                _context5.next = 6;
                return this._backgroundFlow.authorize();

              case 6:
                _context5.next = 8;
                return this._tokenValidator.validateToken();

              case 8:
                this._initDeferred.resolve();

                return _context5.abrupt("return", undefined);

              case 12:
                _context5.prev = 12;
                _context5.t0 = _context5["catch"](3);
                return _context5.abrupt("return", this.sendRedirect(_context5.t0));

              case 15:
                this._initDeferred.reject(error);

                throw error;

              case 17:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5, this, [[3, 12]]);
      }));

      function handleInitValidationError(_x4) {
        return _handleInitValidationError.apply(this, arguments);
      }

      return handleInitValidationError;
    }()
    /**
     * Get token from local storage or request it if necessary.
     * Can redirect to login page.
     * @return {Promise.<string>}
     */

  }, {
    key: "requestToken",
    value: function () {
      var _requestToken = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6() {
        return regeneratorRuntime.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                if (!this._postponed) {
                  _context6.next = 2;
                  break;
                }

                throw new Error('You should log in to be able to make requests');

              case 2:
                _context6.prev = 2;
                _context6.next = 5;
                return this._initDeferred.promise;

              case 5:
                if (!Auth.storageIsUnavailable) {
                  _context6.next = 7;
                  break;
                }

                return _context6.abrupt("return", null);

              case 7:
                _context6.next = 9;
                return this._tokenValidator.validateTokenLocally();

              case 9:
                return _context6.abrupt("return", _context6.sent);

              case 12:
                _context6.prev = 12;
                _context6.t0 = _context6["catch"](2);
                return _context6.abrupt("return", this.forceTokenUpdate());

              case 15:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6, this, [[2, 12]]);
      }));

      function requestToken() {
        return _requestToken.apply(this, arguments);
      }

      return requestToken;
    }()
    /**
     * Get new token in the background or redirect to the login page.
     * @return {Promise.<string>}
     */

  }, {
    key: "forceTokenUpdate",
    value: function () {
      var _forceTokenUpdate = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7() {
        var authRequest;
        return regeneratorRuntime.wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                _context7.prev = 0;

                if (!this._backendCheckPromise) {
                  this._backendCheckPromise = this._checkBackendsStatusesIfEnabled();
                }

                _context7.next = 4;
                return this._backendCheckPromise;

              case 4:
                _context7.next = 9;
                break;

              case 6:
                _context7.prev = 6;
                _context7.t0 = _context7["catch"](0);
                throw new Error('Cannot refresh token: backend is not available. Postponed by user.');

              case 9:
                _context7.prev = 9;
                this._backendCheckPromise = null;
                return _context7.finish(9);

              case 12:
                _context7.prev = 12;
                _context7.next = 15;
                return this._backgroundFlow.authorize();

              case 15:
                return _context7.abrupt("return", _context7.sent);

              case 18:
                _context7.prev = 18;
                _context7.t1 = _context7["catch"](12);

                if (!this._canShowDialogs()) {
                  _context7.next = 24;
                  break;
                }

                return _context7.abrupt("return", this._showAuthDialog({
                  nonInteractive: true,
                  error: _context7.t1
                }));

              case 24:
                _context7.next = 26;
                return this._requestBuilder.prepareAuthRequest();

              case 26:
                authRequest = _context7.sent;

                this._redirectCurrentPage(authRequest.url);

              case 28:
                throw new TokenValidator.TokenValidationError(_context7.t1.message);

              case 29:
              case "end":
                return _context7.stop();
            }
          }
        }, _callee7, this, [[0, 6, 9, 12], [12, 18]]);
      }));

      function forceTokenUpdate() {
        return _forceTokenUpdate.apply(this, arguments);
      }

      return forceTokenUpdate;
    }()
  }, {
    key: "loadCurrentService",
    value: function () {
      var _loadCurrentService = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8() {
        var _ref3, serviceName, serviceImage;

        return regeneratorRuntime.wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                if (!this._service.serviceName) {
                  _context8.next = 2;
                  break;
                }

                return _context8.abrupt("return");

              case 2:
                _context8.prev = 2;
                _context8.next = 5;
                return this.http.get("oauth2/interactive/login/settings?client_id=".concat(this.config.clientId));

              case 5:
                _context8.t0 = _context8.sent;

                if (_context8.t0) {
                  _context8.next = 8;
                  break;
                }

                _context8.t0 = {};

              case 8:
                _ref3 = _context8.t0;
                serviceName = _ref3.serviceName;
                serviceImage = _ref3.iconUrl;
                this.setCurrentService({
                  serviceImage: serviceImage,
                  serviceName: serviceName
                });
                _context8.next = 16;
                break;

              case 14:
                _context8.prev = 14;
                _context8.t1 = _context8["catch"](2);

              case 16:
              case "end":
                return _context8.stop();
            }
          }
        }, _callee8, this, [[2, 14]]);
      }));

      function loadCurrentService() {
        return _loadCurrentService.apply(this, arguments);
      }

      return loadCurrentService;
    }()
  }, {
    key: "getAPIPath",
    value: function getAPIPath() {
      return this.config.serverUri + Auth.API_PATH;
    }
    /**
     * @return {Promise.<object>}
     */

  }, {
    key: "getUser",
    value: function getUser(accessToken) {
      var _this4 = this;

      if (this.config.cacheCurrentUser) {
        return this._storage.getCachedUser(function () {
          return _this4.http.authorizedFetch(Auth.API_PROFILE_PATH, accessToken, _this4.config.userParams);
        });
      } else {
        return this.http.authorizedFetch(Auth.API_PROFILE_PATH, accessToken, this.config.userParams);
      }
    }
    /**
     * @return {Promise.<object>}
     */

  }, {
    key: "requestUser",
    value: function () {
      var _requestUser = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9() {
        var accessToken, user;
        return regeneratorRuntime.wrap(function _callee9$(_context9) {
          while (1) {
            switch (_context9.prev = _context9.next) {
              case 0:
                if (!this.user) {
                  _context9.next = 2;
                  break;
                }

                return _context9.abrupt("return", this.user);

              case 2:
                _context9.next = 4;
                return this.requestToken();

              case 4:
                accessToken = _context9.sent;

                if (!this.user) {
                  _context9.next = 7;
                  break;
                }

                return _context9.abrupt("return", this.user);

              case 7:
                _context9.next = 9;
                return this.getUser(accessToken);

              case 9:
                user = _context9.sent;
                this.user = user;
                return _context9.abrupt("return", user);

              case 12:
              case "end":
                return _context9.stop();
            }
          }
        }, _callee9, this);
      }));

      function requestUser() {
        return _requestUser.apply(this, arguments);
      }

      return requestUser;
    }()
  }, {
    key: "updateUser",
    value: function () {
      var _updateUser = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee10() {
        var accessToken, user;
        return regeneratorRuntime.wrap(function _callee10$(_context10) {
          while (1) {
            switch (_context10.prev = _context10.next) {
              case 0:
                this._setPostponed(false);

                _context10.next = 3;
                return this.requestToken();

              case 3:
                accessToken = _context10.sent;

                this._storage.wipeCachedCurrentUser();

                _context10.next = 7;
                return this.getUser(accessToken);

              case 7:
                user = _context10.sent;
                this.user = user;
                this.listeners.trigger(USER_CHANGED_EVENT, user);

              case 10:
              case "end":
                return _context10.stop();
            }
          }
        }, _callee10, this);
      }));

      function updateUser() {
        return _updateUser.apply(this, arguments);
      }

      return updateUser;
    }()
  }, {
    key: "_detectUserChange",
    value: function () {
      var _detectUserChange2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee11(accessToken) {
        var _this5 = this;

        var windowWasOpen, user, onApply;
        return regeneratorRuntime.wrap(function _callee11$(_context11) {
          while (1) {
            switch (_context11.prev = _context11.next) {
              case 0:
                windowWasOpen = this._isLoginWindowOpen;
                _context11.prev = 1;
                _context11.next = 4;
                return this.getUser(accessToken);

              case 4:
                user = _context11.sent;

                onApply = function onApply() {
                  _this5.user = user;

                  _this5.listeners.trigger(USER_CHANGED_EVENT, user);
                };

                if (!(user && this.user && this.user.id !== user.id)) {
                  _context11.next = 15;
                  break;
                }

                if (!(!this._canShowDialogs() || this.user.guest || windowWasOpen)) {
                  _context11.next = 10;
                  break;
                }

                onApply();
                return _context11.abrupt("return");

              case 10:
                if (!user.guest) {
                  _context11.next = 13;
                  break;
                }

                this._showAuthDialog({
                  nonInteractive: true
                });

                return _context11.abrupt("return");

              case 13:
                _context11.next = 15;
                return this._showUserChangedDialog({
                  newUser: user,
                  onApply: onApply,
                  onPostpone: function onPostpone() {
                    _this5.listeners.trigger(USER_CHANGE_POSTPONED_EVENT);

                    _this5.config.onPostponeChangedUser(_this5.user, user);
                  }
                });

              case 15:
                _context11.next = 19;
                break;

              case 17:
                _context11.prev = 17;
                _context11.t0 = _context11["catch"](1);

              case 19:
              case "end":
                return _context11.stop();
            }
          }
        }, _callee11, this, [[1, 17]]);
      }));

      function _detectUserChange(_x5) {
        return _detectUserChange2.apply(this, arguments);
      }

      return _detectUserChange;
    }()
  }, {
    key: "_beforeLogout",
    value: function _beforeLogout(params) {
      if (this._canShowDialogs()) {
        this._showAuthDialog(params);

        return;
      }

      this.logout();
    }
  }, {
    key: "_showAuthDialog",
    value: function _showAuthDialog() {
      var _this6 = this;

      var _ref4 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
          nonInteractive = _ref4.nonInteractive,
          error = _ref4.error,
          canCancel = _ref4.canCancel;

      var _this$config2 = this.config,
          embeddedLogin = _this$config2.embeddedLogin,
          onPostponeLogout = _this$config2.onPostponeLogout,
          translations = _this$config2.translations;
      var cancelable = this.user.guest || canCancel;

      this._createInitDeferred();

      var closeDialog = function closeDialog() {
        /* eslint-disable no-use-before-define */
        stopTokenListening();
        stopMessageListening();
        hide();
        /* eslint-enable no-use-before-define */
      };

      var onConfirm = function onConfirm() {
        if (embeddedLogin !== true) {
          closeDialog();

          _this6.logout();

          return;
        }

        _this6._runEmbeddedLogin();
      };

      var onCancel = function onCancel() {
        _this6._embeddedFlow.stop();

        _this6._storage.sendMessage(Auth.CLOSE_WINDOW_MESSAGE, Date.now());

        closeDialog();

        if (!cancelable) {
          _this6._initDeferred.resolve();

          _this6.listeners.trigger(LOGOUT_POSTPONED_EVENT);

          onPostponeLogout();
          return;
        }

        if (_this6.user.guest && nonInteractive) {
          _this6.forceTokenUpdate();
        } else {
          _this6._initDeferred.resolve();
        }
      };

      var hide = this._authDialogService(_objectSpread2(_objectSpread2({}, this._service), {}, {
        loginCaption: translations.login,
        loginToCaption: translations.loginTo,
        confirmLabel: translations.login,
        cancelLabel: cancelable ? translations.cancel : translations.postpone,
        errorMessage: error && error.toString ? error.toString() : null,
        onConfirm: onConfirm,
        onCancel: onCancel
      }));

      var stopTokenListening = this._storage.onTokenChange(function (token) {
        if (token) {
          closeDialog();

          _this6._initDeferred.resolve();
        }
      });

      var stopMessageListening = this._storage.onMessage(Auth.CLOSE_WINDOW_MESSAGE, function () {
        return _this6._embeddedFlow.stop();
      });
    }
  }, {
    key: "_showUserChangedDialog",
    value: function _showUserChangedDialog() {
      var _this7 = this;

      var _ref5 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
          newUser = _ref5.newUser,
          onApply = _ref5.onApply,
          onPostpone = _ref5.onPostpone;

      var translations = this.config.translations;

      this._createInitDeferred();

      var done = function done() {
        _this7._initDeferred.resolve(); // eslint-disable-next-line no-use-before-define


        hide();
      };

      var hide = this._authDialogService(_objectSpread2(_objectSpread2({}, this._service), {}, {
        title: translations.youHaveLoggedInAs.replace('%userName%', newUser.name),
        loginCaption: translations.login,
        loginToCaption: translations.loginTo,
        confirmLabel: translations.applyChange,
        cancelLabel: translations.postpone,
        onConfirm: function onConfirm() {
          done();
          onApply();
        },
        onCancel: function onCancel() {
          done();
          onPostpone();
        }
      }));
    }
  }, {
    key: "_showBackendDownDialog",
    value: function _showBackendDownDialog(backendError) {
      var _this8 = this;

      var _this$config3 = this.config,
          onBackendDown = _this$config3.onBackendDown,
          translations = _this$config3.translations;
      var REPEAT_TIMEOUT = 5000;
      var timerId = null;
      return new Promise(function (resolve, reject) {
        var done = function done() {
          /* eslint-disable no-use-before-define */
          hide();
          window.removeEventListener('online', onCheckAgain);
          stopListeningCloseMessage();
          /* eslint-enable no-use-before-define */

          _this8._storage.sendMessage(Auth.CLOSE_BACKEND_DOWN_MESSAGE, Date.now());

          _this8._awaitingForBackendPromise = null;
          clearTimeout(timerId);
        };

        var stopListeningCloseMessage = _this8._storage.onMessage(Auth.CLOSE_BACKEND_DOWN_MESSAGE, function () {
          stopListeningCloseMessage();
          done();
          resolve();
        });

        var onCheckAgain = /*#__PURE__*/function () {
          var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee12() {
            return regeneratorRuntime.wrap(function _callee12$(_context12) {
              while (1) {
                switch (_context12.prev = _context12.next) {
                  case 0:
                    _context12.next = 2;
                    return _this8._checkBackendsAreUp();

                  case 2:
                    done();
                    resolve();

                  case 4:
                  case "end":
                    return _context12.stop();
                }
              }
            }, _callee12);
          }));

          return function onCheckAgain() {
            return _ref6.apply(this, arguments);
          };
        }();

        var onPostpone = function onPostpone() {
          done();
          reject(new Error('Auth(@jetbrains/ring-ui): postponed by user'));
        };

        var hide = onBackendDown({
          onCheckAgain: onCheckAgain,
          onPostpone: onPostpone,
          backendError: backendError,
          translations: translations
        });
        window.addEventListener('online', onCheckAgain);

        function networkWatchdog() {
          if (navigator && navigator.onLine) {
            onCheckAgain();
          }

          timerId = setTimeout(networkWatchdog, REPEAT_TIMEOUT);
        }

        timerId = setTimeout(networkWatchdog, REPEAT_TIMEOUT);
      });
    }
    /**
     * Wipe accessToken and redirect to auth page with required authorization
     */

  }, {
    key: "logout",
    value: function () {
      var _logout = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee13(extraParams) {
        var requestParams, authRequest;
        return regeneratorRuntime.wrap(function _callee13$(_context13) {
          while (1) {
            switch (_context13.prev = _context13.next) {
              case 0:
                requestParams = _objectSpread2({
                  // eslint-disable-next-line camelcase
                  request_credentials: 'required'
                }, extraParams);
                _context13.next = 3;
                return this._checkBackendsStatusesIfEnabled();

              case 3:
                _context13.next = 5;
                return this.listeners.trigger(LOGOUT_EVENT);

              case 5:
                this._updateDomainUser(null);

                _context13.next = 8;
                return this._storage.wipeToken();

              case 8:
                _context13.next = 10;
                return this._requestBuilder.prepareAuthRequest(requestParams);

              case 10:
                authRequest = _context13.sent;

                this._redirectCurrentPage(authRequest.url);

              case 12:
              case "end":
                return _context13.stop();
            }
          }
        }, _callee13, this);
      }));

      function logout(_x6) {
        return _logout.apply(this, arguments);
      }

      return logout;
    }()
  }, {
    key: "_runEmbeddedLogin",
    value: function () {
      var _runEmbeddedLogin2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee14() {
        return regeneratorRuntime.wrap(function _callee14$(_context14) {
          while (1) {
            switch (_context14.prev = _context14.next) {
              case 0:
                this._storage.sendMessage(Auth.CLOSE_WINDOW_MESSAGE, Date.now());

                _context14.prev = 1;
                this._isLoginWindowOpen = true;
                _context14.next = 5;
                return this._embeddedFlow.authorize();

              case 5:
                return _context14.abrupt("return", _context14.sent);

              case 8:
                _context14.prev = 8;
                _context14.t0 = _context14["catch"](1);
                throw _context14.t0;

              case 11:
                _context14.prev = 11;
                this._isLoginWindowOpen = false;
                return _context14.finish(11);

              case 14:
              case "end":
                return _context14.stop();
            }
          }
        }, _callee14, this, [[1, 8, 11, 14]]);
      }));

      function _runEmbeddedLogin() {
        return _runEmbeddedLogin2.apply(this, arguments);
      }

      return _runEmbeddedLogin;
    }()
    /**
     * Wipe accessToken and redirect to auth page to obtain authorization data
     * if user is logged in or log her in otherwise
     */

  }, {
    key: "login",
    value: function () {
      var _login = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee15() {
        var accessToken, _user;

        return regeneratorRuntime.wrap(function _callee15$(_context15) {
          while (1) {
            switch (_context15.prev = _context15.next) {
              case 0:
                if (!this.config.embeddedLogin) {
                  _context15.next = 4;
                  break;
                }

                _context15.next = 3;
                return this._runEmbeddedLogin();

              case 3:
                return _context15.abrupt("return");

              case 4:
                _context15.next = 6;
                return this._checkBackendsStatusesIfEnabled();

              case 6:
                _context15.prev = 6;
                _context15.next = 9;
                return this._backgroundFlow.authorize();

              case 9:
                accessToken = _context15.sent;
                _context15.next = 12;
                return this.getUser(accessToken);

              case 12:
                _user = _context15.sent;

                if (_user.guest) {
                  this._beforeLogout();
                } else {
                  this.user = _user;
                  this.listeners.trigger(USER_CHANGED_EVENT, _user);
                }

                _context15.next = 19;
                break;

              case 16:
                _context15.prev = 16;
                _context15.t0 = _context15["catch"](6);

                this._beforeLogout();

              case 19:
              case "end":
                return _context15.stop();
            }
          }
        }, _callee15, this, [[6, 16]]);
      }));

      function login() {
        return _login.apply(this, arguments);
      }

      return login;
    }()
  }, {
    key: "switchUser",
    value: function () {
      var _switchUser = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee16() {
        return regeneratorRuntime.wrap(function _callee16$(_context16) {
          while (1) {
            switch (_context16.prev = _context16.next) {
              case 0:
                if (!this.config.embeddedLogin) {
                  _context16.next = 3;
                  break;
                }

                _context16.next = 3;
                return this._runEmbeddedLogin();

              case 3:
                throw new Error('Auth: switchUser only supported for "embeddedLogin" mode');

              case 4:
              case "end":
                return _context16.stop();
            }
          }
        }, _callee16, this);
      }));

      function switchUser() {
        return _switchUser.apply(this, arguments);
      }

      return switchUser;
    }()
    /**
     * Check if the hash contains an access token.
     * If it does, extract the state, compare with
     * config, and store the auth response for later use.
     *
     * @return {Promise} promise that is resolved to restoreLocation URL, or rejected
     * @private
     */

  }, {
    key: "_checkForAuthResponse",
    value: function () {
      var _checkForAuthResponse2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee17() {
        var authResponse, _this$config4, defaultScope, defaultExpiresIn, cleanHash, stateId, scope, expiresIn, accessToken, newState, scopes, effectiveExpiresIn, expires;

        return regeneratorRuntime.wrap(function _callee17$(_context17) {
          while (1) {
            switch (_context17.prev = _context17.next) {
              case 0:
                // getAuthResponseURL may throw an exception
                authResponse = this._responseParser.getAuthResponseFromURL();
                _this$config4 = this.config, defaultScope = _this$config4.scope, defaultExpiresIn = _this$config4.defaultExpiresIn, cleanHash = _this$config4.cleanHash;

                if (authResponse && cleanHash) {
                  this.setHash('');
                }

                if (authResponse) {
                  _context17.next = 5;
                  break;
                }

                return _context17.abrupt("return", undefined);

              case 5:
                stateId = authResponse.state, scope = authResponse.scope, expiresIn = authResponse.expiresIn, accessToken = authResponse.accessToken;
                _context17.next = 8;
                return stateId && this._storage.getState(stateId);

              case 8:
                _context17.t0 = _context17.sent;

                if (_context17.t0) {
                  _context17.next = 11;
                  break;
                }

                _context17.t0 = {};

              case 11:
                newState = _context17.t0;
                scopes = scope ? scope.split(' ') : newState.scopes || defaultScope || [];
                effectiveExpiresIn = expiresIn ? parseInt(expiresIn, 10) : defaultExpiresIn;
                expires = TokenValidator._epoch() + effectiveExpiresIn;
                _context17.next = 17;
                return this._storage.saveToken({
                  accessToken: accessToken,
                  scopes: scopes,
                  expires: expires,
                  lifeTime: effectiveExpiresIn
                });

              case 17:
                return _context17.abrupt("return", newState);

              case 18:
              case "end":
                return _context17.stop();
            }
          }
        }, _callee17, this);
      }));

      function _checkForAuthResponse() {
        return _checkForAuthResponse2.apply(this, arguments);
      }

      return _checkForAuthResponse;
    }()
  }, {
    key: "_checkForStateRestoration",
    value: function () {
      var _checkForStateRestoration2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee18() {
        var authResponse, stateId;
        return regeneratorRuntime.wrap(function _callee18$(_context18) {
          while (1) {
            switch (_context18.prev = _context18.next) {
              case 0:
                authResponse = this._responseParser._authResponse;

                if (authResponse && this.config.cleanHash) {
                  this.setHash('');
                }

                stateId = authResponse === null || authResponse === void 0 ? void 0 : authResponse.restoreAuthState;
                _context18.next = 5;
                return stateId && this._storage.getState(stateId);

              case 5:
                _context18.t0 = _context18.sent;

                if (_context18.t0) {
                  _context18.next = 8;
                  break;
                }

                _context18.t0 = {};

              case 8:
                return _context18.abrupt("return", _context18.t0);

              case 9:
              case "end":
                return _context18.stop();
            }
          }
        }, _callee18, this);
      }));

      function _checkForStateRestoration() {
        return _checkForStateRestoration2.apply(this, arguments);
      }

      return _checkForStateRestoration;
    }()
  }, {
    key: "_checkBackendsAreUp",
    value: function _checkBackendsAreUp() {
      var backendCheckTimeout = this.config.backendCheckTimeout;
      return Promise.all([promiseWithTimeout(this.http.fetch('settings/public?fields=id'), backendCheckTimeout, {
        error: new Error('The authorization server is taking too long to respond. Please try again later.')
      }), this.config.checkBackendIsUp()]).catch(function (err) {
        if (err instanceof TypeError) {
          throw new TypeError('Could not connect to the server due to network error. Please check your connection and try again.');
        }

        throw err;
      });
    }
  }, {
    key: "_checkBackendsStatusesIfEnabled",
    value: function () {
      var _checkBackendsStatusesIfEnabled2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee19() {
        return regeneratorRuntime.wrap(function _callee19$(_context19) {
          while (1) {
            switch (_context19.prev = _context19.next) {
              case 0:
                if (this.config.enableBackendStatusCheck) {
                  _context19.next = 2;
                  break;
                }

                return _context19.abrupt("return");

              case 2:
                _context19.prev = 2;
                _context19.next = 5;
                return this._checkBackendsAreUp();

              case 5:
                _context19.next = 11;
                break;

              case 7:
                _context19.prev = 7;
                _context19.t0 = _context19["catch"](2);
                _context19.next = 11;
                return this._showBackendDownDialog(_context19.t0);

              case 11:
              case "end":
                return _context19.stop();
            }
          }
        }, _callee19, this, [[2, 7]]);
      }));

      function _checkBackendsStatusesIfEnabled() {
        return _checkBackendsStatusesIfEnabled2.apply(this, arguments);
      }

      return _checkBackendsStatusesIfEnabled;
    }()
    /**
     * Adds preconnect tag to help browser to establish connection to URL.
     * See https://w3c.github.io/resource-hints/
     * @param url Url to preconnect to.
     */

  }, {
    key: "setUpPreconnect",
    value: function setUpPreconnect(url) {
      var linkNode = document.createElement('link');
      linkNode.rel = 'preconnect';
      linkNode.href = url;
      linkNode.pr = '1.0';
      linkNode.crossorigin = 'use-credentials';
      document.head.appendChild(linkNode);
    }
    /**
     * Redirects current page to the given URL
     * @param {string} url
     * @private
     */

  }, {
    key: "_redirectCurrentPage",
    value: function _redirectCurrentPage(url) {
      window.location = fixUrl(url);
    }
    /**
     * Reloads current page
     */

  }, {
    key: "_reloadCurrentPage",
    value: function _reloadCurrentPage() {
      this._redirectCurrentPage(window.location.href);
    }
  }, {
    key: "_canShowDialogs",
    value: function _canShowDialogs() {
      return this.config.embeddedLogin && this._authDialogService;
    }
    /**
     * Sets the location hash
     * @param {string} hash
     */

  }, {
    key: "setHash",
    value: function setHash(hash) {
      if (history.replaceState) {
        // NB! History.replaceState is used here, because Firefox saves
        // a record in history.
        // NB! URL to redirect is formed manually because baseURI could be messed up,
        // in which case it's not obvious where redirect will lead.
        var cleanedUrl = [window.location.pathname, window.location.search].join('');
        var hashIfExist = hash ? "#".concat(hash) : '';
        history.replaceState(undefined, undefined, "".concat(cleanedUrl).concat(hashIfExist));
      } else {
        window.location.hash = hash;
      }
    }
  }]);

  return Auth;
}();

_defineProperty(Auth, "DEFAULT_CONFIG", DEFAULT_CONFIG);

_defineProperty(Auth, "API_PATH", 'api/rest/');

_defineProperty(Auth, "API_AUTH_PATH", 'oauth2/auth');

_defineProperty(Auth, "API_PROFILE_PATH", 'users/me');

_defineProperty(Auth, "CLOSE_BACKEND_DOWN_MESSAGE", 'backend-check-succeeded');

_defineProperty(Auth, "CLOSE_WINDOW_MESSAGE", 'close-login-window');

_defineProperty(Auth, "shouldRefreshToken", TokenValidator.shouldRefreshToken);

_defineProperty(Auth, "storageIsUnavailable", !navigator.cookieEnabled);

/**
 * @name Auth
 *
 * @prop {object} config
 * @prop {string} config.serverUri
 * @prop {string} config.redirectUri
 * @prop {string} config.clientId
 * @prop {boolean=false} config.redirect — use redirects instead of loading the token in the background.
 * @prop {string[]} config.scope
 * @prop {string[]} config.optionalScopes
 * @prop {boolean} config.cleanHash - whether or not location.hash will be cleaned after authorization is completed.
 * Should be set to false in angular > 1.2.26 apps to prevent infinite redirect in Firefox
 * @prop {User?} user
 * @prop {string[]} config.userFields List of user data fields to be returned by auth.requestUser (default list is used in Header.HeaderHelper)
 * @prop {string[]} config.fetchCredentials
 *
 * @param {{
 *   serverUri: string,
 *   redirectUri: string?,
 *   requestCredentials: string?,
 *   clientId: string?,
 *   scope: string[]?,
 *   optionalScopes: string[]?,
 *   cleanHash: boolean?,
 *   fetchCredentials: string?,
 *   userFields: string[]?
 * }} config
 *
 */

/**
 * Extend Auth config with non-required and not pure-JS stuff
 */

Auth.DEFAULT_CONFIG = _objectSpread2(_objectSpread2({}, Auth.DEFAULT_CONFIG), {}, {
  EmbeddedLoginFlow: WindowFlow,
  onBackendDown: onBackendDown
});

export default Auth;
export { DEFAULT_BACKGROUND_TIMEOUT, DEFAULT_EXPIRES_TIMEOUT, DOMAIN_USER_CHANGED_EVENT, LOGOUT_EVENT, LOGOUT_POSTPONED_EVENT, USER_CHANGED_EVENT, USER_CHANGE_POSTPONED_EVENT };
