/**
 * @fileoverview Additional tools, which are used by {@link DiffTool}.
 * @author igor.alexeenko (Igor Alekseyenko)
 */

// todo(igor.alexeenko): Get rid of jQuery.

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
   * @param {*} obj
   * @return {boolean}
   */
  d.isNull = function(obj) {
    return obj === null;
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
      result = d.deleteFromArrayAt(arr, elIndex);
    }

    return result;
  };

  /**
   * @param {Array} arr
   * @param {number} index
   * @return {Array}
   */
  d.deleteFromArrayAt = function(arr, index) {
    var leftSide = arr.slice(0, index);
    var rightSide = arr.slice(index + 1, arr.length);

    return leftSide.concat(rightSide);
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
   * @param {Object=} opt_context
   */
  d.addAnimationCallback = function(el, fn, opt_context) {
    var animationEndHandler = function() {
      fn.call(opt_context);
    };

    var animationEventType = d.getAnimationEventType_();
    $(el).one(animationEventType, animationEndHandler);
  };

  /**
   * @return {string=}
   * @private
   */
  d.getAnimationEventType_ = function() {
    if (!d.isDef(d.animationProperty_)) {
      /**
       * @enum {string}
       */
      d.AnimationProperty = {
        COMMON: 'animation',
        OPERA: '-o-animation',
        MOZILLA: '-moz-animation',
        WEBKIT: '-webkit-animation'
      };
    }

    if (!d.isDef(d.animationEventTyoe_)) {
      /**
       * @enum {string}
       */
      d.AnimationEventType = {
        COMMON: 'animationend',
        OPERA: 'oAnimationEnd',
        WEBKIT: 'webkitAnimationEnd'
      };
    }

    if (!d.isDef(d.animationToEventType_)) {
      /**
       * Lookup table of animation properties to eventTypes in causes.
       * @type {Object}
       * @private
       */
      d.animationToEventType_ = d.createObject(
          d.AnimationProperty.COMMON, d.AnimationEventType.COMMON,
          d.AnimationProperty.OPERA, d.AnimationEventType.OPERA,
          d.AnimationProperty.MOZILLA, d.AnimationEventType.OPERA,
          d.AnimationProperty.WEBKIT, d.AnimationEventType.WEBKIT);
    }

    if (!d.isDef(d.animationEventType_)) {
      var element = document.createElement('div');
      d.animationEventType_ = null;

      for (var propertyID in d.AnimationProperty) {
        var currentProperty = d.AnimationProperty[propertyID];
        if (d.isDef(element.style[currentProperty])) {
          /**
           * Event type, which is actual for current implementation
           * of key frame animation standard.
           * @type {d.AnimationEventType}
           * @private
           */
          d.animationEventType_ = d.animationToEventType_[currentProperty];
          break;
        }
      }
    }

    return d.animationEventType_;
  };

  // todo(o0): Time to split this file and move parts to global__utils.js.
  /**
   * Namespace.
   */
  d.visibility = {};

  /**
   * @enum {string}
   */
  d.visibility.VisibilityProperty = {
    COMMON: 'hidden',
    MOZILLA: 'mozHidden',
    MS: 'msHidden',
    WEBKIT: 'webkitHidden'
  };

  /**
   * @enum {string}
   */
  d.visibility.VisibilityChangeEventType = {
    COMMON: 'visibilitychange',
    MOZILLA: 'mozvisibilitychange',
    MS: 'msvisibilitychange',
    WEBKIT: 'webkitvisibilitychange'
  };


  /**
   * @return {Object.<d.visibility.VisibilityProperty,
   *     d.visibility.VisibilityChangeEventType>}
   * @private
   */
  d.visibility.getPropertyToEventType_ = function() {
    if (!d.isDef(d.visibility.propertyToEventType_)) {
      /**
       * Lookup table of visibility properties to eventTypes of changing them.
       * @type {Object.<d.visibility.VisibilityProperty,
       *     d.visibility.VisibilityChangeEventType>}
       * @private
       */
      d.visibility.propertyToEventType_ = d.createObject(
          d.visibility.VisibilityProperty.COMMON,
              d.visibility.VisibilityChangeEventType.COMMON,
          d.visibility.VisibilityProperty.MOZILLA,
              d.visibility.VisibilityChangeEventType.MOZILLA,
          d.visibility.VisibilityProperty.MS,
              d.visibility.VisibilityChangeEventType.MS,
          d.visibility.VisibilityProperty.WEBKIT,
              d.visibility.VisibilityChangeEventType.WEBKIT);
    }

    return d.visibility.propertyToEventType_;
  };

  /**
   * @return {d.visibility.VisibilityProperty}
   * @private
   */
  d.visibility.getVisibilityProperty_ = function() {
    if (!d.isDef(d.visibility.visibilityProperty_)) {
      d.visibility.visibilityProperty_ = null;

      for (var propertyID in d.visibility.VisibilityProperty) {
        var currentProperty = d.visibility.VisibilityProperty[propertyID];

        if (d.isDef(document[currentProperty])) {
          d.visibility.visibilityProperty_ = currentProperty;
          break;
        }
      }
    }

    return d.visibility.visibilityProperty_;
  };

  /**
   * @return {d.visibility.VisibilityChangeEventType}
   * @private
   */
  d.visibility.getVisibilityChangeEventType_ = function() {
    if (!d.isDef(d.visibility.eventType_)) {
      var property = d.visibility.getVisibilityProperty_();
      var propertyToEventType = d.visibility.getPropertyToEventType_();

      d.visibility.eventType_ = propertyToEventType[property];
    }


    return d.visibility.eventType_;
  };

  /**
   * Whether document page is visible or hidden. If browser doesn't support
   * page visibility API, always returns true.
   * @return {boolean}
   */
  d.isDocumentHidden = function() {
    var visibilityProperty = d.visibility.getVisibilityProperty_();

    if (visibilityProperty === null) {
      return true;
    }

    return document[visibilityProperty];
  };

  /**
   * Adds event listener to event of changing page visibility accordingly to
   * current implementation of page visibility API.
   * @param {function} fn
   * @param {Object=} opt_ctx
   */
  d.addDocumentVisibilityChangeCallback = function(fn, opt_ctx) {
    var eventType = d.visibility.getVisibilityChangeEventType_();
    var callback = d.bindContext(fn, opt_ctx);

    $(document).on(eventType, callback);
  };

  // todo(igor.alexeenko): Move all helper classes into separate files.

  /**
   * @param {number} from
   * @param {number} to
   * @constructor
   */
  d.Range = function(from, to) {
    this.from = from;
    this.to = to;
  };


  /**
   * Namespace of Operation System detect utils.
   */
  d.os = {};

  /**
   * @enum {string}
   */
  d.os.OS = {
    LINUX: 'linux',
    MAC: 'mac',
    UNIX: 'unix',
    UNKNOWN: 'unknown',
    WINDOWS: 'windows'
  };

  /**
   * @return {d.os.OS}
   */
  d.os.getOS = function() {
    if (!d.isDef(d.os.currentOS_)) {
      /**
       * @type {d.os.OS}
       * @private
       */
      d.os.currentOS_ = d.os.OS.UNKNOWN;

      if (navigator.appVersion.indexOf('Win') > -1) {
        d.os.currentOS_ = 'Windows';
      }

      if (navigator.appVersion.indexOf('Mac') > -1) {
        d.os.currentOS_ ='MacOS';
      }

      if (navigator.appVersion.indexOf('X11') > -1) {
        d.os.currentOS_ ='UNIX';
      }

      if (navigator.appVersion.indexOf('Linux') > -1) {
        d.os.currentOS_ ='Linux';
      }
    }

    return d.os.currentOS_;
  };

  /**
   * Namespace for reading/writing cookies.
   */
  d.cookies = {};

  /**
   * Returns value of cookie with given name.
   * @param {string} name
   * @return {string}
   */
  d.cookies.get = function(name) {
    var nameEQ = name + '=';
    var ca = document.cookie.split(';');

    for(var i = 0;i < ca.length; i++) {
      var c = ca[i];

      while(c.charAt(0) === ' ') {
        c = c.substring(1,c.length);
      }

      if (c.indexOf(nameEQ) === 0) {
        return c.substring(nameEQ.length,c.length);
      }
    }

    return null;
  };

  /**
   * Sets a cookie.
   * @param {string} name
   * @param {string} value
   * @param {number} days
   */
  d.cookies.set = function(name, value, days) {
    var expires = '';

    if (days) {
      var date = new Date();
      date.setTime(date.getTime()+(days * 24 * 60 * 60 * 1000));
      expires = '; expires=' + date.toGMTString();
    }

    document.cookie = name + '=' + value + expires + '; path=/';
  };

  return d;
});
