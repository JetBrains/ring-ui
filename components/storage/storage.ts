import LocalStorage from './storage__local';
import FallbackStorage from './storage__fallback';

export interface StorageConfig {
  type?: 'local' | 'session' | null | undefined
  cookieName?: string | null | undefined
  checkDelay?: number | null | undefined
}

export interface Storage {
  get<T>(name: string): Promise<T | null>
  set<T>(name: string, value: T): Promise<unknown>
  remove(name: string): Promise<unknown>
  each<R>(callback: <T>(item: string, value: T) => R): Promise<R[]>
  on<T>(name: string, callback: (value: T | null) => void): () => void
}

export interface StorageClass {
  new (config?: StorageConfig | undefined): Storage
}

/**
 * @name Storage
 */

/**
 * @constructor
 * @extends {LocalStorage}
 */
let Storage: StorageClass = LocalStorage;

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
