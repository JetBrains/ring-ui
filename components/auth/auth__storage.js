var Storage = require('storage/storage');
var when = require('when');

/**
 * @typedef {{
 *   access_token: string,
 *   scopes: string[],
 *   expires: number
 * }} StoredToken
 */

/**
 * @typedef {{
 *   restoreLocation: string,
 *   scopes: string[]
 * }} StoredState
 */

/**
 * Custom storage for Auth
 * @constructor
 * @param {{stateKeyPrefix: string, tokenKey: string, onTokenRemove: Function}} config
 */
var AuthStorage = function (config) {
  this.stateKeyPrefix = config.stateKeyPrefix;
  this.tokenKey = config.tokenKey;

  var StorageConstructor = config.storage || Storage;
  this._stateStorage = this._tokenStorage = new StorageConstructor();
};

/**
 * Add token change listener
 * @param {function(string)} fn Token change listener
 * @return {function()} remove listener function
 */
AuthStorage.prototype.onTokenChange = function(fn) {
  return this._tokenStorage.on(this.tokenKey, function (tokenValue) {
    fn(tokenValue);
  });
};

/**
 * Save authentication request state.
 *
 * @param {string} id Unique state identifier
 * @param {StoredState} state State to store
 * @param {boolean=} dontCleanAndRetryOnFail If falsy then remove all stored states and try again to save state
 */
AuthStorage.prototype.saveState = function (id, state, dontCleanAndRetryOnFail) {
  var self = this;

  return this._stateStorage.set(this.stateKeyPrefix + id, state)
    .otherwise(function (e) {
      if (!dontCleanAndRetryOnFail) {
        return self.cleanStates().
          then(function () {
            self.saveState(id, state, true);
          });
      } else {
        return when.reject(e);
      }
    });
};

/**
 * Remove all stored states
 *
 * @return {Promise} promise that is resolved when all states are removed
 */
AuthStorage.prototype.cleanStates = function () {
  var self = this;
  return this._stateStorage.each(function (item) {
    if (item.indexOf(self.stateKeyPrefix) === 0) {
      return self._stateStorage.remove(item);
    }
  });
};

/**
 * Get state by id and remove stored states from the storage.
 *
 * @param {string} id unique state identifier
 * @return {Promise.<StoredState>}
 */
AuthStorage.prototype.getState = function (id) {
  var self = this;
  return this._stateStorage.get(this.stateKeyPrefix + id).
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

/**
 * @param {StoredToken} token
 * @return {Promise} promise that is resolved when the token is saved
 */
AuthStorage.prototype.saveToken = function (token) {
  return this._tokenStorage.set(this.tokenKey, token);
};

/**
 * @return {Promise.<StoredToken>} promise that is resolved to the stored token
 */
AuthStorage.prototype.getToken = function () {
  return this._tokenStorage.get(this.tokenKey);
};

/**
 * Remove stored token if any.
 * @return {Promise} promise that is resolved when the token is wiped.
 */
AuthStorage.prototype.wipeToken = function () {
  return this._tokenStorage.remove(this.tokenKey);
};

module.exports = AuthStorage;
