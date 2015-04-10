/*global CSSRule*/

var $ = require('jquery');

var Tools = {};

/**
 * Returns true if object is not undefined.
 * @param {*} obj
 * @return {boolean}
 */
Tools.isDef = function (obj) {
  return typeof obj !== 'undefined';
};

/**
 * @param {*} obj
 * @return {boolean}
 */
Tools.isNull = function (obj) {
  return obj === null;
};

/**
 * @param {string} str
 * @return {boolean}
 */
Tools.isEmptyString = function (str) {
  return !/\S/.test(str);
};

/**
 * @param {string} word
 * @return {string}
 */
Tools.capitalizeFirstLetter = function (word) {
  return [word.charAt(0).toUpperCase(), word.slice(1)].join('');
};

/**
 * IDs for different kinds of regular expressions.
 * @enum {string}
 */
Tools.EOLType = {
  CR: 'cr',
  LF: 'lf',
  CR_LF: 'cr-lf'
};

/**
 * Regular expressions to match end-of-line symbol.
 * @enum {RegExp}
 */
Tools.EOLRegex = {
  ALL: /(\r\n|\r|\n)/mg,
  CR: /\r/,
  CR_LF: /\r\n/,
  LF: /\n/
};

/**
 * Checks whether given symbol is end-of-line.
 * @param {string} str
 * @return {boolean}
 */
Tools.isEOL = function (str) {
  return Tools.EOLRegex.ALL.test(str);
};

/**
 * Returns ID of kind of end-of-line symbol.
 * @param {string} str
 * @return {Tools.EOLType|null}
 */
Tools.getEOLType = function (str) {
  if (!Tools.EOLRegexToType_) {
    /**
     * Lookup table of regular expressions to match EOL symbol to its type ID.
     * @type {Object.<Tools.EOLRegex, Tools.EOLType>}
     * @private
     */
    Tools.EOLRegexToType_ = Tools.createObject(
      Tools.EOLRegex.CR, Tools.EOLType.CR,
      Tools.EOLRegex.LF, Tools.EOLType.LF,
      Tools.EOLRegex.CR_LF, Tools.EOLType.CR_LF);
  }

  var regexps = Object.keys(Tools.EOLRegex);
  var length = regexps.length;

  for (var i = 0; i < length; i++) {
    var regexID = regexps[i];
    var regex = Tools.EOLRegex[regexID];

    if (regex.test(str)) {
      return Tools.EOLRegexToType_[regex];
    }
  }

  return null;
};

/**
 * Returns end-of-line symbol for given string.
 * @param {string} str
 * @return {string|null}
 */
