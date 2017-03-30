import Storage from '../storage/storage';

/**
 * @typedef {Object} StoredToken
 * @property {string} access_token
 * @property {string[]} scopes
 * @property {number} expires
 */

/**
 * @typedef {Object} StoredState
 * @property {string} restoreLocation
 * @property {string[]} scopes
 */

const DEFAULT_STATE_QUOTA = 102400; // 100 kb ~~ 200 tabs with a large list of scopes
const DEFAULT_STATE_TTL = 1000 * 60 * 60 * 24 * 3; // nobody will need auth state after 3 days

export default class AuthStorage {
  /**
   * Custom storage for Auth
   * @param {{stateKeyPrefix: string, tokenKey: string, onTokenRemove: Function}} config
   */
  constructor(config) {
    this.stateKeyPrefix = config.stateKeyPrefix;
    this.tokenKey = config.tokenKey;
    this.stateTTL = config.stateTTL || DEFAULT_STATE_TTL;

    const StorageConstructor = config.storage || Storage;
    this.stateQuota = Math.min(config.stateQuota || DEFAULT_STATE_QUOTA, StorageConstructor.QUOTA || Infinity);

    this._stateStorage = new StorageConstructor({
      cookieName: 'ring-state'
    });
    this._tokenStorage = new StorageConstructor({
      cookieName: 'ring-token'
    });
  }

  /**
   * Add token change listener
   * @param {function(string)} fn Token change listener
   * @return {function()} remove listener function
   */
  onTokenChange(fn) {
    return this._tokenStorage.on(this.tokenKey, fn);
  }

  /**
   * Add state change listener
   * @param {string} stateKey State key
   * @param {function(string)} fn State change listener
   * @return {function()} remove listener function
   */
  onStateChange(stateKey, fn) {
    return this._stateStorage.on(this.stateKeyPrefix + stateKey, fn);
  }

  /**
   * Save authentication request state.
   *
   * @param {string} id Unique state identifier
   * @param {StoredState} state State to store
   * @param {boolean=} dontCleanAndRetryOnFail If falsy then remove all stored states and try again to save state
   */
  saveState(id, state, dontCleanAndRetryOnFail) {
    state.created = Date.now();

    return this._stateStorage.set(this.stateKeyPrefix + id, state).
      catch(e => {
        if (!dontCleanAndRetryOnFail) {
          return this.cleanStates().then(() => this.saveState(id, state, true));
        } else {
          return Promise.reject(e);
        }
      });
  }

  /**
   * Remove all stored states
   *
   * @return {Promise} promise that is resolved when OLD states [and some selected] are removed
   */
  cleanStates(removeStateId) {
    const now = Date.now();

    return this._stateStorage.each((key, state) => {
      // Remove requested state
      if (key === this.stateKeyPrefix + removeStateId) {
        return this._stateStorage.remove(key);
      }

      if (key.indexOf(this.stateKeyPrefix) === 0) {
        // Clean old states
        if (state.created + this.stateTTL < now) {
          return this._stateStorage.remove(key);
        }

        // Data to clean up due quota
        return {
          key,
          created: state.created,
          size: JSON.stringify(state).length
        };
      }

      return undefined;
    }).then(removalResult => {
      const currentStates = removalResult.filter(state => state);

      let stateStorageSize = currentStates.reduce((overallSize, state) => state.size + overallSize, 0);

      if (stateStorageSize > this.stateQuota) {
        currentStates.sort((a, b) => a.created > b.created);

        const removalPromises = currentStates.filter(state => {
          if (stateStorageSize > this.stateQuota) {
            stateStorageSize -= state.size;
            return true;
          }

          return false;
        }).map(state => {
          this._stateStorage.remove(state.key);
        });

        return removalPromises.length && Promise.all(removalPromises);
      }

      return undefined;
    });
  }

  /**
   * Get state by id and remove stored states from the storage.
   *
   * @param {string} id unique state identifier
   * @return {Promise.<StoredState>}
   */
  getState(id) {
    return this._stateStorage.get(this.stateKeyPrefix + id).
      then(
        result => this.cleanStates(id).then(() => result),
        e => this.cleanStates(id).then(() => Promise.reject(e))
      );
  }

  /**
   * @param {StoredToken} token
   * @return {Promise} promise that is resolved when the token is saved
   */
  saveToken(token) {
    return this._tokenStorage.set(this.tokenKey, token);
  }

  /**
   * @return {Promise.<StoredToken>} promise that is resolved to the stored token
   */
  getToken() {
    return this._tokenStorage.get(this.tokenKey);
  }

  /**
   * Remove stored token if any.
   * @return {Promise} promise that is resolved when the token is wiped.
   */
  wipeToken() {
    return this._tokenStorage.remove(this.tokenKey);
  }
}

