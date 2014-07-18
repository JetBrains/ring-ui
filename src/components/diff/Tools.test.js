'use strict';

describe('Diff.Tools', function () {
  var diffTool = require('./Tools');

  describe('#createObject', function () {
    it('should creates object from list of arguments', function () {
      expect(diffTool.createObject('foo', 1, 'bar', 2))
        .toEqual({
          foo: 1,
          bar: 2
        });
    });

    it('should creates object if first argument is array', function () {
      expect(diffTool.createObject(['foo', 1, 'bar', 2]))
        .toEqual({
          foo: 1,
          bar: 2
        });
    });

    it('should raises an Error if odd number of arguments was given', function () {
      expect(diffTool.createObject.bind(diffTool, 'foo', 1, 'bar'))
        .toThrow('Odd number of arguments.');
    });
  });

  describe('#mixin', function () {
    it('should appends fields of mixin object to target object', function () {
      expect(diffTool.mixin({ foo: 1 }, { bar: 2 })).toEqual({ foo: 1, bar: 2 });
    });

    it('should overrides fields with the same keys in original object by values from mixin.', function () {
      expect(diffTool.mixin({ bar: 1 }, { bar: 2 })).toEqual({ bar: 2 });
    });

    it('should does not override fields with the same keys if parameter override is false', function () {
      expect(diffTool.mixin({ bar: 1 }, { bar: 2 }, false)).toEqual({ bar: 1 });
    });
  });

  describe('#clamp', function () {
    it('should does nothing with value if it is already clamp inside min and max', function () {
      expect(diffTool.clamp(10, 0, 20)).toEqual(10);
    });

    it('should corrects value if it is greater then max', function () {
      expect(diffTool.clamp(30, 0, 20)).toEqual(20);
    });

    it('should corrects value if it is less then min', function () {
      expect(diffTool.clamp(-10, 0, 20)).toEqual(0);
    });
  });

  describe('#deleteFromArray', function () {
    it('should deletes element from an array', function () {
      expect(diffTool.deleteFromArray([1, 2, 3], 1)).toEqual([2, 3]);

      var obj1 = { foo: true };
      var obj2 = { bar: true };
      expect(diffTool.deleteFromArray([obj1, obj2], obj2)).toEqual([obj1]);
    });

    it('should not delete element from array if it does not exist', function () {
      expect(diffTool.deleteFromArray([1, 2, 3], 4)).toEqual([1, 2, 3]);
    });
  });

  describe('#arraysAreEqual', function () {
    it('should return true if arrays contain same elements', function () {
      expect(diffTool.arraysAreEqual([1, false, 'asd'], [1, false, 'asd']))
        .toEqual(true);
    });

    it('should return false if arrays have different elements', function () {
      expect(diffTool.arraysAreEqual([1], [1, 2]))
        .toEqual(false);
    });

    it('should return true if compare empty arrays', function () {
      expect(diffTool.arraysAreEqual([], [])).toEqual(true);
    });

    it('should compare using strict equal', function () {
      var obj = { foo: 1 };
      var cloneObj = {foo: 1};

      expect(diffTool.arraysAreEqual([obj], [obj]))
        .toEqual(true);
      expect(diffTool.arraysAreEqual([obj], [cloneObj]))
        .toEqual(false);
    });
  });

  describe('#isEmptyString', function () {
    it('should returns true if string contains only space characters', function () {
      expect(diffTool.isEmptyString('\n\n\t\r\n\r   '))
        .toEqual(true);
    });

    it('should return false if string is not empty', function () {
      expect(diffTool.isEmptyString('Is not empty string'))
        .toEqual(false);
    });
  });

  describe('#inherit', function() {
    var ParentClass = function() {};
    var ChildClass;
    var childClassInstance;

    beforeEach(function () {
      ChildClass = function() {};
      diffTool.inherit(ChildClass, ParentClass);
      childClassInstance = new ChildClass();

      ParentClass.prototype.parentProperty = true;
    });

    it('diffTool.inherit inherits childClass from parentClass', function() {
      expect(childClassInstance).toBeInstanceOf(ChildClass);
      expect(childClassInstance).toBeInstanceOf(ParentClass);
      expect(ChildClass.prototype.parentProperty).toEqual(true);
    });

    it('diffTool.inherit appends link to parent class to a child static property super_.', function() {
      expect(ChildClass.super_).toEqual(ParentClass.prototype);
    });

    it('diffTool.inherit changes nothing in parent, so changes in child does not cause changes in parent.', function() {
      ChildClass.prototype.parentProperty = false;
      expect(ChildClass.prototype.parentProperty).toEqual(false);
      expect(ParentClass.prototype.parentProperty).toEqual(true);
    });
  });

  describe('diffTool.addSingletonGetter', function() {
    var SomeClass = function() {
      this.classProperty = 'val';
    };
    diffTool.addSingletonGetter(SomeClass);

    it('diffTool.getInstance() saves static private link to the ' +
      'instance to constructor', function() {
      expect(SomeClass.instance_).toEqual(undefined);
      SomeClass.getInstance();
      expect(SomeClass.instance_).toBeInstanceOf(SomeClass);
    });

    it('diffTool.getInstance() always returns the same instance', function() {
      var instance = SomeClass.getInstance();
      var anotherInstance = SomeClass.getInstance();

      expect(instance).toEqual(anotherInstance);
      expect(instance.classProperty).toEqual(anotherInstance.classProperty);
    });
  });

  describe('diffTool.bindContext()', function() {
    var ctx = { param: 1 };
    var fn = function() {
      return this;
    };

    var bindFunction = diffTool.bindContext(fn, ctx);

    it('diffTool.bindContext does not change initial function', function() {
      expect(fn()).not.toEqual(ctx);
    });

    it('diffTool.bindContext always calls function with bind ' +
      'context', function() {
      expect(bindFunction()).toEqual(ctx);
    });

    it('diffTool.bindContext calls function with bind context ' +
      'even if it was called by call/apply methods.', function() {
      expect(bindFunction.call(null)).toEqual(ctx);
    });
  });
});