Tools.getEOL = function (str) {
  var regexsOrder = [Tools.EOLRegex.CR_LF, Tools.EOLRegex.CR, Tools.EOLRegex.LF];
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
 * Asynchronously loads a JS file. When the file is loaded, the callback
 * called with the context provided. If context is not provided, callback is called
 * with global context.
 * @param {string} path
 * @param {function} callback
 * @param {*} opt_context
 */
Tools.addScriptElement = function (path, callback, opt_context) {
  var scriptElement = document.createElement('script');
  var scriptElements = document.querySelectorAll('script');

  var lastScriptElement = Tools.peekArray(scriptElements);

  $(scriptElement).on('load', Tools.bindContext(callback, opt_context));

  lastScriptElement.parent.insertBefore(scriptElement, null);
  scriptElement.async = true;
  scriptElement.src = path;
};

/**
 * Abstract method stub.
 * @throws {Error}
 */
Tools.abstractMethod = function () {
  throw new Error('This method is not implemented yet.');
};

/**
 * Null function stub.
 */
Tools.nullFunction = function () {
};

/**
 * Takes an even number of arguments and uses them as key-value pairs to create
 * a new {@link Object}.
 * @param {...*} varArgs
 * @return {Object}
 */
Tools.createObject = function (varArgs) {
  if (varArgs instanceof Array) {
    return Tools.createObject.apply(null, varArgs);
  }

  var args = Array.prototype.slice.call(arguments, 0);
  if (args.length % 2 !== 0) {
    throw new Error('Odd number of arguments.');
  }

  var obj = {};
  var length = args.length;
  for (var i = 0; i < length; i += 2) {
    obj[args[i]] = args[i + 1];
  }

  return obj;
};

/**
 * Appends values of fields of mixin into target object.
 * @param {Object} target
 * @param {Object} mixin
 * @param {boolean=} opt_override
 * @return {Object}
 */
Tools.mixin = function (target, mixin, opt_override) {
  opt_override = Tools.isDef(opt_override) ? opt_override : true;

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
Tools.clamp = function (value, min, max) {
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
Tools.deleteFromArray = function (arr, el) {
  var elIndex = arr.indexOf(el);
  var result = arr;

  if (elIndex > -1) {
    result = Tools.deleteFromArrayAt(arr, elIndex);
  }

  return result;
};

/**
 * @param {Array} arr
 * @param {number} index
 * @return {Array}
 */
Tools.deleteFromArrayAt = function (arr, index) {
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
Tools.arraysAreEqual = function (arrA, arrB) {
  if (arrA.length !== arrB.length) {
    return false;
  }

  var length = arrA.length;
  for (var i = 0; i < length; i++) {
    // todo(igor.alexeenko): this comparison works only for simple data-types.
    // Make it work for objects, arrays, etc.
    if (arrA[i] !== arrB[i]) {
      return false;
    }
  }

  return true;
};

/**
 * @param {Array} arr
 * @return {Array}
 */
Tools.copyArray = function (arr) {
  return arr.slice(0);
};

/**
 * Returns last element from {@code Array}.
 * @param {Array} arr
 * @return {Object}
 */
Tools.peekArray = function (arr) {
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
Tools.inherit = function (child, parent) {
  var EmptyConstructor = function () {
  };
  EmptyConstructor.prototype = parent.prototype;

  child.prototype = new EmptyConstructor();
  child.prototype.constructor = child;

  child.super_ = parent.prototype;
};

/**
 * Returns a function that is always called with a given context.
 * @param {function} fn
 * @param {*} ctx
 * @return {function}
 */
Tools.bindContext = function (fn, ctx) {
  return function () {
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
Tools.addAnimationCallback = function (el, fn, opt_context) {
  var animationEndHandler = function () {
    fn.call(opt_context);
  };

  var animationEventType = Tools.getAnimationEventType_();
  $(el).one(animationEventType, animationEndHandler);
};

/**
 * @return {string|null}
 * @private
 */
Tools.getAnimationEventType_ = function () {
  if (!Tools.isDef(Tools.animationProperty_)) {
    /**
     * @enum {string}
     */
    Tools.AnimationProperty = {
      COMMON: 'animation',
      OPERA: '-o-animation',
      MOZILLA: '-moz-animation',
      WEBKIT: '-webkit-animation'
    };
  }

  if (!Tools.isDef(Tools.animationEventTyoe_)) {
    /**
     * @enum {string}
     */
    Tools.AnimationEventType = {
      COMMON: 'animationend',
      OPERA: 'oAnimationEnd',
      WEBKIT: 'webkitAnimationEnd'
    };
  }

  if (!Tools.isDef(Tools.animationToEventType_)) {
    /**
     * Lookup table of animation properties to eventTypes in causes.
     * @type {Object}
     * @private
     */
    Tools.animationToEventType_ = Tools.createObject(
      Tools.AnimationProperty.COMMON, Tools.AnimationEventType.COMMON,
      Tools.AnimationProperty.OPERA, Tools.AnimationEventType.OPERA,
      Tools.AnimationProperty.MOZILLA, Tools.AnimationEventType.OPERA,
      Tools.AnimationProperty.WEBKIT, Tools.AnimationEventType.WEBKIT);
  }

  if (!Tools.isDef(Tools.animationEventType_)) {
    var element = document.createElement('div');
    Tools.animationEventType_ = null;

    for (var propertyID in Tools.AnimationProperty) {
      if (Tools.AnimationProperty.hasOwnProperty(propertyID)) {
        var currentProperty = Tools.AnimationProperty[propertyID];
        if (Tools.isDef(element.style[currentProperty])) {
          /**
           * Event type, which is actual for current implementation
           * of key frame animation standard.
           * @type {Tools.AnimationEventType}
           * @private
           */
          Tools.animationEventType_ = Tools.animationToEventType_[currentProperty];
          break;
        }
      }
    }
  }

  return Tools.animationEventType_;
};

/**
 * Takes string as argument and makes its name unique by adding some counter
 * value to it.
 * @param {string} animationName
 * @return {string}
 */
Tools.getAnimationUniqueName = function (animationName) {
  if (!Tools.isDef(Tools.animationIDCounter_)) {
    /**
     * Numeric index, which appends to animation name to make it unique.
     * @type {number}
     * @private
     */
    Tools.animationIDCounter_ = 0;
  }

  var animationUniqueName = [animationName, Tools.animationIDCounter_].join('');
  Tools.animationIDCounter_++;
  return animationUniqueName;
};

// todo(o0): Time to split this file and move parts to global__utils.js.
/**
 * Namespace.
 */
Tools.visibility = {};

/**
 * @enum {string}
 */
Tools.visibility.VisibilityProperty = {
  COMMON: 'hidden',
  MOZILLA: 'mozHidden',
  MS: 'msHidden',
  WEBKIT: 'webkitHidden'
};

/**
 * @enum {string}
 */
Tools.visibility.VisibilityChangeEventType = {
  COMMON: 'visibilitychange',
  MOZILLA: 'mozvisibilitychange',
  MS: 'msvisibilitychange',
  WEBKIT: 'webkitvisibilitychange'
};


/**
 * @return {Object.<Tools.visibility.VisibilityProperty, Tools.visibility.VisibilityChangeEventType>}
 * @private
 */
Tools.visibility.getPropertyToEventType_ = function () {
  if (!Tools.isDef(Tools.visibility.propertyToEventType_)) {
    /**
     * Lookup table of visibility properties to eventTypes of changing them.
     * @type {Object.<Tools.visibility.VisibilityProperty, Tools.visibility.VisibilityChangeEventType>}
     * @private
     */
    Tools.visibility.propertyToEventType_ = Tools.createObject(
      Tools.visibility.VisibilityProperty.COMMON,
      Tools.visibility.VisibilityChangeEventType.COMMON,
      Tools.visibility.VisibilityProperty.MOZILLA,
      Tools.visibility.VisibilityChangeEventType.MOZILLA,
      Tools.visibility.VisibilityProperty.MS,
      Tools.visibility.VisibilityChangeEventType.MS,
      Tools.visibility.VisibilityProperty.WEBKIT,
      Tools.visibility.VisibilityChangeEventType.WEBKIT);
  }

  return Tools.visibility.propertyToEventType_;
};

/**
 * @return {Tools.visibility.VisibilityProperty}
 * @protected
 */
Tools.visibility.getVisibilityProperty_ = function () {
  var visibility = Tools.visibility;

  if (!Tools.isDef(visibility.visibilityProperty_)) {
    visibility.visibilityProperty_ = null;

    for (var propertyID in visibility.VisibilityProperty) {
      if (visibility.VisibilityProperty.hasOwnProperty(propertyID)) {
        var currentProperty = visibility.VisibilityProperty[propertyID];

        if (Tools.isDef(document[currentProperty])) {
          visibility.visibilityProperty_ = currentProperty;
          break;
        }
      }
    }
  }

  return visibility.visibilityProperty_;
};

/**
 * @return {Tools.visibility.VisibilityChangeEventType}
 * @protected
 */
Tools.visibility.getVisibilityChangeEventType_ = function () {
  if (!Tools.isDef(Tools.visibility.eventType_)) {
    var property = Tools.visibility.getVisibilityProperty_();
    var propertyToEventType = Tools.visibility.getPropertyToEventType_();

    Tools.visibility.eventType_ = propertyToEventType[property];
  }


  return Tools.visibility.eventType_;
};

/**
 * Whether document page is visible or hidden. If browser doesn't support
 * page visibility API, always returns true.
 * @return {boolean}
 */
Tools.isDocumentHidden = function () {
  var visibilityProperty = Tools.visibility.getVisibilityProperty_();

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
Tools.addDocumentVisibilityChangeCallback = function (fn, opt_ctx) {
  var eventType = Tools.visibility.getVisibilityChangeEventType_();
  var callback = Tools.bindContext(fn, opt_ctx);

  $(document).on(eventType, callback);
};

// todo(igor.alexeenko): Move all helper classes into separate files.

/**
 * @param {number} from
 * @param {number} to
 * @constructor
 */
Tools.Range = function (from, to) {
  this.from = from;
  this.to = to;
};


/**
 * OS detection utils.
 */
Tools.os = {};

/**
 * @enum {string}
 */
Tools.os.OS = {
  LINUX: 'linux',
  MAC: 'mac',
  UNIX: 'unix',
  UNKNOWN: 'unknown',
  WINDOWS: 'windows'
};

/**
 * @return {Tools.os.OS}
 */
Tools.os.getOS = function () {
  if (!Tools.isDef(Tools.os.currentOS_)) {
    /**
     * @type {Tools.os.OS}
     * @private
     */
    Tools.os.currentOS_ = Tools.os.OS.UNKNOWN;

    if (navigator.appVersion.indexOf('Win') > -1) {
      Tools.os.currentOS_ = 'Windows';
    }

    if (navigator.appVersion.indexOf('Mac') > -1) {
      Tools.os.currentOS_ = 'MacOS';
    }

    if (navigator.appVersion.indexOf('X11') > -1) {
      Tools.os.currentOS_ = 'UNIX';
    }

    if (navigator.appVersion.indexOf('Linux') > -1) {
      Tools.os.currentOS_ = 'Linux';
    }
  }

  return Tools.os.currentOS_;
};

/**
 * Cookie utils.
 */
Tools.cookies = {};

/**
 * Returns cookie value.
 * @param {string} name
 * @return {string}
 */
Tools.cookies.get = function (name) {
  var nameEQ = name + '=';
  var ca = document.cookie.split(';');

  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];

    while (c.charAt(0) === ' ') {
      c = c.substring(1, c.length);
    }

    if (c.indexOf(nameEQ) === 0) {
      return c.substring(nameEQ.length, c.length);
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
Tools.cookies.set = function (name, value, days) {
  var expires = '';

  if (days) {
    var date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    expires = '; expires=' + date.toGMTString();
  }

  document.cookie = name + '=' + value + expires + '; path=/';
};


/**
 * Style utils.
 */
Tools.style = {};

/**
 * Returns list of keyframe rules, defined in document.
 * @return {Array.<CSSRule>}
 */
Tools.style.getDocumentKeyframeRules = function () {
  var keyframeRules = [];
  var i = 0;
  var l = 0;

  var availableTypes = [
    CSSRule.KEYFRAMES_RULE,
    CSSRule.WEBKIT_KEYFRAMES_RULE,
    CSSRule.MOZ_KEYFRAMES_RULE,
    CSSRule.O_KEYFRAMES_RULE
  ];

  while (l < document.styleSheets.length) {
    var stylesheet = document.styleSheets[l];

    while (i < stylesheet.cssRules.length) {
      var currentRule = stylesheet.cssRules[i];

      // todo(igor.alexeenko): To be refactored. Move out of this method.
      if (!Tools.style.currentKeyframeType_) {
        var availableConstructorsCopy = availableTypes.slice(0);
        var currentConstructor;

        while (availableConstructorsCopy.length) {
          currentConstructor = availableConstructorsCopy.shift();

          if (currentRule.type === currentConstructor) {
            Tools.style.currentKeyframeType_ = currentConstructor;
            break;
          }
        }
      }

      if (Tools.style.currentKeyframeType_ &&
        currentRule.type === Tools.style.currentKeyframeType_) {
        keyframeRules.push(currentRule);
      }

      i++;
    }

    l++;
  }

  return keyframeRules;
};

/**
 * Returns {@link CSSRule} which describes keyframe animation with given name.
 * @param {string} name
 * @return {CSSRule|null}
 */
Tools.style.getKeyframeRule = function (name) {
  var allRules = Tools.style.getDocumentKeyframeRules();
  var currentRule;

  var ruleRegexp = new RegExp('^@\\S+keyframes\\s?(' + name + ')\\s?{.*$',
    'm');

  while (allRules.length) {
    currentRule = allRules.shift();

    if (currentRule.cssText.match(ruleRegexp)) {
      return currentRule;
    }
  }

  return null;
};

/**
 * Appends {@link CSSRule}
 * @param {CSSRule} cssRule
 * @param {CSSStyleSheet} stylesheet
 * @param {number=} opt_index
 */
Tools.style.addCSSRule = function (cssRule, stylesheet, opt_index) {
  stylesheet.insertRule(cssRule.cssText, opt_index || 0);
};

/**
 * Takes selector and style object as arguments, creates a new CSS <style>
 * tag and immediately applies it.
 * @param {string} selector
 * @param {Object} style
 * @return {HTMLStyleElement}
 */
Tools.style.addDocumentStyle = function (selector, style) {
  var styleText = [
    selector, '{',
    JSON.stringify(style).replace(/\"/g, '').replace(',', ';'), '}'
  ].join(' ');

  var styleElement = /** @type {HTMLStyleElement} */ (document.createElement(
    'style'));
  styleElement.type = 'text/css';

  if (styleElement.sheet) {
    styleElement.sheet.cssText = styleText;
  } else {
    styleElement.appendChild(document.createTextNode(styleText));
  }

  document.head.appendChild(styleElement);

  return styleElement;
};

/**
 * @param {HTMLStyleElement} styleElement
 */
Tools.style.removeDocumentStyle = function (styleElement) {
  document.head.removeChild(styleElement);
};

/**
 * @return {string}
 */
Tools.style.getPrefixedKeyframesRule = function () {
  var prefix = null;
  var rule = 'keyframes';

  if (Tools.isDef(CSSRule.WEBKIT_KEYFRAME_RULE)) {
    prefix = 'webkit';
  } else if (Tools.isDef(CSSRule.MOZ_KEYFRAME_RULE)) {
    prefix = 'moz';
  } else if (Tools.isDef(CSSRule.O_KEYFRAME_RULE)) {
    prefix = 'o';
  } else if (Tools.isDef(CSSRule.MS_KEYFRAME_RULE)) {
    prefix = 'ms';
  }

  if (prefix) {
    return ['@', prefix, rule].join('-');
  }

  return ['@', rule].join('');
};

/**
 * Appends rule with correct vendor prefix.
 * @param {Element} element
 * @param {string} rule
 * @param {string} value
 */
Tools.style.appendAnimationVendorRule = function (element, rule, value) {
  // todo(igor.alexeenko): Refactor.

  var vendorPrefixes = ['moz', 'o', 'webkit', 'ms'];
  var prefix;

  while ((prefix = vendorPrefixes.shift())) {
    var currentRule = [prefix, Tools.capitalizeFirstLetter(rule)].join('');
    element.style[currentRule] = value;
  }

  element.style[rule] = value;
};

/**
 * @param {Element}element
 * @param {string} rule
 */
Tools.style.removeAnimationVendorRule = function (element, rule) {
  var vendorPrefixes = ['moz', 'o', 'webkit', 'ms'];
  var prefix;

  while ((prefix = vendorPrefixes.shift())) {
    var currentRule = ['-', prefix, '-', rule].join('');
    element.style.removeProperty(currentRule);
  }

  element.style.removeProperty(rule);
};

/**
 * Fired, when mode is not supported by {@link Diff}.
 * @param {String} namespace
 * @param {Object} modeToName
 * @constructor
 */
Tools.NoSuchModeExceptionFactory = function (namespace, modeToName) {
  var NoSuchModeException = function (mode) {
    this.name = 'Tools.NoSuchModeException';
    this.message = namespace + ': ' + 'Unsupported mode ' + modeToName[mode] + '.';
  };
  Tools.inherit(NoSuchModeException, Error);
  return NoSuchModeException;
};

module.exports = Tools;
