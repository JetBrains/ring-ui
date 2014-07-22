define(['jquery', 'storage/storage__fallback', 'json'], function ($, FallbackStorage) {
  'use strict';

  var storageCorruptionWarn = function(e) {
    if(e.name === 'NS_ERROR_FILE_CORRUPTED') {
      window.alert('Sorry, it looks like your browser storage has been corrupted. ' +
        'Please clear your storage by going to Tools -> Clear Recent History -> Cookies' +
        ' and set time range to "Everything". This will remove the corrupted browser storage across all sites.');
    }
  };

  var LocalStorage = function() {
    if (!(this instanceof LocalStorage)) {
      return new LocalStorage();
    }
  };
  var proto = LocalStorage.prototype;

  proto.get = function(name) {
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

    return dfd;
  };

  proto.set = function(name, value) {
    var dfd = $.Deferred();

    try {
      localStorage.setItem(name, JSON.stringify(value));
      dfd.resolve();
    } catch (e) {
      storageCorruptionWarn(e);
      dfd.reject(e);
    }

    return dfd;
  };

  proto.remove = function(name) {
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

    return dfd;
  };

  proto.each = function(callback) {
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
        dfd.resolve();
      } else {
        dfd.reject(new Error('There is no items'));
      }
    } catch (e) {
      dfd.reject(e);
    }

    return dfd;
  };

  var Storage = LocalStorage;

  // Using try/catch here because of IE10+ protected mode and other browsers' quirks
  // See https://github.com/Modernizr/Modernizr/blob/master/feature-detects/storage/localstorage.js
  try {
    var test = 'testStorage';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
  } catch(e) {
    Storage = FallbackStorage;
  }

  return Storage;
});