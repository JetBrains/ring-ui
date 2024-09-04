import LocalStorage from './storage__local';

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
}

export default LocalStorage;
