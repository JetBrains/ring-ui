interface MapLike<K, V> {
  delete(key: K): boolean;
  get(key: K): V | undefined;
  has(key: K): boolean;
  set(key: K, value: V): this;
}

export default function memoize<A = void, T = void>(fn: (arg: A) => T): (arg: A) => T {
  const primitiveCache = new Map();
  const objectCache = new WeakMap();
  return function memoized(arg) {
    const key = arg ?? '__singleValue__';
    const cache: MapLike<unknown, T> = key instanceof Object ? objectCache : primitiveCache;
    const cached = cache.get(key);
    if (cached !== undefined) {
      return cached;
    }

    const value = fn(arg);
    cache.set(key, value);
    return value;
  };
}
