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

  return diffTool;
});
