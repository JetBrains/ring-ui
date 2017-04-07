/**
 * @return {LocalStorage}
 * @param {{type: string}} config Set to "session" to use sessionStorage
 * @constructor
 */
export default class LocalStorage {
  static async safePromise(resolver) {
    try {
      return await new Promise(resolver);
    } catch (e) {
      if (e && e.name === 'NS_ERROR_FILE_CORRUPTED') {
        /* eslint-disable no-alert */
        window.alert('Sorry, it looks like your browser storage is corrupted. ' +
        'Please clear your storage by going to Tools -> Clear Recent History -> Cookies' +
        ' and setting time range to "Everything". This will remove the corrupted browser storage across all sites.');
        /* eslint-enable no-alert */
      }
      throw e;
    }
  }

  constructor(config = {}) {
    this.storageType = config.type === 'session' ? 'sessionStorage' : 'localStorage';
  }

  /**
   * @param {string} name
   * @return {Promise}
   */
  get(name) {
    return this.constructor.safePromise(resolve => {
      const value = window[this.storageType].getItem(name);
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
  set(name, value) {
    return this.constructor.safePromise(resolve => {
      window[this.storageType].setItem(name, JSON.stringify(value));
      resolve(value);
    });
  }

  /**
   * @param {string} name
   * @return {Promise}
   */
  remove(name) {
    const storageType = this.storageType;

    return this.constructor.safePromise(resolve => {
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
  each(callback) {
    const storageType = this.storageType;

    return this.constructor.safePromise(resolve => {
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
  }

  /**
   * @param {string} name
   * @param {Function} callback
   * @return {Function}
   */
  on(name, callback) {
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

    return () => window.removeEventListener('storage', handleStorage, false);
  }
}
