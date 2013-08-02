/*global describe:false, it:false, expect:false */
'use strict';
(function () {
  var ring = window.ring;

  describe('Global module', function () {
    var o = ring();

    it('ring should return a function', function () {
      expect(o).to.be.a('function');
    });

    describe('Basic methods existence', function () {
      it('should has invoke', function () {
        expect(o.invoke).to.be.a('function');
      });

      it('base function should be equal to invoke', function () {
        expect(o.invoke).to.be.equal(o);
      });

      it('should has on', function () {
        expect(o.on).to.be.a('function');
      });

      it('should has off', function () {
        expect(o.off).to.be.a('function');
      });

      it('should has trigger', function () {
        expect(o.trigger).to.be.a('function');
      });
    });

    describe('Internal methods', function () {
      it('should has get', function () {
        expect(o.get).to.be.a('function');
      });

      it('should has set', function () {
        expect(o.set).to.be.a('function');
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
        expect(module(methodName).promise).to.be.a('function');
      });

      it('broken method should return $.Deferred', function () {
        expect(ring('brokenModule', 'brokenMethod')().promise).to.be.a('function');
      });

      it('method should be resolved', function () {
        expect(module(methodName).state()).to.be.equal('resolved');
      });

      it('method should return right result on done and always', function () {
        module(methodName)
          .done(function(result) {
            expect(result).to.be.equal(moduleRet);
          })
          .always(function(result) {
            expect(result).to.be.equal(moduleRet);
          });
      });

      it('broken method should be rejected', function () {
        expect(ring('brokenModule', 'brokenMethod')().state()).to.be.equal('rejected');
      });

      it('broken method should return right result on fail', function () {
        ring('brokenModule', 'brokenMethod')()
          .fail(function(result) {
            expect(result).to.be.equal(null);
          });
      });

      it('module.invoke should return $.Deferred', function () {
        expect(module.invoke(methodName).promise).to.be.a('function');
      });

      it('module.invoke should return right result on done and always', function () {
        module.invoke(methodName)
          .done(function(result) {
            expect(result).to.be.equal(moduleRet);
          })
          .always(function(result) {
            expect(result).to.be.equal(moduleRet);
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
        expect(method().promise).to.be.a('function');
      });

      it('method should return right result on done and always', function () {
        method()
          .done(function(result) {
            expect(result).to.be.equal(moduleRet);
          })
          .always(function(result) {
            expect(result).to.be.equal(moduleRet);
          });
      });

      it('method should return $.Deferred', function () {
        expect(method().promise).to.be.a('function');
      });

      it('method should return right result on done and always', function () {
        method()
          .done(function(result) {
            expect(result).to.be.equal(moduleRet);
          })
          .always(function(result) {
            expect(result).to.be.equal(moduleRet);
          });
      });

    });

    describe('Multi-methods', function () {
      var moduleName = 'test-Multi-methods-Module';
      var methodName = 'init';
      var moduleRet = 'lol';

      var data = {};
      data[methodName] = function(ret) {
        return ret;
      };

      o('add', moduleName, data);

      it('multi-method should return $.Deferred', function () {
        expect(o(methodName).promise).to.be.a('function');
      });

      it('complete multi-method call should be resolved', function () {
        o(methodName, {
          'test-Multi-methods-Module': moduleRet
        })
          .done(function(result) {
            expect(result).to.be.equal(moduleRet);
          });
      });

      it('multi-method results should in right order', function () {
        o(methodName, {
          'inexistent method': null,
          'test-Multi-methods-Module': moduleRet
        })
          .done(function(result1, result2) {
            expect(result1).to.be.null;
            expect(result2).to.be.equal(moduleRet);
          });
      });

      it('incomplete multi-method call should be rejected', function () {
        expect(o(methodName).state()).to.be.equal('rejected');
      });
    });
  });
})();
