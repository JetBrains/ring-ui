define(['global/global', 'chai'], function(ring, chai) {
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
  });

  describe('DiffTool utils inheritance', function() {
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
});
