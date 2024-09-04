import deepEqual from 'deep-equal';

import {StorageInterface, StorageConfig} from './storage';

const DEFAULT_CHECK_DELAY = 3000;
const COOKIE_EXPIRES = 365;
const QUOTA = 4093;
// eslint-disable-next-line @typescript-eslint/no-magic-numbers
const SECONDS_IN_DAY = 24 * 60 * 60 * 1000;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Data = Record<string, any>

// TODO: Drop in Ring UI 7.0

/**
 * @prop {string} cookieName
 *
 * @param {{cookieName: string}} config
 * @param {{checkDelay: number}} config
 * @param {{type: string}} config
 * @return {FallbackStorage}
 * @constructor
 */
export default class FallbackStorage implements StorageInterface {
  static DEFAULT_COOKIE_NAME = 'localStorage';
  static DEFAULT_SESSION_COOKIE_NAME = 'sessionStorage';
  static DEFAULT_CHECK_DELAY = DEFAULT_CHECK_DELAY;
  static COOKIE_EXPIRES = COOKIE_EXPIRES;

  /**
   * Maximum storage size
   * @see http://browsercookielimits.squawky.net/
   * @type {number}
   */
  static QUOTA = QUOTA;

  /**
   * @param {string} name
   * @param {string} value
   * @param {number} days
   * @private
   */
  private static _createCookie(name: string, value: string, days: number | null) {
    let date;
    let expires;

    if (days) {
      date = new Date();
      date.setTime(date.getTime() + (days * SECONDS_IN_DAY));
      expires = `; expires=${date.toUTCString()}`;
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
  private static _readCookie(name: string) {
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

  cookieName: string;
  checkDelay: number;
  expires: number | null;
  constructor(config: StorageConfig = {}) {
    const session = config.type === 'session';

    this.cookieName = config.cookieName ||
      (
        session
          ? FallbackStorage.DEFAULT_SESSION_COOKIE_NAME
          : FallbackStorage.DEFAULT_COOKIE_NAME
      );
    this.checkDelay = config.checkDelay || FallbackStorage.DEFAULT_CHECK_DELAY;
    this.expires = session ? FallbackStorage.COOKIE_EXPIRES : null;
  }

  /**
   * @return {Promise}
   * @private
   */
  private _read(): Promise<Data> {
    return new Promise<Data>((resolve, reject) => {
      const rawData = FallbackStorage._readCookie(this.cookieName);
      if (rawData != null) {
        resolve(JSON.parse(decodeURIComponent(rawData)));
      } else {
        reject();
      }
    }).catch(() => ({}));
  }

  /**
   * @param data
   * @return {Promise}
   * @private
   */
  private _write(data: Data) {
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
  get(key: string) {
    return this._read().then(data => data[key] || null);
  }

  /**
   * @param {string} key
   * @param {object} value
   * @return {Promise}
   */
  async set<T>(key: string, value: T | null) {
    const data = await this._read();
    if (key) {
      if (value != null) {
        data[key] = value;
      } else {
        Reflect.deleteProperty(data, key);
      }
    }

    await this._write(data);
    return value;
  }

  /**
   * @param {string} key
   * @return {Promise}
   */
  async remove(key: string) {
    await this.set(key, null);
  }

  /**
   *
   * @param {function(string, value)} callback
   * @return {Promise}
   */
  each<R>(callback: (item: string, value: unknown) => R | Promise<R>) {
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
  on<T>(key: string, callback: (value: T | null) => void) {
    let stop = false;

    const checkForChange = (oldValue: T | null) => {
      this.get(key).then(newValue => {
        if (stop) {
          return;
        }

        if (!deepEqual(oldValue, newValue)) {
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
