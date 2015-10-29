/**
 * @fileoverview Wrapper to manipulate BEM classes.
 * @author igor.alexeenko (Igor Alekseyenko)
 */


/**
 * @param {string} baseName
 * @constructor
 */
var ClassName = function (baseName) {
  this.setBaseName(baseName);
};

/**
 * @param {string=} element
 * @param {string=} modifier
 * @return {string}
 */
ClassName.prototype.getClassName = function (element, modifier) {
  var className = this.baseName;

  if (element) {
    className += '__' + element;
  }
  if (modifier) {
    className += '_' + modifier;
  }

  return className;
};

/**
 * @param {string} element
 * @return {string}
 */
ClassName.prototype.getElement = function (element) {
  return this.getClassName(element);
};

/**
 * @param {string} modifier
 * @return {string}
 */
ClassName.prototype.getModifier = function (modifier) {
  return this.getClassName(undefined, modifier);
};

/**
 * @param {string} baseName
 */
ClassName.prototype.setBaseName = function (baseName) {
  this.baseName = baseName;
};

module.exports = ClassName;
