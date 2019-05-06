import LocalStorage from './storage__local';
import FallbackStorage from './storage__fallback';

/**
 * @name Storage
 */

/**
 * @constructor
 * @extends {LocalStorage}
 */
let Storage = LocalStorage;

// Using try/catch here because of IE10+ protected mode and other browsers' quirks
// See https://github.com/Modernizr/Modernizr/blob/master/feature-detects/storage/localstorage.js
try {
  const temp = 'testStorage';
  localStorage.setItem(temp, temp);
  localStorage.removeItem(temp);
} catch (e) {
  Storage = FallbackStorage;
}

const ActualStorage = Storage;
export default ActualStorage;
