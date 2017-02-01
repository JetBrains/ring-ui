/* global window:true StorageEvent:true */

/**
 *  Create window as event target
 */
const window = Object.assign({}, sinon.EventTarget);

/**
 * Custom event
 * @param {string} type Event type
 * @param {Object} customData Custom data
 * @param {string} target Event target
 * @constructor
 */
function StorageEvent(type, customData, target) {
  this.initEvent(type, false, false, target);
  Object.assign(this, customData);
}

StorageEvent.prototype = new sinon.Event();

StorageEvent.prototype.constructor = StorageEvent;

/**
 * Mocked storage (initially borrowed from https://github.com/azu/mock-localstorage)
 * @constructor
 */
function MockedStorage() {
  const storage = {};

  const defaultProps = {
    writable: false,
    configurable: false,
    enumerable: false
  };

  function dispatchEvent(key, value) {
    const storageEvent = new StorageEvent('storage', {
      key,
      oldValue: storage[key],
      newValue: value,
      url: '/'
    });

    setTimeout(() => {
      window.dispatchEvent(storageEvent);
    }, 0);
  }

  Reflect.defineProperty(storage, 'getItem', Object.assign({
    value: function getItem(key) {
      if (arguments.length === 0) {
        throw new TypeError('Failed to execute \'getItem\' on \'Storage\': 1 argument required, but only 0 present.');
      }
      return storage[key.toString()] || null;
    }
  }, defaultProps));

  Reflect.defineProperty(storage, 'setItem', Object.assign({
    value: function setItem(key, value) {
      const stringKey = String(key);
      const stringValue = String(value);

      if (arguments.length <= 1) {
        throw new TypeError(`Failed to execute 'setItem' on 'Storage': 2 arguments required, but only ${arguments.length} present.`);
      }

      dispatchEvent(stringKey, stringValue);
      storage[stringKey] = stringValue;
    }
  }, defaultProps));

  Reflect.defineProperty(storage, 'removeItem', Object.assign({
    value: function removeItem(key) {
      const stringKey = String(key);

      if (arguments.length === 0) {
        throw new TypeError('Failed to execute \'removeItem\' on \'Storage\': 1 argument required, but only 0 present.');
      }

      dispatchEvent(stringKey, null);
      Reflect.deleteProperty(storage, stringKey);
    }
  }, defaultProps));

  Reflect.defineProperty(storage, 'length', {
    get: function length() {
      return Object.keys(storage).length;
    },
    configurable: false,
    enumerable: false
  });

  Reflect.defineProperty(storage, 'clear', Object.assign({
    value: function clear() {
      Object.keys(storage).forEach(key => {
        storage.removeItem(key);
      });
    }
  }, defaultProps));

  return storage;
}

window.localStorage = new MockedStorage();

export default window;
