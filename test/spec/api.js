/*global describe:false, it:false, assert:false, expect:false */
'use strict';
(function () {
  describe('Global module', function () {
    var ring = window.ring;

    it('should be a function', function () {
      ring.should.be.a('function');
    });

    describe('Basic methods', function () {
      var o = ring();

      it('should has invoke', function () {
        o.should.have.property('invoke').and.be.a('function');
      });
    });
  });
})();
