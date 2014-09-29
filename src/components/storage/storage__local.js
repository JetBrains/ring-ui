'use strict';

var when = require('when');

var safePromise = function (resolver) {
  return when.promise(resolver).
    otherwise(function (e) {
      if (e && e.name === 'NS_ERROR_FILE_CORRUPTED') {
        window.alert('Sorry, it looks like your browser storage has been corrupted. ' +
        'Please clear your storage by going to Tools -> Clear Recent History -> Cookies' +
        ' and set time range to "Everything". This will remove the corrupted browser storage across all sites.');
      }
      return when.reject(e);
    });
};

/**
 * @return {LocalStorage}
 * @constructor
 */
var LocalStorage = function () {
  if (!(this instanceof LocalStorage)) {
    return new LocalStorage();
  }
};

/**
 * @param {string} name
 * @return {Promise}
 */
LocalStorage.prototype.get = function (name) {
  return safePromise(function (resolve) {
    var itemS = localStorage.getItem(name);
    var item = itemS && JSON.parse(itemS);
    resolve(item);
  });
};

/**
 * @param {string} name
 * @param {object} value
 * @return {Promise}
 */
LocalStorage.prototype.set = function (name, value) {
  return safePromise(function (resolve) {
    localStorage.setItem(name, JSON.stringify(value));
    resolve(value);
  });
};

/**
 * @param {string} name
 * @return {Promise}
 */
LocalStorage.prototype.remove = function (name) {
  return safePromise(function (resolve) {
    if (localStorage.hasOwnProperty(name)) {
      localStorage.removeItem(name);
    }
    resolve();
  });
};

/**
 * @param callback
 * @return {Promise}
 */
LocalStorage.prototype.each = function (callback) {
  return safePromise(function (resolve) {
    var promises = [];
    var value;

    for (var item in localStorage) {
      if (localStorage.hasOwnProperty(item)) {
        value = localStorage.getItem(item);
        promises.push(
          when.attempt(JSON.parse, value).
            orElse(value).
            fold(callback, item)
        );
      }
    }
    resolve(when.all(promises));
  });
};

module.exports = LocalStorage;