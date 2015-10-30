function safePromise(resolver) {
  return new Promise(resolver)
    .catch(e => {
      if (e && e.name === 'NS_ERROR_FILE_CORRUPTED') {
        /* eslint-disable no-alert */
        window.alert('Sorry, it looks like your browser storage is corrupted. ' +
        'Please clear your storage by going to Tools -> Clear Recent History -> Cookies' +
        ' and setting time range to "Everything". This will remove the corrupted browser storage across all sites.');
        /* eslint-enable no-alert */
      }
      return Promise.reject(e);
    });
}

/**
 * @return {LocalStorage}
 * @param {{type: string}} config Set to "session" to use sessionStorage
 * @constructor
 */
function LocalStorage(config) {
  if (!(this instanceof LocalStorage)) {
    return new LocalStorage(config);
  }

  this.storageType = config && config.type === 'session' ? 'sessionStorage' : 'localStorage';
}

/**
 * @param {string} name
 * @return {Promise}
 */
LocalStorage.prototype.get = function (name) {
  const storageType = this.storageType;

  return safePromise(resolve => {
    const value = window[storageType].getItem(name);
    try {
      resolve(JSON.parse(value));
    } catch (e) {
      resolve(value);
    }
  });
};

/**
 * @param {string} name
 * @param {object} value
 * @return {Promise}
 */
LocalStorage.prototype.set = function (name, value) {
  return safePromise(resolve => {
    window[this.storageType].setItem(name, JSON.stringify(value));
    resolve(value);
  });
};

/**
 * @param {string} name
 * @return {Promise}
 */
LocalStorage.prototype.remove = function (name) {
  const storageType = this.storageType;

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
  const storageType = this.storageType;

  return safePromise(function (resolve) {
    const promises = [];

    for (const item in window[storageType]) {
      if (window[storageType].hasOwnProperty(item)) {
        let value = window[storageType].getItem(item);
        try {
          value = JSON.parse(value);
        } catch (e) {
          // Do nothing
        }

        promises.push(Promise.resolve(callback(item, value)));
      }
    }

    resolve(Promise.all(promises));
  });
};

/**
 * @param {string} name
 * @param {Function} callback
 * @return {Function}
 */
LocalStorage.prototype.on = function (name, callback) {
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
    window.removeEventListener('storage', handleStorage, false);
  };
};

module.exports = LocalStorage;
