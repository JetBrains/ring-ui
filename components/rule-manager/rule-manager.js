/**
 * @author igor.alexeenko@jetbrains.com (Igor Alexeenko)
 */

/**
 * Rule insertion helper to create dynamic stylesheets and CSS rules.
 * @constructor
 */
var RuleManager = function() {};

/**
 * Creates a stylesheet if one doesn't exist and returns it.
 * @return {HTMLStyleElement}
 * @private
 */
RuleManager.prototype._getStylesheet = function() {
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
RuleManager.prototype.insertRule = function(ruleText) {
  var stylesheet = this._getStylesheet();
  var rulesLength = this._stylesheet.sheet.cssRules ? this._stylesheet.sheet.cssRules.length : 0;
  stylesheet.sheet.insertRule(ruleText, rulesLength);
  return rulesLength;
};

/**
 * Deletes rule by index.
 * @param {number} ruleIndex
 */
RuleManager.prototype.deleteRule = function(ruleIndex) {
  var stylesheet = this._getStylesheet();
  stylesheet.sheet.deleteRule(ruleIndex);
};

/**
 * @param {string|Array.<string>} selector
 * @param {Object} styleObj
 * @return {string}
 */
RuleManager.prototype.getRule = function(selector, styleObj) {
  if (selector instanceof Array) {
    selector = selector.join(',');
  }

  return [selector, JSON.stringify(styleObj).replace(/"/g, '').replace(/,/g, ';')].join('');
};

/**
 * Removes all rules in the stylesheet.
 */
RuleManager.prototype.cleanup = function() {
  var stylesheet = this._getStylesheet();
  while (stylesheet.sheet.cssRules.length) {
    this.deleteRule(0);
  }
};

module.exports = RuleManager;
