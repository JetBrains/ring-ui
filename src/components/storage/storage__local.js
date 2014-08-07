'use strict';

var $ = require('jquery');

var storageCorruptionWarn = function(e) {
  if(e.name === 'NS_ERROR_FILE_CORRUPTED') {
    window.alert('Sorry, it looks like your browser storage has been corrupted. ' +
      'Please clear your storage by going to Tools -> Clear Recent History -> Cookies' +
      ' and set time range to "Everything". This will remove the corrupted browser storage across all sites.');
  }
};

/**
 * @return {LocalStorage}
 * @constructor
 */
var LocalStorage = function() {
  if (!(this instanceof LocalStorage)) {
    return new LocalStorage();
  }
};

/**
 * @param {string} name
 * @return {Promise}
 */
LocalStorage.prototype.get = function(name) {
  var dfd = $.Deferred();

  try {
    var item = JSON.parse(localStorage.getItem(name));

    if (item) {
      dfd.resolve(item);
    } else {
      dfd.reject(new Error('There is no item "' + name + '"'));
    }
  } catch (e) {
    storageCorruptionWarn(e);
    dfd.reject(e);
  }

  return dfd.promise();
};

/**
 * @param {string} name
 * @param {object} value
 * @return {Promise}
 */
LocalStorage.prototype.set = function(name, value) {
  var dfd = $.Deferred();

  try {
    localStorage.setItem(name, JSON.stringify(value));
    dfd.resolve(value);
  } catch (e) {
    storageCorruptionWarn(e);
    dfd.reject(e);
  }

  return dfd.promise();
};

/**
 * @param {string} name
 * @return {Promise}
 */
LocalStorage.prototype.remove = function(name) {
  var dfd = $.Deferred();

  try {
    if (localStorage.hasOwnProperty(name)) {
      localStorage.removeItem(name);
      dfd.resolve();
    } else {
      dfd.reject(new Error('There is no item "' + name + '"'));
    }
  } catch (e) {
    storageCorruptionWarn(e);
    dfd.reject(e);
  }

  return dfd.promise();
};

/**
 * @param callback
 * @return {Promise}
 */
LocalStorage.prototype.each = function(callback) {
  var dfd = $.Deferred();
  var count = 0;
  try {
    for (var item in localStorage) {
      if (localStorage.hasOwnProperty(item)) {
        count++;
        callback(item, JSON.parse(localStorage.getItem(item)));
      }
    }

    if (count) {
      dfd.resolve(count);
    } else {
      dfd.reject(new Error('There is no items'));
    }
  } catch (e) {
    dfd.reject(e);
  }

  return dfd;
};

module.exports = LocalStorage;