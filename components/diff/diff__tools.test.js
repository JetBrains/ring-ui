describe('Diff', function () {
  describe('tools', function () {
    var diffTool = require('./diff__tools');

    describe('#createObject', function () {
      it('should creates object from list of arguments', function () {
        diffTool.createObject('foo', 1, 'bar', 2).should.be.deep.
          equal({
            foo: 1,
            bar: 2
          });
      });

      it('should creates object if first argument is array', function () {
        diffTool.createObject(['foo', 1, 'bar', 2]).should.be.deep.
          equal({
            foo: 1,
            bar: 2
          });
      });

      it('should raise an Error if odd number of arguments was given', function () {
        diffTool.createObject.bind(diffTool, 'foo', 1, 'bar').should.
          throw(Error, 'Odd number of arguments.');
      });
    });

    describe('#mixin', function () {
      it('should appends fields of mixin object to target object', function () {
        diffTool.mixin({foo: 1}, {bar: 2}).should.be.deep.equal({
          foo: 1,
          bar: 2
        });
      });

      it('should overrides fields with the same keys in original object by values from mixin.', function () {
        diffTool.mixin({bar: 1}, {bar: 2}).should.be.deep.equal({bar: 2});
      });

      it('should does not override fields with the same keys if parameter override is false', function () {
        diffTool.mixin({bar: 1}, {bar: 2}, false).should.be.deep.equal({bar: 1});
      });
    });

    describe('#clamp', function () {
      it('should does nothing with value if it is already clamp inside min and max', function () {
        diffTool.clamp(10, 0, 20).should.equal(10);
      });

      it('should corrects value if it is greater then max', function () {
        diffTool.clamp(30, 0, 20).should.equal(20);
      });

      it('should corrects value if it is less then min', function () {
        diffTool.clamp(-10, 0, 20).should.equal(0);
      });
    });

    describe('#deleteFromArray', function () {
      it('should deletes element from an array', function () {
        diffTool.deleteFromArray([1, 2, 3], 1).should.be.deep.equal([2, 3]);

        var obj1 = {foo: true};
        var obj2 = {bar: true};
        diffTool.deleteFromArray([obj1, obj2], obj2).should.be.deep.equal([obj1]);
      });

      it('should not delete element from array if it does not exist', function () {
        diffTool.deleteFromArray([1, 2, 3], 4).should.be.deep.equal([1, 2, 3]);
      });
    });

    describe('#arraysAreEqual', function () {
      it('should return true if arrays contain same elements', function () {
        diffTool.arraysAreEqual([1, false, 'asd'], [1, false, 'asd']).should.be.true;
      });

      it('should return false if arrays have different elements', function () {
        diffTool.arraysAreEqual([1], [1, 2]).should.be.false;
      });

      it('should return true if compare empty arrays', function () {
        diffTool.arraysAreEqual([], []).should.be.true;
      });

      it('should compare using strict equal', function () {
        var obj = {foo: 1};
        var cloneObj = {foo: 1};

        diffTool.arraysAreEqual([obj], [obj]).should.be.true;
        diffTool.arraysAreEqual([obj], [cloneObj]).should.be.false;
      });
    });

    describe('#isEmptyString', function () {
      it('should returns true if string contains only space characters', function () {
        diffTool.isEmptyString('\n\n\t\r\n\r   ').should.be.true;
      });

      it('should return false if string is not empty', function () {
        diffTool.isEmptyString('Is not empty string').should.be.false;
      });
    });

    describe('#inherit', function () {
      var ParentClass = function () {
      };
      var ChildClass;
      var childClassInstance;

      beforeEach(function () {
        ChildClass = function () {
        };
        diffTool.inherit(ChildClass, ParentClass);
        childClassInstance = new ChildClass();

        ParentClass.prototype.parentProperty = true;
      });

      it('diffTool.inherit inherits childClass from parentClass', function () {
        childClassInstance.should.be.instanceOf(ChildClass);
        childClassInstance.should.be.instanceOf(ParentClass);
        ChildClass.prototype.parentProperty.should.be.true;
      });

      it('diffTool.inherit appends link to parent class to a child static property super_.', function () {
        ChildClass.super_.should.equal(ParentClass.prototype);
      });

      it('diffTool.inherit changes nothing in parent, so changes in child does not cause changes in parent.', function () {
        ChildClass.prototype.parentProperty = false;
        ChildClass.prototype.parentProperty.should.be.false;
        ParentClass.prototype.parentProperty.should.be.true;
      });
    });

    describe('diffTool.bindContext()', function () {
      var ctx = {param: 1};
      var fn = function () {
        return this;
      };

      var bindFunction = diffTool.bindContext(fn, ctx);

      it('diffTool.bindContext does not change initial function', function () {
        expect(fn()).not.to.be.equal(ctx);
      });

      it('diffTool.bindContext always calls function with bind ' +
      'context', function () {
        bindFunction().should.equal(ctx);
      });

      it('diffTool.bindContext calls function with bind context ' +
      'even if it was called by call/apply methods.', function () {
        bindFunction.call(null).should.equal(ctx);
      });
    });
  });
});
