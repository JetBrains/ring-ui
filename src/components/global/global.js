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

/**
 * @param {string} baseName
 * @constructor
 */
var ClassName = function(baseName) {
  this.setBaseName(baseName);
};

/**
 * @param {string=} element
 * @param {string=} modifier
 * @return {string}
 */
ClassName.prototype.getClassName = function(element, modifier) {
  var className = this.baseName;

  if (element) { className += '__' + element; }
  if (modifier) { className += '_' + modifier; }

  return className;
};

/**
 * @param {string} element
 * @return {string}
 */
ClassName.prototype.getElement = function(element) {
  return this.getClassName(element);
};

/**
 * @param {string} modifier
 * @return {string}
 */
ClassName.prototype.getModifier = function(modifier) {
  return this.getClassName(undefined, modifier);
};

/**
 * @param {string} baseName
 */
ClassName.prototype.setBaseName = function(baseName) {
  this.baseName = baseName;
};


/**
 * Rule insert helper maintanes a stylesheet and manages CSS rules on the go.
 * @constructor
 */
var RuleInsertHelper = function() {};

/**
 * Creates a stylesheet if one doesn't exist and returns it.
 * @return {HTMLStyleElement}
 * @private
 */
RuleInsertHelper.prototype._getStylesheet = function() {
  if (!this._stylesheet) {
    this._stylesheet = document.createElement('style');
    this._stylesheet.type = 'text/css';
    this._stylesheet.appendChild(document.createTextNode(' '));
    document.body.appendChild(this._stylesheet);
  }

  return this._stylesheet;
};

/**
 * Appends a rule to a stylesheet.
 * @param {string} ruleText
 * @return {number}
 */
RuleInsertHelper.prototype.insertRule = function(ruleText) {
  var stylesheet = this._getStylesheet();
  var rulesLength = this._stylesheet.sheet.cssRules ? this._stylesheet.sheet.cssRules.length : 0;
  stylesheet.sheet.insertRule(ruleText, rulesLength);
  return rulesLength;
};

/**
 * Deletes rule by index.
 * @param {number} ruleIndex
 */
RuleInsertHelper.prototype.deleteRule = function(ruleIndex) {
  var stylesheet = this._getStylesheet();
  stylesheet.sheet.deleteRule(ruleIndex);
};

/**
 * @param {string|Array.<string>} selector
 * @param {Object} styleObj
 * @return {string}
 */
RuleInsertHelper.prototype.getRule = function(selector, styleObj) {
  if (selector instanceof Array) {
    selector = selector.join(',');
  }

  return [selector, JSON.stringify(styleObj).replace(/"/g, '').replace(/,/g, ';')].join('');
};

/**
 * Removes all rules in the stylesheet.
 */
RuleInsertHelper.prototype.cleanup = function() {
  var stylesheet = this._getStylesheet();
  while (stylesheet.sheet.rules.length) {
    this.deleteRule(0);
  }
};


module.exports = Global;
module.exports.ClassName = ClassName;
module.exports.RuleInsertHelper = RuleInsertHelper;

