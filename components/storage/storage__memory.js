/**
 * @prop {string} spaceName
 *
 * @param {{spaceName: string}} config
 * @return {MemoryStorage}
 * @constructor
 */
export default class MemoryStorage {
  static DEFAULT_SPACE_NAME = 'memoryStorage';
  static _storage = {};

  constructor(config) {
    const spaceName = config && config.spaceName || this.constructor.DEFAULT_SPACE_NAME;
    this.space = MemoryStorage._storage[spaceName] || (MemoryStorage._storage[spaceName] = {});
  }

  /**
   * @param {string} key
   * @return {Promise}
   */
  get(key) {
    const value = key in this.space ? this.space[key] : null;
    return Promise.resolve(value);
  }

  /**
   * @param {string} key
   * @param {object} value
   * @return {Promise}
   */
  set(key, value) {
    if (key) {
      if (value !== null) {
        // We should store objects copies
        return new Promise(resolve => resolve(JSON.stringify(value))).then(string => {
          const result = JSON.parse(string);
          this.space[key] = result;
          return result;
        });
      } else {
        Reflect.deleteProperty(this.space, key);
      }
    }

    return Promise.resolve(value);
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
   * @param {function(string, object)} callback
   * @return {Promise}
   */
  each(callback) {
    if (typeof callback !== 'function') {
      return Promise.reject(new Error('Callback is not a function'));
    }

    const promises = [];
    for (const key in this.space) {
      if (this.space.hasOwnProperty(key)) {
        promises.push(callback(key, this.space[key]));
      }
    }

    return Promise.all(promises);
  }
}
