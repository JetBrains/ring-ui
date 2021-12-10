import LocalStorage from './storage__local';
import FallbackStorage from './storage__fallback';

export interface StorageConfig {
  type?: 'local' | 'session' | null | undefined
  cookieName?: string | null | undefined
  checkDelay?: number | null | undefined
}

export interface StorageInterface {
  get<T>(name: string): Promise<T | null>
  set<T>(name: string, value: T | null): Promise<T | null>
  remove(name: string): Promise<void>
  each<R>(callback: (item: string, value: unknown) => R | Promise<R>): Promise<R[]>
  on<T>(name: string, callback: (value: T | null) => void): () => void
}

export interface StorageClass {
  new (config?: StorageConfig | undefined): StorageInterface
  QUOTA?: number
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
