var when = require('when');

var DEFAULT_SPACE_NAME = 'memoryStorage';

/**
 * @prop {string} spaceName
 *
 * @param {{spaceName: string}} config
 * @return {MemoryStorage}
 * @constructor
 */
var MemoryStorage = function(config) {
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
MemoryStorage.prototype.get = function(key) {
  return when(key in this.space ? this.space[key] : null);
};

/**
 * @param {string} key
 * @param {object} value
 * @return {Promise}
 */
MemoryStorage.prototype.set = function(key, value) {
  var space = this.space;

  if (key) {
    if (value != null) {
      // We should store objects copies
      return when.attempt(JSON.stringify, value).then(function (string) {
        var result = JSON.parse(string);
        space[key] = result;
        return result;
      });
    } else {
      delete space[key];
    }
  }

  return when(value);
};

/**
 * @param {string} key
 * @return {Promise}
 */
MemoryStorage.prototype.remove = function(key) {
  return this.set(key, null);
};

/**
 *
 * @param {function(string, object)} callback
 * @return {Promise}
 */
MemoryStorage.prototype.each = function(callback) {
  if (typeof callback !== 'function') {
    return when.reject(new Error('Callback is not a function'));
  }

  var promises = [];
  for (var key in this.space) {
    if (this.space.hasOwnProperty(key)) {
      promises.push(callback(key, this.space[key]));
    }
  }
  return when.all(promises);
};

module.exports = MemoryStorage;
