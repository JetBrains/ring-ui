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

var DEFAULT_STATE_QUOTA = 102400; // 100 kb ~~ 200 tabs with big scopes list
var DEFAULT_STATE_TTL = 1000 * 60 * 60 * 24 * 3; // nobody will need auth state after 3 days

/**
 * Custom storage for Auth
 * @constructor
 * @param {{stateKeyPrefix: string, tokenKey: string, onTokenRemove: Function}} config
 */
var AuthStorage = function (config) {
  this.stateKeyPrefix = config.stateKeyPrefix;
  this.tokenKey = config.tokenKey;
  this.stateTTL = config.stateTTL || DEFAULT_STATE_TTL;

  var StorageConstructor = config.storage || Storage;
  this.stateQuota = Math.min(config.stateQuota || DEFAULT_STATE_QUOTA, StorageConstructor.QUOTA || Infinity);

  this._stateStorage = new StorageConstructor({
    cookieName: 'ring-state'
  });
  this._tokenStorage = new StorageConstructor({
    cookieName: 'ring-token'
  });
};

/**
 * Add token change listener
 * @param {function(string)} fn Token change listener
 * @return {function()} remove listener function
 */
AuthStorage.prototype.onTokenChange = function(fn) {
  return this._tokenStorage.on(this.tokenKey, fn);
};

/**
 * Add state change listener
 * @param {string} stateKey State key
 * @param {function(string)} fn State change listener
 * @return {function()} remove listener function
 */
AuthStorage.prototype.onStateChange = function(stateKey, fn) {
  return this._stateStorage.on(this.stateKeyPrefix + stateKey, fn);
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

  state.created = Date.now();

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
 * @return {Promise} promise that is resolved when OLD states [and some selected] are removed
 */
AuthStorage.prototype.cleanStates = function (removeStateId) {
  var self = this;
  var now = Date.now();

  return this._stateStorage.each(function (key, state) {
    // Remove requested state
    if (key === self.stateKeyPrefix + removeStateId) {
      return self._stateStorage.remove(key);
    }

    if (key.indexOf(self.stateKeyPrefix) === 0) {
      // Clean old states
      if (state.created + self.stateTTL < now) {
        return self._stateStorage.remove(key);
      }

      // Data to clean up due quota
      return {
        key: key,
        created: state.created,
        size: JSON.stringify(state).length
      };
    }
  }).then(function(removalResult) {
    var currentStates = removalResult.filter(function (state) {
      return state;
    });

    var stateStorageSize = currentStates.reduce(function (overallSize, state) {
      return state.size + overallSize;
    }, 0);

    if (stateStorageSize > self.stateQuota) {
      currentStates.sort(function(a, b) {
        return a.created < b.created;
      });

      var removalPromises = currentStates.filter(function (state) {
        if (stateStorageSize > self.stateQuota) {
          stateStorageSize -= state.size;
          return true;
        }

        return false;
      }).map(function (state) {
        self._stateStorage.remove(state.key);
      });

      return removalPromises.length && when.all(removalPromises);
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
      return self.cleanStates(id).then(function () {
        return result;
      });
    }, function (e) {
      return self.cleanStates(id).then(function () {
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
