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
 * @param secondTry
 */
AuthStorage.prototype.saveState = function (id, state, secondTry) {
  var self = this;

  return this._storage.set(this.stateStoragePrefix + id, state)
    .otherwise(function (e) {
      if (!secondTry && self.cleanStates()) {
        return self.saveState(id, state, true);
      } else {
        return when.reject(e);
      }
    });
};

AuthStorage.prototype.cleanStates = function () {
  var self = this;
  var cleaned = false;

  this._storage.each(function (item) {
    if (item.indexOf(self.stateStoragePrefix) === 0) {
      self._storage.remove(item);
      cleaned = true;
    }
  }).fail(function () {
    cleaned = null;
  });

  return cleaned;
};

AuthStorage.prototype.getState = function (id) {
  var state;
  var self = this;

  this._storage.get(this.stateStoragePrefix + id).done(function (result) {
    state = result;
    self.cleanStates();
  });

  return state;
};

AuthStorage.prototype.saveTokens = function (provider, tokens) {
  this._storage.set(this.tokensStoragePrefix + provider, tokens);
};

AuthStorage.prototype.getTokens = function (provider) {
  var tokens = [];

  this._storage.get(this.tokensStoragePrefix + provider).done(function (result) {
    tokens = result;
  });

  return tokens;
};

AuthStorage.prototype.wipeTokens = function (provider) {
  this._storage.remove(this.tokensStoragePrefix + provider);
};

module.exports = AuthStorage;