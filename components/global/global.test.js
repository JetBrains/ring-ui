var Global = require('./global');

describe('Global', function() {
  describe('makeSingleton', function() {
    var SomeClass = function() {
      this.classProperty = 'val';
    };
    Global.makeSingleton(SomeClass);

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
});
