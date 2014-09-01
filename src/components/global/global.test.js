var Global = require('./global');

describe('Global', function() {
  describe('Global.addSingletonGetter', function() {
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
});