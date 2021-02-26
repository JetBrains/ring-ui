import { c as _createClass, b as _classCallCheck, l as _asyncToGenerator, d as _defineProperty } from './_rollupPluginBabelHelpers-ab14fb00.js';
import alertService from './alert-service.js';
import deepEqual from 'deep-equal';
import 'react';
import 'react-dom';
import './get-uid-bf3ab014.js';
import './alert.js';
import 'classnames';
import 'prop-types';
import '@jetbrains/icons/exception';
import '@jetbrains/icons/checkmark';
import '@jetbrains/icons/warning';
import '@jetbrains/icons/close';
import './icon.js';
import 'util-deprecate';
import 'style-inject';
import './memoize-ad2c954c.js';
import './loader-inline.js';
import './theme-9a053da9.js';
import './data-tests-1a367745.js';
import 'conic-gradient';
import './dom-0ae85140.js';

/**
 * @return {LocalStorage}
 * @param {{type: string}} config Set to "session" to use sessionStorage
 * @constructor
 */

var LocalStorage = /*#__PURE__*/function () {
  _createClass(LocalStorage, null, [{
    key: "safePromise",
    value: function () {
      var _safePromise = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(resolver) {
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.prev = 0;
                _context.next = 3;
                return new Promise(resolver);

              case 3:
                return _context.abrupt("return", _context.sent);

              case 6:
                _context.prev = 6;
                _context.t0 = _context["catch"](0);

                if (_context.t0 && _context.t0.name === 'NS_ERROR_FILE_CORRUPTED') {
                  alertService.error('Sorry, it looks like your browser storage is corrupted. ' + 'Please clear your storage by going to Tools -> Clear Recent History -> Cookies' + ' and setting time range to "Everything". This will remove the corrupted browser storage across all sites.');
                }

                throw _context.t0;

              case 10:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, null, [[0, 6]]);
      }));

      function safePromise(_x) {
        return _safePromise.apply(this, arguments);
      }

      return safePromise;
    }()
  }]);

  function LocalStorage() {
    var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, LocalStorage);

    this.storageType = config.type === 'session' ? 'sessionStorage' : 'localStorage';
  }
  /**
   * @param {string} name
   * @return {Promise}
   */


  _createClass(LocalStorage, [{
    key: "get",
    value: function get(name) {
      var _this = this;

      return this.constructor.safePromise(function (resolve) {
        var value = window[_this.storageType].getItem(name);

        try {
          resolve(JSON.parse(value));
        } catch (e) {
          resolve(value);
        }
      });
    }
    /**
     * @param {string} name
     * @param {object} value
     * @return {Promise}
     */

  }, {
    key: "set",
    value: function set(name, value) {
      var _this2 = this;

      return this.constructor.safePromise(function (resolve) {
        window[_this2.storageType].setItem(name, JSON.stringify(value));

        resolve(value);
      });
    }
    /**
     * @param {string} name
     * @return {Promise}
     */

  }, {
    key: "remove",
    value: function remove(name) {
      var storageType = this.storageType;
      return this.constructor.safePromise(function (resolve) {
        if (window[storageType].hasOwnProperty(name)) {
          window[storageType].removeItem(name);
        }

        resolve();
      });
    }
    /**
     * @param callback
     * @return {Promise}
     */

  }, {
    key: "each",
    value: function each(callback) {
      var storageType = this.storageType;
      return this.constructor.safePromise(function (resolve) {
        var promises = [];

        for (var item in window[storageType]) {
          if (window[storageType].hasOwnProperty(item)) {
            var value = window[storageType].getItem(item);

            try {
              value = JSON.parse(value);
            } catch (e) {// Do nothing
            }

            promises.push(Promise.resolve(callback(item, value)));
          }
        }

        resolve(Promise.all(promises));
      });
    }
    /**
     * @param {string} name
     * @param {Function} callback
     * @return {Function}
     */

  }, {
    key: "on",
    value: function on(name, callback) {
      function handleStorage(e) {
        if (e.key === name) {
          try {
            callback(JSON.parse(e.newValue));
          } catch (err) {
            callback(e.newValue);
          }
        }
      }

      window.addEventListener('storage', handleStorage, false);
      return function () {
        return window.removeEventListener('storage', handleStorage, false);
      };
    }
  }]);

  return LocalStorage;
}();

var DEFAULT_CHECK_DELAY = 3000;
var COOKIE_EXPIRES = 365;
var QUOTA = 4093; // eslint-disable-next-line no-magic-numbers

var SECONDS_IN_DAY = 24 * 60 * 60 * 1000;
/**
 * @prop {string} cookieName
 *
 * @param {{cookieName: string}} config
 * @param {{checkDelay: number}} config
 * @param {{type: string}} config
 * @return {FallbackStorage}
 * @constructor
 */

