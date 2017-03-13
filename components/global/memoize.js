export default function memoize(fn) {
  const primitiveCache = new Map();
  const objectCache = new WeakMap();
  return function memoized(arg) {
    const cache = arg instanceof Object ? objectCache : primitiveCache;
    if (cache.has(arg)) {
      return cache.get(arg);
    }

    const value = fn(arg);
    cache.set(arg, value);
    return value;
  };
}
