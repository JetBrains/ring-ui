import LocalStorage from './storage__local';
import CookiesStorageFallback from './storage__cookies-fallback';
import InMemoryStorageFallback from './storage__in-memory-fallback';

/**
 * @name Storage
 * @category Utilities
 * @tags Ring UI Language
 * @description Provides a façade to localStorage/sessionStorage/cookies.
 * @example
   <example name="Storage">
    <file name="index.html">
      <div>
        Stored value = <span id="stored-value"></span>
      </div>
    </file>
    <file name="index.js">
      import Storage from '@jetbrains/ring-ui/components/storage/storage';

      const STORAGE_KEY = 'storage-example-key';
      const storage = new Storage();

      const infoNode = document.getElementById('stored-value');

      async function init() {
       const storedValue = await storage.get(STORAGE_KEY);
       if (!storedValue) {
         const generatedValue = Math.random().toString();
         await storage.set(STORAGE_KEY, generatedValue);
         infoNode.innerText = generatedValue;
       } else {
         infoNode.innerText = storedValue;
       }
      }
      init();
    </file>
   </example>
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
  if (navigator.cookieEnabled) {
    Storage = CookiesStorageFallback;
  } else {
    Storage = InMemoryStorageFallback;
  }
}

const ActualStorage = Storage;
export default ActualStorage;
