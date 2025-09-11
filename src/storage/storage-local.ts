import alert from '../alert-service/alert-service';
import {type StorageInterface, type StorageConfig} from './storage';

/**
 * @return {LocalStorage}
 * @param {{type: string}} config Set to "session" to use sessionStorage
 * @constructor
 */
export default class LocalStorage implements StorageInterface {
  static async safePromise<T>(
    resolver: (resolve: (value: T | PromiseLike<T>) => void, reject: (reason?: unknown) => void) => void,
  ) {
    try {
      return await new Promise(resolver);
    } catch (e) {
      if (e instanceof Error && e.name === 'NS_ERROR_FILE_CORRUPTED') {
        alert.error(
          'Sorry, it looks like your browser storage is corrupted. ' +
            'Please clear your storage by going to Tools -> Clear Recent History -> Cookies' +
            ' and setting time range to "Everything". This will remove the corrupted browser storage across all sites.',
        );
      }
      throw e;
    }
  }

  storageType: 'sessionStorage' | 'localStorage';
  constructor(config: StorageConfig = {}) {
    this.storageType = config.type === 'session' ? 'sessionStorage' : 'localStorage';
  }

  /**
   * @param {string} name
   * @return {Promise}
   */
  get<T>(name: string) {
    return LocalStorage.safePromise<T | null>(resolve => {
      const value = window[this.storageType].getItem(name);
      if (value) {
        try {
          resolve(JSON.parse(value));
        } catch (e) {
          resolve(value as never);
        }
      } else {
        resolve(null);
      }
    });
  }

  /**
   * @param {string} name
   * @param {object} value
   * @return {Promise}
   */
  set<T>(name: string, value: T) {
    return LocalStorage.safePromise<T>(resolve => {
      window[this.storageType].setItem(name, JSON.stringify(value));
      resolve(value);
    });
  }

  /**
   * @param {string} name
   * @return {Promise}
   */
  remove(name: string) {
    const storageType = this.storageType;

    return LocalStorage.safePromise<void>(resolve => {
      if (Object.prototype.hasOwnProperty.call(window[storageType], name)) {
        window[storageType].removeItem(name);
      }
      resolve();
    });
  }

  /**
   * @param callback
   * @return {Promise}s
   */
  each<R>(callback: (item: string, value: unknown) => R | Promise<R>) {
    const storageType = this.storageType;

    return LocalStorage.safePromise<R[]>(resolve => {
      const promises = [];

      for (const item in window[storageType]) {
        if (Object.prototype.hasOwnProperty.call(window[storageType], item)) {
          const value = window[storageType].getItem(item);
          let resolvedValue: unknown = null;
          if (value) {
            try {
              resolvedValue = JSON.parse(value);
            } catch (e) {
              resolvedValue = value;
            }
          }

          promises.push(Promise.resolve(callback(item, resolvedValue)));
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
  on<T>(name: string, callback: (value: T | null) => void) {
    function handleStorage(e: StorageEvent) {
      if (e.key === name) {
        if (e.newValue) {
          try {
            callback(JSON.parse(e.newValue));
          } catch (err) {
            callback(e.newValue as never);
          }
        } else {
          callback(null);
        }
      }
    }

    window.addEventListener('storage', handleStorage, false);

    return () => window.removeEventListener('storage', handleStorage, false);
  }
}
