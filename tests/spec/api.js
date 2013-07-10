/*global describe:false, it:false, assert:false, expect:false */
'use strict';
(function () {
  describe('Give it some context', function () {
    describe('maybe a bit more context here', function () {
      it('should run here few assertions', function () {
        var foo = 'test';
        assert.equal(foo, 'test');
        expect(foo).to.equal('test');
        foo.should.equal('test');
      });
    });
  });
})();
