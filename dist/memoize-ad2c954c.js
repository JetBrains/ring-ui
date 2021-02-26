function memoize(fn) {
  var primitiveCache = new Map();
  var objectCache = new WeakMap();
  return function memoized() {
    var arg = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '__singleValue__';
    var cache = arg instanceof Object ? objectCache : primitiveCache;

    if (cache.has(arg)) {
      return cache.get(arg);
    }

    var value = fn(arg);
    cache.set(arg, value);
    return value;
  };
}

export { memoize as m };