var FallbackStorage = /*#__PURE__*/function () {
  _createClass(FallbackStorage, null, [{
    key: "_createCookie",

    /**
     * Maximum storage size
     * @see http://browsercookielimits.squawky.net/
     * @type {number}
     */

    /**
     * @param {string} name
     * @param {string} value
     * @param {number} days
     * @private
     */
    value: function _createCookie(name, value, days) {
      var date;
      var expires;

      if (days) {
        date = new Date();
        date.setTime(date.getTime() + days * SECONDS_IN_DAY);
        expires = "; expires=".concat(date.toGMTString());
      } else {
        expires = ';';
      }

      document.cookie = "".concat(name, "=").concat(value).concat(expires, "; path=/");
    }
    /**
     *
     * @param {string} name
     * @return {string}
     * @private
     */

  }, {
    key: "_readCookie",
    value: function _readCookie(name) {
      var nameEQ = "".concat(name, "=");
      var cookies = document.cookie.split(';');
      var cookie;

      for (var i = 0; i < cookies.length; i++) {
        cookie = cookies[i];

        while (cookie.charAt(0) === ' ') {
          cookie = cookie.substring(1, cookie.length);
        }

        if (cookie.indexOf(nameEQ) === 0) {
          return cookie.substring(nameEQ.length, cookie.length);
        }
      }

      return undefined;
    }
  }]);

  function FallbackStorage() {
    var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, FallbackStorage);

    var session = config.type === 'session';
    this.cookieName = config.cookieName || (session ? this.constructor.DEFAULT_SESSION_COOKIE_NAME : this.constructor.DEFAULT_COOKIE_NAME);
    this.checkDelay = config.checkDelay || this.constructor.DEFAULT_CHECK_DELAY;
    this.expires = session ? this.constructor.COOKIE_EXPIRES : null;
  }
  /**
   * @return {Promise}
   * @private
   */


  _createClass(FallbackStorage, [{
    key: "_read",
    value: function _read() {
      var _this = this;

      return new Promise(function (resolve) {
        var rawData = FallbackStorage._readCookie(_this.cookieName);

        resolve(JSON.parse(decodeURIComponent(rawData)));
      }).catch(function () {
        return {};
      });
    }
    /**
     * @param data
     * @return {Promise}
     * @private
     */

  }, {
    key: "_write",
    value: function _write(data) {
      var _this2 = this;

      return new Promise(function (resolve) {
        var stringData = encodeURIComponent(JSON.stringify(data));

        FallbackStorage._createCookie(_this2.cookieName, stringData === '{}' ? '' : stringData, _this2.expires);

        return resolve(data);
      });
    }
    /**
     * @param {string} key
     * @return {Promise}
     */

  }, {
    key: "get",
    value: function get(key) {
      return this._read().then(function (data) {
        return data[key] || null;
      });
    }
    /**
     * @param {string} key
     * @param {object} value
     * @return {Promise}
     */

  }, {
    key: "set",
    value: function set(key, value) {
      var _this3 = this;

      return this._read().then(function (data) {
        if (key) {
          if (value != null) {
            data[key] = value;
          } else {
            Reflect.deleteProperty(data, key);
          }
        }

        return _this3._write(data);
      });
    }
    /**
     * @param {string} key
     * @return {Promise}
     */

  }, {
    key: "remove",
    value: function remove(key) {
      return this.set(key, null);
    }
    /**
     *
     * @param {function(string, value)} callback
     * @return {Promise}
     */

  }, {
    key: "each",
    value: function each(callback) {
      if (typeof callback !== 'function') {
        return Promise.reject(new Error('Callback is not a function'));
      }

      return this._read().then(function (data) {
        var promises = [];

        for (var key in data) {
          if (data.hasOwnProperty(key)) {
            promises.push(callback(key, data[key]));
          }
        }

        return Promise.all(promises);
      });
    }
    /**
     * @param {string} key
     * @param {Function} callback
     * @return {Function}
     */

  }, {
    key: "on",
    value: function on(key, callback) {
      var _this4 = this;

      var stop = false;

      var checkForChange = function checkForChange(oldValue) {
        _this4.get(key).then(function (newValue) {
          if (stop) {
            return;
          }

          if (!deepEqual(oldValue, newValue)) {
            callback(newValue);
          }

          window.setTimeout(function () {
            return checkForChange(oldValue);
          }, _this4.checkDelay);
        });
      };

      this.get(key).then(checkForChange);
      return function () {
        stop = true;
      };
    }
  }]);

  return FallbackStorage;
}();

_defineProperty(FallbackStorage, "DEFAULT_COOKIE_NAME", 'localStorage');

_defineProperty(FallbackStorage, "DEFAULT_SESSION_COOKIE_NAME", 'sessionStorage');

_defineProperty(FallbackStorage, "DEFAULT_CHECK_DELAY", DEFAULT_CHECK_DELAY);

_defineProperty(FallbackStorage, "COOKIE_EXPIRES", COOKIE_EXPIRES);

_defineProperty(FallbackStorage, "QUOTA", QUOTA);

/**
 * @name Storage
 */

/**
 * @constructor
 * @extends {LocalStorage}
 */

var Storage = LocalStorage; // Using try/catch here because of IE10+ protected mode and other browsers' quirks
// See https://github.com/Modernizr/Modernizr/blob/master/feature-detects/storage/localstorage.js

try {
  var temp = 'testStorage';
  localStorage.setItem(temp, temp);
  localStorage.removeItem(temp);
} catch (e) {
  Storage = FallbackStorage;
}

var ActualStorage = Storage;

export default ActualStorage;
