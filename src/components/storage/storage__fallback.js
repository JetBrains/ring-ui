'use strict';

var when = require('when');

var DEFAULT_COOKIE_NAME = 'localStorage';

/**
 * @prop {string} cookieName
 *
 * @param {{cookieName: string}} config
 * @return {FallbackStorage}
 * @constructor
 */
var FallbackStorage = function(config) {
  if (!(this instanceof FallbackStorage)) {
    return new FallbackStorage();
  }

  this.cookieName = config && config.cookieName || DEFAULT_COOKIE_NAME;
};

/**
 * @param {string} name
 * @param {string} value
 * @param {number} days
 * @private
 */
FallbackStorage._createCookie = function(name, value, days) {
  var date, expires;

  if (days) {
    date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    expires = '; expires=' + date.toGMTString();
  } else {
    expires = ';';
  }
  document.cookie = name + '=' + value + expires + '; path=/';
};

/**
 *
 * @param {string} name
 * @return {string}
 * @private
 */
FallbackStorage._readCookie = function(name) {
  var nameEQ = name + '=';
  var cookies = document.cookie.split(';');

  for (var i = 0, cookie; i < cookies.length; i++) {
    cookie = cookies[i];
    while (cookie.charAt(0) === ' ') {
      cookie = cookie.substring(1, cookie.length);
    }

    if (cookie.indexOf(nameEQ) === 0) {
      return cookie.substring(nameEQ.length, cookie.length);
    }
  }
};

/**
 * @return {Promise}
 * @private
 */
FallbackStorage.prototype._read = function() {
  var self = this;
  return when.promise(function (resolve) {
    var rawData = FallbackStorage._readCookie(self.cookieName);
    resolve(JSON.parse(decodeURIComponent(rawData)));
  }).otherwise(function () {
    return {};
  });
};

/**
 * @param data
 * @return {Promise}
 * @private
 */
FallbackStorage.prototype._write = function(data) {
  var self = this;
  return when.promise(function (resolve) {
    var stringData = encodeURIComponent(JSON.stringify(data));
    FallbackStorage._createCookie(self.cookieName, stringData === '{}' ? '' : stringData, 365);
    return resolve(data);
  });
};

/**
 * @param {string} key
 * @return {Promise}
 */
FallbackStorage.prototype.get = function(key) {
  return this._read().then(function(data) {
    return data[key] || null;
  });
};

/**
 * @param {string} key
 * @param {object} value
 * @return {Promise}
 */
FallbackStorage.prototype.set = function(key, value) {
  var self = this;

  return this._read().then(function(data) {
    if (key) {
      if (value != null) {
        data[key] = value;
      } else {
        delete data[key];
      }
    }

    return self._write(data);
  });
};

/**
 * @param {string} key
 * @return {Promise}
 */
FallbackStorage.prototype.remove = function(key) {
  return this.set(key, null);
};

/**
 *
 * @param {function(key: string, value: object)} callback
 * @return {Promise}
 */
FallbackStorage.prototype.each = function(callback) {
  if (typeof callback !== 'function') {
    return when.reject(new Error('Callback is not a function'));
  }

  return this._read().then(function(data) {
    var count = 0;

    for (var key in data) {
      if (data.hasOwnProperty(key)) {
        count++;
        callback(key, data[key]);
      }
    }

    return count;
  });
};

module.exports = FallbackStorage;