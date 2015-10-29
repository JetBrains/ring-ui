var DEFAULT_SPACE_NAME = 'memoryStorage';

/**
 * @prop {string} spaceName
 *
 * @param {{spaceName: string}} config
 * @return {MemoryStorage}
 * @constructor
 */
var MemoryStorage = function (config) {
  if (!(this instanceof MemoryStorage)) {
    return new MemoryStorage(config);
  }

  var spaceName = config && config.spaceName || DEFAULT_SPACE_NAME;
  this.space = MemoryStorage._storage[spaceName] || (MemoryStorage._storage[spaceName] = {});
};

MemoryStorage._storage = {};

/**
 * @param {string} key
 * @return {Promise}
 */
MemoryStorage.prototype.get = function (key) {
  let value = key in this.space ? this.space[key] : null;
  return Promise.resolve(value);
};

/**
 * @param {string} key
 * @param {object} value
 * @return {Promise}
 */
MemoryStorage.prototype.set = function (key, value) {
  if (key) {
    if (value !== null) {
      // We should store objects copies
      return new Promise(resolve => resolve(JSON.stringify(value))).then(string => {
        var result = JSON.parse(string);
        this.space[key] = result;
        return result;
      });
    } else {
      delete this.space[key];
    }
  }

  return Promise.resolve(value);
};

/**
 * @param {string} key
 * @return {Promise}
 */
MemoryStorage.prototype.remove = function (key) {
  return this.set(key, null);
};

/**
 *
 * @param {function(string, object)} callback
 * @return {Promise}
 */
MemoryStorage.prototype.each = function (callback) {
  if (typeof callback !== 'function') {
    return Promise.reject(new Error('Callback is not a function'));
  }

  var promises = [];
  for (var key in this.space) {
    if (this.space.hasOwnProperty(key)) {
      promises.push(callback(key, this.space[key]));
    }
  }
  return Promise.all(promises);
};

module.exports = MemoryStorage;
