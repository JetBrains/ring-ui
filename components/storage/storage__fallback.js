import deepEquals from 'mout/lang/deepEquals';

/**
 * @prop {string} cookieName
 *
 * @param {{cookieName: string}} config
 * @param {{checkDelay: number}} config
 * @param {{type: string}} config
 * @return {FallbackStorage}
 * @constructor
 */
export default class FallbackStorage {
  static DEFAULT_COOKIE_NAME = 'localStorage';
  static DEFAULT_SESSION_COOKIE_NAME = 'sessionStorage';
  static DEFAULT_CHECK_DELAY = 3000;
  static COOKIE_EXPIRES = 365;

  /**
   * Maximum storage size
   * @see http://browsercookielimits.squawky.net/
   * @type {number}
   */
  static QUOTA = 4093;

  /**
   * @param {string} name
   * @param {string} value
   * @param {number} days
   * @private
   */
  static _createCookie(name, value, days) {
    let date;
    let expires;

    if (days) {
      date = new Date();
      date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
      expires = `; expires=${date.toGMTString()}`;
    } else {
      expires = ';';
    }

    document.cookie = `${name}=${value}${expires}; path=/`;
  }

  /**
   *
   * @param {string} name
   * @return {string}
   * @private
   */
  static _readCookie(name) {
    const nameEQ = `${name}=`;
    const cookies = document.cookie.split(';');

    let cookie;
    for (let i = 0; i < cookies.length; i++) {
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

  constructor(config = {}) {
    const session = config.type === 'session';

    this.cookieName = config.cookieName ||
      (
        session
        ? this.constructor.DEFAULT_SESSION_COOKIE_NAME
        : this.constructor.DEFAULT_COOKIE_NAME
      );
    this.checkDelay = config.checkDelay || this.constructor.DEFAULT_CHECK_DELAY;
    this.expires = session ? this.constructor.COOKIE_EXPIRES : null;
  }

  /**
   * @return {Promise}
   * @private
   */
  _read() {
    return new Promise(resolve => {
      const rawData = FallbackStorage._readCookie(this.cookieName);
      resolve(JSON.parse(decodeURIComponent(rawData)));
    }).catch(() => ({}));
  }

  /**
   * @param data
   * @return {Promise}
   * @private
   */
  _write(data) {
    return new Promise(resolve => {
      const stringData = encodeURIComponent(JSON.stringify(data));
      FallbackStorage.
        _createCookie(this.cookieName, stringData === '{}' ? '' : stringData, this.expires);
      return resolve(data);
    });
  }

  /**
   * @param {string} key
   * @return {Promise}
   */
  get(key) {
    return this._read().then(data => data[key] || null);
  }

  /**
   * @param {string} key
   * @param {object} value
   * @return {Promise}
   */
  set(key, value) {
    return this._read().then(data => {
      if (key) {
        if (value != null) {
          data[key] = value;
        } else {
          Reflect.deleteProperty(data, key);
        }
      }

      return this._write(data);
    });
  }

  /**
   * @param {string} key
   * @return {Promise}
   */
  remove(key) {
    return this.set(key, null);
  }

  /**
   *
   * @param {function(string, value)} callback
   * @return {Promise}
   */
  each(callback) {
    if (typeof callback !== 'function') {
      return Promise.reject(new Error('Callback is not a function'));
    }

    return this._read().then(data => {
      const promises = [];
      for (const key in data) {
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
  on(key, callback) {
    let stop = false;

    const checkForChange = oldValue => {
      this.get(key).then(newValue => {
        if (stop) {
          return;
        }

        if (!deepEquals(oldValue, newValue)) {
          callback(newValue);
        }

        window.setTimeout(() => checkForChange(oldValue), this.checkDelay);
      });
    };

    this.get(key).then(checkForChange);

    return () => {
      stop = true;
    };
  }
}
