var when = require('when');

var safePromise = function (resolver) {
  return when.promise(resolver).
    otherwise(function (e) {
      if (e && e.name === 'NS_ERROR_FILE_CORRUPTED') {
        /* eslint-disable no-alert */
        window.alert('Sorry, it looks like your browser storage is corrupted. ' +
        'Please clear your storage by going to Tools -> Clear Recent History -> Cookies' +
        ' and setting time range to "Everything". This will remove the corrupted browser storage across all sites.');
        /* eslint-enable no-alert */
      }
      return when.reject(e);
    });
};

/**
 * @return {LocalStorage}
 * @param {{type: string}} config Set to session to use sessionStorage
 * @constructor
 */
var LocalStorage = function (config) {
  if (!(this instanceof LocalStorage)) {
    return new LocalStorage(config);
  }

  this.storageType = config && config.type === 'session' ? 'sessionStorage' : 'localStorage';
};

/**
 * @param {string} name
 * @return {Promise}
 */
LocalStorage.prototype.get = function (name) {
  var storageType = this.storageType;

  return safePromise(function (resolve) {
    var value = window[storageType].getItem(name);

    resolve(when.attempt(JSON.parse, value).orElse(value));
  });
};

/**
 * @param {string} name
 * @param {object} value
 * @return {Promise}
 */
LocalStorage.prototype.set = function (name, value) {
  var storageType = this.storageType;

  return safePromise(function (resolve) {
    window[storageType].setItem(name, JSON.stringify(value));
    resolve(value);
  });
};

/**
 * @param {string} name
 * @return {Promise}
 */
LocalStorage.prototype.remove = function (name) {
  var storageType = this.storageType;

  return safePromise(function (resolve) {
    if (window[storageType].hasOwnProperty(name)) {
      window[storageType].removeItem(name);
    }
    resolve();
  });
};

/**
 * @param callback
 * @return {Promise}
 */
LocalStorage.prototype.each = function (callback) {
  var storageType = this.storageType;

  return safePromise(function (resolve) {
    var promises = [];
    var value;

    for (var item in window[storageType]) {
      if (window[storageType].hasOwnProperty(item)) {
        value = window[storageType].getItem(item);
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

/**
 * @param {string} name
 * @param {Function} callback
 * @return {Function}
 */
LocalStorage.prototype.on = function (name, callback) {
  function handleStorage(e) {
    e = e || window.event;

    if (e.key === name) {
      when.attempt(JSON.parse, e.newValue).
        orElse(e.newValue).
        then(callback);
    }
  }

  if (window.addEventListener) {
    window.addEventListener('storage', handleStorage, false);
  } else {
    window.attachEvent('onstorage', handleStorage);
  }

  return function () {
    if (window.removeEventListener) {
      window.removeEventListener('storage', handleStorage, false);
    } else {
      window.detachEvent('onstorage', handleStorage);
    }
  };
};

module.exports = LocalStorage;
