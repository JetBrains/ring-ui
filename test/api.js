/*global describe:false, it:false, expect:false */
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
        expect(o('add', moduleName, data)).to.be.equal(true);
      });

      it('method should return right result on done and always', function () {
        ring(moduleName)(methodName)
          .done(function(result) {
            expect(result).to.be.equal(moduleRet);
          })
          .always(function(result) {
            expect(result).to.be.equal(moduleRet);
          });
      });

      it('dupe add should be false', function () {
        expect(o('add', moduleName, data)).to.be.equal(false);
      });

      it('remove should be true', function () {
        expect(o('remove', moduleName)).to.be.equal(true);
      });

      it('dupe remove should be false', function () {
        expect(o('remove', moduleName)).to.be.equal(false);
      });
    });

  });

})();