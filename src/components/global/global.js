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

module.exports = Global;