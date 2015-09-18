var mixIn = require('mout/object/mixIn');

/* global window:true */
/**
 *  Create window as event target
 */
var window = mixIn({}, sinon.EventTarget);

/* global StorageEvent:true */
/**
 * Custom event
 * @constructor
 */
var StorageEvent = function StorageEvent(type, customData, target) {
  this.initEvent(type, false, false, target);
  mixIn(this, customData);
};

StorageEvent.prototype = new sinon.Event();

StorageEvent.prototype.constructor = StorageEvent;

/**
 * Mocked storage (initially borrowed from https://github.com/azu/mock-localstorage)
 * @constructor
 */
function MockedStorage() {
  var storage = {};

  var defaultProps = {
    writable: false,
    configurable: false,
    enumerable: false
  };

  function dispatchEvent(key, value) {
    var storageEvent = new StorageEvent('storage', {
      key: key,
      oldValue: storage[key],
      newValue: value,
      url: '/'
    });

    setTimeout(function () {
      window.dispatchEvent(storageEvent);
    }, 0)
  }

  Object.defineProperty(storage, 'getItem', mixIn({
    value: function (key) {
      if (arguments.length === 0) {
        throw new TypeError('Failed to execute \'getItem\' on \'Storage\': 1 argument required, but only 0 present.');
      }
      return storage[key.toString()] || null;
    }
  }, defaultProps));

  Object.defineProperty(storage, 'setItem', mixIn({
    value: function (key, value) {
      if (arguments.length < 2) {
        throw new TypeError('Failed to execute \'setItem\' on \'Storage\': 1 argument required, but only ' + arguments.length + ' present.');
      }

      var stringKey = String(key);
      var stringValue = String(value);

      dispatchEvent(stringKey, stringValue);
      storage[stringKey] = stringValue;
    }
  }, defaultProps));

  Object.defineProperty(storage, 'removeItem', mixIn({
    value: function (key) {
      if (arguments.length === 0) {
        throw new TypeError('Failed to execute \'removeItem\' on \'Storage\': 1 argument required, but only 0 present.');
      }

      var stringKey = String(key);
      dispatchEvent(stringKey, null);
      console.log('removeItem', stringKey);
      delete storage[stringKey];
    }
  }, defaultProps));

  Object.defineProperty(storage, 'length', {
    get: function () {
      return Object.keys(storage).length;
    },
    configurable: false,
    enumerable: false
  });

  Object.defineProperty(storage, 'clear', mixIn({
    value: function () {
      Object.keys(storage).forEach(function (key) {
        storage.removeItem(key);
      });
    }
  }, defaultProps));

  return storage;
}

window.localStorage = new MockedStorage();

module.exports = window;
