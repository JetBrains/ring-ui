define(['global/global', 'chai', 'diff/diff'], function(
    ring, chai) {
  'use strict';

  var expect = chai.expect;

  describe('DiffTool utils basics.', function() {
    it('DiffTool utils loads from ring module', function() {
      expect(ring('diff')).to.be.a('function');
    });

    it('Module returns diffTool namespace.', function() {
      var diffTool = ring('diff').invoke('getDiffToolUtils');
      expect(diffTool).to.be.an('object');
    });
  });

  describe('DiffTool utils functionality', function() {
    var diffTool = ring('diff').invoke('getDiffToolUtils');

    it('diffTool.isDef checks whether object is defined or not', function() {
      expect(diffTool.isDef(window.randomUninitializedObject)).to.equal(false);
      expect(diffTool.isDef(diffTool)).to.equal(true);
    });

    it('diffTool.abstractMethod raises an error when called', function() {
      expect(diffTool.abstractMethod).to.throw(Error,
        /This method is not implemented yet\./);
    });

    // todo(igor.alekseenko): Solid way to check whether the function is empty.
    it('diffTool.nullFunction is an empty function', function() {
      expect(diffTool.nullFunction()).to.equal(undefined);
    });

    describe('diffTool.createObject', function() {
      it('diffTool.createObject creates object from list of ' +
          'arguments', function() {
        expect(diffTool.createObject('foo', 1, 'bar', 2)).to.deep.equal({
          foo: 1,
          bar: 2
        });
      });

      it('diffTool.createObject creates object if first argument ' +
          'is array', function() {
        expect(diffTool.createObject(['foo', 1, 'bar', 2])).to.deep.equal({
          foo: 1,
          bar: 2
        });
      });

      it('diffTool.createObject raises an Error if odd number of arguments ' +
        'was given', function() {
        expect(function() { diffTool.createObject('foo', 1, 'bar'); }).to.throw(
            /Odd number of arguments\./);
      });
    });
  });

  describe('diffTool.mixin', function() {
    var diffTool = ring('diff').invoke('getDiffToolUtils');

    it('diffTool.mixin appends fields of mixin object to ' +
      'target object', function() {
      expect(diffTool.mixin({ foo: 1 }, { bar: 2 })).to.deep.equal(
        { foo: 1, bar: 2 });
    });

    it('diffTool.mixin overrides fields with the same keys in ' +
      'original object by values from mixin.', function() {
      expect(diffTool.mixin({ bar: 1 }, { bar: 2 })).to.deep.equal(
        { bar: 2 });
    });

    it('diffTool.mixin does not override fields with the same ' +
      'keys if parameter override is false', function() {
      expect(diffTool.mixin({ bar: 1 }, { bar: 2 }, false)).to.deep.equal(
        { bar: 1 });
    });
  });

  describe('diffTool.clamp', function() {
    var diffTool = ring('diff').invoke('getDiffToolUtils');

    it('diffTool.clamp does nothing with value if it is already ' +
        'clamp inside min and max', function() {
      expect(diffTool.clamp(10, -Infinity, Infinity)).to.equal(10);
    });

    it('diffTool.clamp corrects value if it is greater then max', function() {
      expect(diffTool.clamp(Infinity, 0, 10)).to.equal(10);
    });

    it('diffTool.clamp corrects value if it is less then min', function() {
      expect(diffTool.clamp(-Infinity, 0, Infinity)).to.equal(0);
    });
  });

  describe('diffTool.inherit', function() {
    var diffTool = ring('diff').invoke('getDiffToolUtils');

    var ParentClass = function() {};
    ParentClass.prototype.parentProperty = true;

    var ChildClass = function() {};
    diffTool.inherit(ChildClass, ParentClass);

    var childClassInstance = new ChildClass();

    it('diffTool.inherit inherits childClass from parentClass', function() {
      expect(childClassInstance).to.be.an.instanceof(ChildClass);
      expect(childClassInstance).to.be.an.instanceof(ParentClass);
      expect(ChildClass.prototype.parentProperty).to.equal(true);
    });

    it('diffTool.inherit appends link to parent class to a ' +
      'child\'s static property super_.', function() {
      expect(ChildClass.super_).to.equal(ParentClass.prototype);
    });

    it('diffTool.inherit changes nothing in parent, so changes in child ' +
      'does not cause changes in parent.', function() {
      ChildClass.prototype.parentProperty = false;
      expect(ChildClass.prototype.parentProperty).to.equal(false);
      expect(ParentClass.prototype.parentProperty).to.equal(true);
    });
  });

  describe('diffTool.addSingletonGetter', function() {
    var diffTool = ring('diff').invoke('getDiffToolUtils');

    /**
     * @constructor
     */
    var SomeClass = function() {
      this.classProperty = 'val';
    };
    diffTool.addSingletonGetter(SomeClass);

    it('diffTool.addSingletonGetter adds function getInstance() ' +
        'to constructor', function() {
      expect(SomeClass.getInstance).to.be.a('function');
    });

    it('diffTool.getInstance() saves static private link to the ' +
        'instance to constructor', function() {
      expect(SomeClass.instance_).to.be.an('undefined');
      SomeClass.getInstance();
      expect(SomeClass.instance_).to.be.an.instanceof(SomeClass);
    });

    it('diffTool.getInstance() always returns the same instance', function() {
      var instance = SomeClass.getInstance();
      var anotherInstance = SomeClass.getInstance();

      expect(instance).to.equal(anotherInstance);
      expect(instance.classProperty).to.equal(anotherInstance.classProperty);
    });
  });
});
