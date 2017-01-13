export default function memoize(fn) {
  const cache = new Map();
  return function memoized(arg) {
    if (cache.has(arg)) {
      return cache.get(arg);
    }

    const value = fn(arg);
    cache.set(arg, value);
    return value;
  };
}
