import Listeners from '../global/listeners';

export default class InMemoryFallbackStorage {
  map = new Map();

  isInMemory = true;

  listeners = new Listeners();

  async get(key) {
    return await this.map.get(key);
  }

  async set(key, value) {
    return await this.map.set(key, value);
  }

  remove(key) {
    return this.map.delete(key);
  }

  /**
   *
   * @param {function(string, value)} callback
   * @return {Promise}
   */
  async each(callback) {
    const entries = await this.map.entries();
    return Promise.all(
      [...entries].map((key, value) => callback(key, value))
    );
  }

  /**
   * @param {string} key
   * @param {Function} callback
   * @return {Function}
   */
  on(key, callback) {
    const {listeners} = this;

    listeners.add(key, callback);

    return () => listeners.remove(key, callback);
  }
}
