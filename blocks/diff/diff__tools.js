/**
 * @fileoverview Additional tools, which are used by {@link DiffTool}.
 * @author igor.alexeenko (Igor Alekseyenko)
 */

define(function() {
  'use strict';

  /**
   * Namespace for DiffTool utility methods.
   */
  var diffTool = {};

  /**
   * Returns true if object is not undefined.
   * @param {*} obj
   * @return {boolean}
   */
  diffTool.isDef = function(obj) {
    return typeof obj !== 'undefined';
  };

  /**
   * @param {string} str
   * @return {boolean}
   */
  diffTool.isEmptyString = function(str) {
    return (/^\s*$/).test(str);
  };

  /**
   * Abstract method. Use link to this method for unimplemented methods in
   * base classes.
   * @throws {Error}
   */
  diffTool.abstractMethod = function() {
    throw new Error('This method is not implemented yet.');
  };

  /**
   * Null function. Use link to this method, where should not be an interaction.
   * For example in interfaces.
   */
  diffTool.nullFunction = function() {};

  /**
   * Takes even number of arguments and use them as key-value pairs to create
   * a new {@link Object}.
   * @param {...*} var_args
   * @return {Object}
   */
  diffTool.createObject = function(var_args) {
    if (var_args instanceof Array) {
      return diffTool.createObject.apply(null, var_args);
    }

    var args = Array.prototype.slice.call(arguments, 0);
    if (args.length % 2 !== 0) {
      throw new Error('Odd number of arguments.');
    }

    var obj = {};
    for (var i = 0, l = args.length; i < l; i += 2) {
      obj[args[i]] = args[i + 1];
    }

    return obj;
  };

  /**
   * Simply appends values of fields of mixin into target object.
   * @param {Object} target
   * @param {Object} mixin
   * @param {boolean=} opt_override
   * @return {Object}
   */
  diffTool.mixin = function(target, mixin, opt_override) {
    opt_override = diffTool.isDef(opt_override) ? opt_override : true;

    for (var arg in mixin) {
      if (mixin.hasOwnProperty(arg)) {
        if (target[arg] && !opt_override) {
          continue;
        }

        target[arg] = mixin[arg];
      }
    }

    return target;
  };

  /**
   * Clamps value within min and max values.
   * @param {number} value
   * @param {number} min
   * @param {number} max
   * @return {number}
   */
  diffTool.clamp = function(value, min, max) {
    return Math.min(Math.max(value, min), max);
  };

  /**
   * @param {Array} arr
   * @param {*} el
   * @return {Array}
   */
  diffTool.deleteFromArray = function(arr, el) {
    var elIndex = arr.indexOf(el);
    var result = arr;

    if (elIndex > -1) {
      var leftSide = arr.slice(0, elIndex);
      var rightSide = arr.slice(elIndex + 1, arr.length);

      result = leftSide.concat(rightSide);
    }

    return result;
  };

  // todo(igor.alexeenko): Rename to inherits
  /**
   * Inheritance interface. Works through empty constructor, but unlike other
   * inheritance methods, also creates link to a parent class in a child, to
   * make child able to call methods of parent class from its own methods.
   * @param {Function} child
   * @param {Function} parent
   */
  diffTool.inherit = function(child, parent) {
    var EmptyConstructor = function() {};
    EmptyConstructor.prototype = parent.prototype;

    child.prototype = new EmptyConstructor();
    child.prototype.constructor = child;

    child.super_ = parent.prototype;
  };

  /**
   * Wrapper to make class a singleton. Adds static method {@code getInstance},
   * which always return the same instance.
   * @param {Function} Constructor
   */
  diffTool.addSingletonGetter = function(Constructor) {
    Constructor.getInstance = function() {
      if (!Constructor.instance_) {
        Constructor.instance_ = new Constructor();
      }

      return Constructor.instance_;
    };
  };

  /**
   * Returns function, which always called with certain context.
   * @param {function} fn
   * @param {*} ctx
   * @return {function}
   */
  diffTool.bindContext = function(fn, ctx) {
    return function() {
      return fn.apply(ctx, arguments);
    };
  };

  return diffTool;
});
