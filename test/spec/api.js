/*global describe:false, it:false */
'use strict';
(function () {
  var ring = window.ring;

  describe('Public API', function () {
    var moduleName = 'test-API-Module';
    var methodName = 'testMethod';
    var moduleRet = 'lol';

    var data = {};
    data[methodName] = function() {
      return moduleRet;
    };

    var o = ring();

    describe('Add and remove', function () {
      it('new add should be true', function () {
        o('add', moduleName, data).should.be.equal(true);
      });

      it('method should return right result on done and always', function () {
        var method = ring(moduleName, methodName);

        method()
          .done(function(result) {
            result.should.be.equal(moduleRet);
          })
          .always(function(result) {
            result.should.be.equal(moduleRet);
          });
      });

      it('dupe add should be false', function () {
        o('add', moduleName, data).should.be.equal(false);
      });

      it('remove should be true', function () {
        o('remove', moduleName).should.be.equal(true);
      });

      it('dupe remove should be false', function () {
        o('remove', moduleName).should.be.equal(false);
      });
    });

  });

})();