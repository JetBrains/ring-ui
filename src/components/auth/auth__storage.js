'use strict';

var Storage = require('storage/storage');
var when = require('when');

/**
 * Custom storage for jso
 * @constructor
 * @param {{stateStoragePrefix: string, tokensStoragePrefix: string}} config
 */
var AuthStorage = function (config) {
  this.stateStoragePrefix = config.stateStoragePrefix;
  this.tokensStoragePrefix = config.tokensStoragePrefix;
  this._storage = new Storage();
};

/**
 *
 * @param id
 * @param state
 * @param {boolean=} secondTry
 */
AuthStorage.prototype.saveState = function (id, state, secondTry) {
  var self = this;

  return this._storage.set(this.stateStoragePrefix + id, state)
    .otherwise(function (e) {
      if (!secondTry) {
        return self.cleanStates().
          then(function () {
            self.saveState(id, state, true);
          });
      } else {
        return when.reject(e);
      }
    });
};

AuthStorage.prototype.cleanStates = function () {
  var self = this;
  return when.promise(function (resolve) {
    self._storage.each(function (item) {
      if (item.indexOf(self.stateStoragePrefix) === 0) {
        self._storage.remove(item);
        resolve(true);
      }
    }).owtherwise(function () {
      resolve(false);
    });
  });
};

AuthStorage.prototype.getState = function (id) {
  var self = this;
  return this._storage.get(this.stateStoragePrefix + id).
    then(function (result) {
      return self.cleanStates().then(function () {
        return result;
      });
    }, function (e) {
      return self.cleanStates().then(function () {
        return when.reject(e);
      });
    });
};

AuthStorage.prototype.saveToken = function (token) {
  return this._storage.set(this._tokensStoragePrefix, token);
};

AuthStorage.prototype.getToken = function () {
  return this._storage.get(this.tokensStoragePrefix);
};

AuthStorage.prototype.wipeToken = function () {
  return this._storage.remove(this.tokensStoragePrefix);
};

module.exports = AuthStorage;