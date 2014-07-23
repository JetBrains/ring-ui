/**
 * Cookie storage fallback (IE7- and IE10+ in protected mode)
 *
 * Adopted from http://github.com/inexorabletash/polyfill/blob/master/obsolete/storage.js
 */
define(['jquery', 'json'], function ($) {
  'use strict';

  var DEFAULT_COOKIE_NAME = 'localStorage';

  function createCookie(name, value, days) {
    var date, expires;

    if (days) {
      date = new Date();
      date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
      expires = '; expires=' + date.toGMTString();
    } else {
      expires = ';';
    }
    document.cookie = name + '=' + value + expires + '; path=/';
  }

  function readCookie(name) {
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
  }

  var FallbackStorage = function(config) {
    if (!(this instanceof FallbackStorage)) {
      return new FallbackStorage();
    }

    this.cookieName = config && config.cookieName || DEFAULT_COOKIE_NAME;
  };

  var proto = FallbackStorage.prototype;

  proto.read_ = function() {
    var rawData = readCookie(this.cookieName);
    var dfd = $.Deferred();
    var data = {};

    try {
      data = JSON.parse(decodeURIComponent(rawData));
    } catch(e) {}

    dfd.resolve(data);
    return dfd;
  };

  proto.write_ = function(data) {
    try {
      var stringData = encodeURIComponent(JSON.stringify(data));
      createCookie(this.cookieName, stringData === '{}' ? '' : stringData, 365);
    } catch (e) {
      return $.Deferred().reject(e);
    }
  };

  proto.get = function(key) {
    return this.read_().then(function(data) {
      var value = data[key];

      if (value != null) {
        return value;
      } else {
        return $.Deferred().reject(new Error('Callback is not a function'));
      }
    });
  };

  proto.set = function(key, value) {
    var self = this;

    return this.read_().then(function(data) {
      if (key) {
        if (value != null) {
          data[key] = value;
        } else {
          delete data[key];
        }
      }

      return self.write_(data);
    });
  };

  proto.remove = function(key) {
    return this.set(key, null);
  };

  proto.each = function(callback) {
    var dfd = $.Deferred();

    if (typeof callback !== 'function') {
      return dfd.reject(new Error('Callback is not a function'));
    }

    return this.read_().then(function(data) {
      var count = 0;

      for (var key in data) {
        count++;
        callback(key, data[key]);
      }

      if (count === 0) {
        return dfd.reject(new Error('There is no items'));
      }
    });
  };

  return FallbackStorage;
});