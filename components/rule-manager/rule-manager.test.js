/**
 * @author igor.alexeenko@jetbrains.com (Igor Alexeenko)
 */

var RuleManager = require('./rule-manager');

describe('RuleManager', function() {
  var ruleManager;

  beforeEach(function() {
    ruleManager = new RuleManager();
  });

  describe('RuleInsertHelper._getStylesheet()', function() {
    it('_getStylesheet() creates a valid CSSStyleElement', function() {
      var sheet = ruleManager._getStylesheet();
      sheet.should.exist;
      sheet.should.be.an.instanceof(HTMLStyleElement);
    });
  });

  describe('RuleInsertHelper.getRule()', function() {
    it('getRule() generates a valid CSSRule string from given selector and object', function() {
      ruleManager.getRule('.selector', {width: '150px', height: '200px'}).should.equal('.selector{width:150px;height:200px}');
    });

    it('should generate valid CSSRule string for multiple selectors if first argument is an array', function() {
      ruleManager.getRule(['.selector1', '.selector2'], {width: '150px', height: '200px'}).should.equal('.selector1,.selector2{width:150px;height:200px}');
    });
  });

  describe('RuleInsertHelper.insertRule()', function() {
    it('insertRule() inserts a valid rule that works', function() {
      ruleManager.insertRule(ruleManager.getRule('body', { 'font-size': '12px' }));
      var computedStyle = window.getComputedStyle(document.body);
      computedStyle.fontSize.should.equal('12px');
    });
  });

  describe('RuleInsertHelper.deleteRule()', function() {
    it('deleteRule() deletes a CSS rule', function() {
      ruleManager.insertRule(ruleManager.getRule('body', { 'font-size': '12px' }));
      var sheet = ruleManager._getStylesheet();
      sheet.sheet.cssRules.length.should.equal(1);
      ruleManager.deleteRule(0);
      sheet.sheet.cssRules.length.should.equal(0);
    });
  });

  describe('RuleInsertHelper.cleanup()', function() {
    it('cleanup() deletes all CSS rules', function() {
      ruleManager.insertRule(ruleManager.getRule('body', { 'font-size': '12px' }));
      ruleManager.insertRule(ruleManager.getRule('body', { 'font-weight': 'bold' }));

      var sheet = ruleManager._getStylesheet();
      sheet.sheet.cssRules.length.should.equal(2);
      ruleManager.cleanup();
      sheet.sheet.cssRules.length.should.equal(0);
    });
  });
});


