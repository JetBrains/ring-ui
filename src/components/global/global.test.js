var Global = require('./global');

describe('Global', function() {
  describe('addSingletonGetter', function() {
    var SomeClass = function() {
      this.classProperty = 'val';
    };
    Global.addSingletonGetter(SomeClass);

    it('Global.getInstance() saves static private link to the ' +
    'instance to constructor', function() {
      expect(SomeClass.instance_).to.not.exist;
      SomeClass.getInstance();
      SomeClass.instance_.should.be.instanceOf(SomeClass);
    });

    it('Global.getInstance() always returns the same instance', function() {
      var instance = SomeClass.getInstance();
      var anotherInstance = SomeClass.getInstance();

      instance.should.equal(anotherInstance);
      instance.classProperty.should.equal(anotherInstance.classProperty);
    });
  });

  describe('getUIDGenerator', function() {
    var generate = Global.getUIDGenerator('prefix-', 0);

    it('getUIDGenerator should generate unique ids', function() {
      var id0 = generate();
      var id1 = generate();
      id0.should.be.ok;
      id1.should.be.ok;
      id0.should.not.equal(id1);
    });
  });

  describe('ClassName', function() {
    var className;
    var BASE_CLASS = 'base-class';

    beforeEach(function() {
      className = new Global.ClassName(BASE_CLASS);
    });

    it('should create BEM-name generator', function() {
      className.should.be.ok;
      className.baseName.should.equal(BASE_CLASS);
    });

    it('getClassName() without arguments should return base class as is', function() {
      className.getClassName().should.equal(BASE_CLASS);
    });

    it('getClassName() with first argument should return BEM-name of element', function() {
      className.getClassName('element').should.equal(BASE_CLASS + '__element');
    });

    it('getClassName() with second argument should return BEM-modificator of element', function() {
      className.getClassName(undefined, 'modifier').should.equal(BASE_CLASS + '_modifier');
      className.getClassName(null, 'modifier').should.equal(BASE_CLASS + '_modifier');
      className.getClassName('', 'modifier').should.equal(BASE_CLASS + '_modifier');
      className.getClassName(false, 'modifier').should.equal(BASE_CLASS + '_modifier');
    });

    it('getClassName() with both arguments should return valid BEM-name', function() {
      className.getClassName('element', 'modifier').should.equal(BASE_CLASS + '__element' + '_modifier');
    });

    describe('shortcuts', function() {
      it('getElement() should return element', function() {
        className.getElement('element').should.equal(BASE_CLASS + '__element');
      });

      it('getModifier() should return modifier', function() {
        className.getModifier('modifier').should.equal(BASE_CLASS + '_modifier');
      });
    });
  });

  describe('RuleInsertHelper', function() {
    var ruleInsertHelper = Global.RuleInsertHelper.getInstance();

    describe('RuleInsertHelper._getStylesheet()', function() {
      it('_getStylesheet() creates a valid CSSStyleElement', function() {
        var sheet = ruleInsertHelper._getStylesheet();
      });
    });

    describe('RuleInsertHelper.getRule()', function() {
      it('getRule() generates a valid CSSRule string from given selector and object', function() {
        ruleInsertHelper.getRule('.selector', {width: '150px', height: '200px'}).should.equal('.selector{width:150px;height:200px}');
      });
    });

    describe.only('RuleInsertHelper.insertRule()', function() {
      it('insertRule() inserts a valid rule that works', function() {
        ruleInsertHelper.insertRule(ruleInsertHelper.getRule('body', { background: '#000' }));
        var computedStyle = window.getComputedStyle(document.body);
        computedStyle.background.should.equal('#000');
      });
    });
  });
});
