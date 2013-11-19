/**
 * @fileoverview Additional tools, which are used by {@link DiffTool}.
 * @author igor.alexeenko (Igor Alekseyenko)
 */

define([
  'jquery'
], function($) {
  'use strict';

  /**
   * New namespace for diffTool.
   */
  var d = {};

  /**
   * Returns true if object is not undefined.
   * @param {*} obj
   * @return {boolean}
   */
  d.isDef = function(obj) {
    return typeof obj !== 'undefined';
  };

  /**
   * @param {string} str
   * @return {boolean}
   */
  d.isEmptyString = function(str) {
    return !/\S/.test(str);
  };

  /**
   * ID's for different kinds of regular expressions.
   * @enum {string}
   */
  d.EOLType = {
    CR: 'cr',
    LF: 'lf',
    CR_LF: 'cr-lf'
  };

  /**
   * Regular expressions to match end-of-line symbol.
   * @enum {RegExp}
   */
  d.EOLRegex = {
    ALL: /(\r\n|\r|\n)/mg,
    CR: /\r/,
    CR_LF: /\r\n/,
    LF: /\n/
  };

  /**
   * Check, whether given symbol is end-of-line.
   * @param {string} str
   * @return {boolean}
   */
  d.isEOL = function(str) {
    return d.EOLRegex.ALL.test(str);
  };

  /**
   * Returns ID of kind of end-of-line symbol.
   * @param {string} str
   * @return {d.EOLType?}
   */
  d.getEOLType = function(str) {
    if (!d.EOLRegexToType_) {
      /**
       * Lookup table of regular expressions to match EOL symbol to its type ID.
       * @type {Object.<d.EOLRegex, d.EOLType>}
       * @private
       */
      d.EOLRegexToType_ = d.createObject(
          d.EOLRegex.CR, d.EOLType.CR,
          d.EOLRegex.LF, d.EOLType.LF,
          d.EOLRegex.CR_LF, d.EOLType.CR_LF);
    }

    var regexps = Object.keys(d.EOLRegex);

    for (var i = 0, l = regexps.length; i < l; i++) {
      var regexID = regexps[i];
      var regex = d.EOLRegex[regexID];

      if (regex.test(str)) {
        return d.EOLRegexToType_[regex];
      }
    }

    return null;
  };

  /**
   * Returns end-of-line symbol for given string.
   * @param {string} str
   * @return {string?}
   */
  d.getEOL = function(str) {
    var regexsOrder = [d.EOLRegex.CR_LF, d.EOLRegex.CR, d.EOLRegex.LF];
    var regex = regexsOrder.shift();
    var EOL = null;
    var match;

    while (regex) {
      match = str.match(regex);

      if (match) {
        EOL = match[0];
        break;
      }

      regex = regexsOrder.shift();
    }

    return EOL;
  };

  /**
   * Appends script element to page to asynchronously download some logic,
   * implemented in external JavaScript file. When file is loaded, callback
   * called with given context. If context is not defined, callback called
   * with global context.
   * @param {string} path
   * @param {function} callback
   * @param {*} opt_context
   */
  d.addScriptElement = function(path, callback, opt_context) {
    var scriptElement = document.createElement('script');
    var scriptElements = document.querySelectorAll('script');

    var lastScriptElement = d.peekArray(scriptElements);

    $(scriptElement).on('load', d.bindContext(callback, opt_context));

    lastScriptElement.parent.insertBefore(scriptElement, null);
    scriptElement.async = true;
    scriptElement.src = path;
  };

  /**
   * Abstract method. Use link to this method for unimplemented methods in
   * base classes.
   * @throws {Error}
   */
  d.abstractMethod = function() {
    throw new Error('This method is not implemented yet.');
  };

  /**
   * Null function. Use link to this method, where should not be an interaction.
   * For example in interfaces.
   */
  d.nullFunction = function() {};

  /**
   * Takes even number of arguments and use them as key-value pairs to create
   * a new {@link Object}.
   * @param {...*} var_args
   * @return {Object}
   */
  d.createObject = function(var_args) {
    if (var_args instanceof Array) {
      return d.createObject.apply(null, var_args);
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
  d.mixin = function(target, mixin, opt_override) {
    opt_override = d.isDef(opt_override) ? opt_override : true;

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
  d.clamp = function(value, min, max) {
    return Math.min(Math.max(value, min), max);
  };

  // todo(igor.alexeenko): Make deletion by index.
  /**
   * Deletes element from array and returns array without this element. Does
   * not change initial array.
   * @param {Array} arr
   * @param {*} el
   * @return {Array}
   */
  d.deleteFromArray = function(arr, el) {
    var elIndex = arr.indexOf(el);
    var result = arr;

    if (elIndex > -1) {
      var leftSide = arr.slice(0, elIndex);
      var rightSide = arr.slice(elIndex + 1, arr.length);

      result = leftSide.concat(rightSide);
    }

    return result;
  };

  /**
   * Whether two arrays has same elements.
   * @param {Array} arrA
   * @param {Array} arrB
   * @return {boolean}
   */
  d.arraysAreEqual = function(arrA, arrB) {
    if (arrA.length !== arrB.length) {
      return false;
    }

    for (var i = 0, l = arrA.length; i < l; i++) {
      // todo(igor.alexeenko): this comparison works only for simple data-types.
      // Make it work for objects, arrays, etc.
      if (arrA !== arrB) {
        return false;
      }
    }

    return true;
  };

  /**
   * @param {Array} arr
   * @return {Array}
   */
  d.copyArray = function(arr) {
    return arr.slice(0);
  };

  /**
   * Returns last element from {@code Array}.
   * @param {Array.<T>} arr
   * @return {T}
   */
  d.peekArray = function(arr) {
    return arr[arr.length - 1];
  };

  // todo(igor.alexeenko): Rename to inherits
  /**
   * Inheritance interface. Works through empty constructor, but unlike other
   * inheritance methods, also creates link to a parent class in a child, to
   * make child able to call methods of parent class from its own methods.
   * @param {Function} child
   * @param {Function} parent
   */
  d.inherit = function(child, parent) {
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
  d.addSingletonGetter = function(Constructor) {
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
  d.bindContext = function(fn, ctx) {
    return function() {
      return fn.apply(ctx, arguments);
    };
  };

  /**
   * Adds callback to end of keyframe animation. Allows to implement serial
   * queue of keyframe animations.
   * @param {Element} el
   * @param {function} fn
   */
  d.addAnimationCallback = function(el, fn) {
    var animationEndHandler = function() {
      fn();

      // todo(igor.alexeenko): Implement through d.getAnimationEventType
      // as soon as it ready.
      $(el).off('animationend', animationEndHandler);
      $(el).off('MSAnimationEnd', animationEndHandler);
      $(el).off('oAnimationEnd', animationEndHandler);
      $(el).off('webkitAnimationEnd', animationEndHandler);
    };

    $(el).one('animationend', animationEndHandler);
    $(el).one('MSAnimationEnd', animationEndHandler);
    $(el).one('oAnimationEnd', animationEndHandler);
    $(el).one('webkitAnimationEnd', animationEndHandler);
  };

  /**
   * @return {string}
   */
  d.getAnimationEventType = function() {
    // todo(igor.alexeenko): Detect in which browser user runs application
    // and return corresponding event type.
    return '';
  };

  // todo(igor.alexeenko): Separate.
  /**
   * @param {number} from
   * @param {number} to
   * @constructor
   */
  d.Range = function(from, to) {
    this.from = from;
    this.to = to;
  };

  return d;
});
