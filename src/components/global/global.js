/**
 * @fileoverview Commonly used methods.
 * @author igor.alexeenko@jetbrains.com (Igor Alexeenko)
 * @author maskimrv@jetbrains.com (Maskim Ryzhikov)
 */

var Global = {};

/**
 * @const
 * @type {number}
 */
Global.RING_UNIT = 8;

/**
 * Wrapper to make class a singleton. Adds static method {@code getInstance},
 * which always return the same instance.
 * @param {Function} Constructor
 */
Global.addSingletonGetter = function (Constructor) {
  Constructor.getInstance = function () {
    if (!Constructor.instance_) {
      Constructor.instance_ = new Constructor();
    }

    return Constructor.instance_;
  };
};

/**
 * Creates unique ids generator function
 * @param {string} prefix
 * @param {number=} idCounter
 * @returns {Function}
 */
Global.getUIDGenerator = function (prefix, idCounter) {
  idCounter = idCounter || 0;

  return function () {
    var id = String(idCounter++);
    return prefix + id;
  };
};

/**
 * Creates an object from given arguments. Even arguments becomes keys,
 * odd arguments becomes values.
 * @return {Object}
 * @throws {Error}
 */
Global.createObject = function () {
  if (arguments.length % 2 !== 0) {
    throw new Error('Odd number of arguments given.');
  }

  var args = Array.prototype.slice.call(arguments, 0);
  var obj = {};

  for (var i = 0, l = args.length; i < l; i += 2) {
    obj[args[i]] = args[i + 1];
  }

  return obj;
};


module.exports = Global;

