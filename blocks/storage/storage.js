define(['global/global__modules', 'storage-polyfill', 'json'], function (Module) {
  'use strict';

  var module = 'storage';

  var storageCorruptionWarn = function(e) {
    if(e.name === 'NS_ERROR_FILE_CORRUPTED') {
      window.alert('Sorry, it looks like your browser storage has been corrupted. ' +
        'Please clear your storage by going to Tools -> Clear Recent History -> Cookies' +
        ' and set time range to "Everything". This will remove the corrupted browser storage across all sites.');
    }
  };

  // Read sidebar settings
  var get = function(name) {
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

  var set = function(name, value) {
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

  var has = function(name) {
    try {
      return localStorage.hasOwnProperty(name);
    } catch (e) {}
  };

  var remove = function(name) {
    var dfd = $.Deferred();

    try {
      if (has(name)) {
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

  var each = function(callback) {
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

  Module.add(module, {
    get: get,
    set: set,
    remove: remove,
    each: each,
    has: {
      method: has,
      override: true
    }
  });
});