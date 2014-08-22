var Global = {};

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
 * @param prefix
 * @param idCounter
 * @returns {Function}
 */
Global.getUIDGenerator = function (prefix, idCounter) {
  idCounter = idCounter || 0;

  return function () {
    var id = String(idCounter++);
    return prefix + id;
  };
};

module.exports = Global;