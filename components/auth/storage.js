import Storage from '../storage/storage';
import sniffr from '../global/sniffer';

/**
 * @typedef {Object} StoredToken
 * @property {string} accessToken
 * @property {string[]} scopes
 * @property {number} expires
 */

/**
 * @typedef {Object} StoredState
 * @property {Date} created
 * @property {string} restoreLocation
 * @property {string[]} scopes
 */

const DEFAULT_STATE_QUOTA = 102400; // 100 kb ~~ 200 tabs with a large list of scopes
// eslint-disable-next-line no-magic-numbers
const DEFAULT_STATE_TTL = 1000 * 60 * 60 * 24; // nobody will need auth state after a day
const UPDATE_USER_TIMEOUT = 1000;
const isIE11 = sniffr.browser.name === 'ie' && sniffr.browser.versionString === '11.0';

export default class AuthStorage {
  /**
   * Custom storage for Auth
   * @param {{stateKeyPrefix: string, tokenKey: string, onTokenRemove: Function}} config
   */
  constructor(config) {
    this.messagePrefix = config.messagePrefix || '';
    this.stateKeyPrefix = config.stateKeyPrefix;
    this.tokenKey = config.tokenKey;
    this.userKey = config.userKey || 'user-key';
    this.stateTTL = config.stateTTL || DEFAULT_STATE_TTL;
    this._lastMessage = null;

    const StorageConstructor = config.storage || Storage;
    this.stateQuota = Math.min(
      config.stateQuota ||
      DEFAULT_STATE_QUOTA,
      StorageConstructor.QUOTA || Infinity
    );

    this._stateStorage = new StorageConstructor({
      cookieName: 'ring-state'
    });
    this._tokenStorage = new StorageConstructor({
      cookieName: 'ring-token'
    });
    this._messagesStorage = new StorageConstructor({
      cookieName: 'ring-message'
    });
    this._currentUserStorage = new StorageConstructor({
      cookieName: 'ring-user'
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
   * Add state change listener
   * @param {string} key State key
   * @param {function(string)} fn State change listener
   * @return {function()} remove listener function
   */
  onMessage(key, fn) {
    return this._messagesStorage.on(this.messagePrefix + key, message => {
      //IE11 triggers storage events on same window where localStorage was updated
      if (isIE11 && message === this._lastMessage) {
        return null;
      }
      return fn(message);
    });
  }

  sendMessage(key, message = null) {
    this._lastMessage = message;
    this._messagesStorage.set(this.messagePrefix + key, message);
  }

  /**
   * Save authentication request state.
   *
   * @param {string} id Unique state identifier
   * @param {StoredState} state State to store
   * @param {boolean=} dontCleanAndRetryOnFail If falsy then remove all stored states and try again to save state
   */
  async saveState(id, state, dontCleanAndRetryOnFail) {
    state.created = Date.now();

    try {
      await this._stateStorage.set(this.stateKeyPrefix + id, state);
    } catch (e) {
      if (!dontCleanAndRetryOnFail) {
        await this.cleanStates();
        return this.saveState(id, state, true);
      } else {
        throw e;
      }
    }
    return undefined;
  }

  /**
   * Remove all stored states
   *
   * @return {Promise} promise that is resolved when OLD states [and some selected] are removed
   */
  async cleanStates(removeStateId) {
    const now = Date.now();

    const removalResult = await this._stateStorage.each((key, state) => {
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
    });
    const currentStates = removalResult.filter(state => state);

    let stateStorageSize = currentStates.
      reduce((overallSize, state) => state.size + overallSize, 0);

    if (stateStorageSize > this.stateQuota) {
      currentStates.sort((a, b) => a.created > b.created);

      const removalPromises = currentStates.filter(state => {
        if (stateStorageSize > this.stateQuota) {
          stateStorageSize -= state.size;
          return true;
        }

        return false;
      }).map(state => this._stateStorage.remove(state.key));

      return removalPromises.length && Promise.all(removalPromises);
    }

    return undefined;
  }

  /**
   * Get state by id and remove stored states from the storage.
   *
   * @param {string} id unique state identifier
   * @return {Promise.<StoredState>}
   */
  async getState(id) {
    try {
      const result = await this._stateStorage.get(this.stateKeyPrefix + id);
      await this.cleanStates(id);
      return result;
    } catch (e) {
      await this.cleanStates(id);
      throw e;
    }
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

  /**
   * @param {function} loadUser user loader
   * @return {Promise.<object>>} promise that is resolved to stored current user
   */
  async getCachedUser(loadUser) {
    const user = await this._currentUserStorage.get(this.userKey);
    const loadAndCache = () => loadUser().then(response => {
      this._currentUserStorage.set(this.userKey, response);
      return response;
    });

    if (user && user.id) {
      setTimeout(loadAndCache, UPDATE_USER_TIMEOUT);
      return user;
    } else {
      return loadAndCache();
    }
  }

  /**
   * Remove cached user if any
   */
  wipeCachedCurrentUser() {
    return this._currentUserStorage.remove(this.userKey);
  }

  /**
   * Wipes cache if user has changed
   */
  onUserChanged() {
    this.wipeCachedCurrentUser();
  }
}

