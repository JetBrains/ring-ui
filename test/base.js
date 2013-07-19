/*global describe:false, it:false, expect:false */
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

    describe('Internal methods', function () {
      it('should has get', function () {
        o.should.have.property('get').and.be.a('function');
      });

      it('should has set', function () {
        o.should.have.property('set').and.be.a('function');
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

      ring()('add', moduleName, data);
      var module = ring(moduleName);

      var brokenModule = {
        brokenMethod: function() {}
      };
      brokenModule.brokenMethod.method = {};

      ring()('add', 'brokenModule', brokenModule);

      it('method should return $.Deferred', function () {
        module(methodName).should.have.property('promise').and.be.a('function');
      });

      it('broken method should return $.Deferred', function () {
        ring('brokenModule', 'brokenMethod')().should.have.property('promise').and.be.a('function');
      });

      it('method should be resolved', function () {
        module(methodName).state().should.be.equal('resolved');
      });

      it('method should return right result on done and always', function () {
        module(methodName)
          .done(function(result) {
            result.should.be.equal(moduleRet);
          })
          .always(function(result) {
            result.should.be.equal(moduleRet);
          });
      });

      it('broken method should be rejected', function () {
        ring('brokenModule', 'brokenMethod')().state().should.be.equal('rejected');
      });

      it('broken method should return right result on fail', function () {
        ring('brokenModule', 'brokenMethod')()
          .fail(function(result) {
            expect(result).to.be.equal(null);
          });
      });

      it('module.invoke should return $.Deferred', function () {
        module.invoke(methodName).should.have.property('promise').and.be.a('function');
      });

      it('module.invoke should return right result on done and always', function () {
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

      ring()('add',moduleName, data);

      var method = ring(moduleName, methodName);

      it('method should return $.Deferred', function () {
        method().should.have.property('promise').and.be.a('function');
      });

      it('method should return right result on done and always', function () {
        method()
          .done(function(result) {
            result.should.be.equal(moduleRet);
          })
          .always(function(result) {
            result.should.be.equal(moduleRet);
          });
      });

      it('method should return $.Deferred', function () {
        method().should.have.property('promise').and.be.a('function');
      });

      it('method should return right result on done and always', function () {
        method()
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
