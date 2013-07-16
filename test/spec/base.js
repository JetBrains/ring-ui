/*global describe:false, it:false */
'use strict';
(function () {
  var ring = window.ring;

  describe('Global module', function () {
    var o = ring();

    it('ring should return a function', function () {
      o.should.be.a('function');
    });

    describe('Basic methods existence', function () {
      it('should has invoke', function () {
        o.should.have.property('invoke').and.be.a('function');
      });

      it('base function should be equal to invoke', function () {
        o.should.have.property('invoke').and.be.equal(o);
      });

      it('should has on', function () {
        o.should.have.property('on').and.be.a('function');
      });

      it('should has off', function () {
        o.should.have.property('off').and.be.a('function');
      });

      it('should has trigger', function () {
        o.should.have.property('trigger').and.be.a('function');
      });
    });

    describe('Add and remove', function () {
      var moduleName = 'test-AddRemove-Module';

      it('should has add', function () {
        ring.should.have.property('add').and.be.a('function');
      });

      it('should has remove', function () {
        ring.should.have.property('remove').and.be.a('function');
      });

      it('new add should be true', function () {
        ring.add(moduleName, {}).should.be.equal(true);
      });

      it('dupe add should be false', function () {
        ring.add(moduleName, {}).should.be.equal(false);
      });

      it('remove should be true', function () {
        ring.remove(moduleName).should.be.equal(true);
      });

      it('dupe remove should be false', function () {
        ring.remove(moduleName).should.be.equal(false);
      });
    });

    describe('Use methods', function () {
      var moduleName = 'test-UseMethods-Module';
      var methodName = 'testMethod';
      var moduleRet = 'lol';

      var data = {};
      data[methodName] = function() {
        return moduleRet;
      };

      ring.add(moduleName, data);

      var module = ring(moduleName);

      it('method should return $.Deferred', function () {
        module.invoke(methodName).should.have.property('promise').and.be.a('function');
      });

      it('method should return right result on done and always', function () {
        module.invoke(methodName)
          .done(function(result) {
            result.should.be.equal(moduleRet);
          })
          .always(function(result) {
            result.should.be.equal(moduleRet);
          });
      });
    });

    describe('Use shorthand methods', function () {
      var moduleName = 'test-UseShorthandMethods-Module';
      var methodName = 'testMethod';
      var moduleRet = 'lol';

      var data = {};
      data[methodName] = function() {
        return moduleRet;
      };

      ring.add(moduleName, data);

      var method = ring(moduleName, methodName);

      it('method should return $.Deferred', function () {
        method().should.have.property('promise').and.be.a('function');
      });

      it('method should return right result on done and always', function () {
        method( )
          .done(function(result) {
            result.should.be.equal(moduleRet);
          })
          .always(function(result) {
            result.should.be.equal(moduleRet);
          });
      });

    });
  });
})();
