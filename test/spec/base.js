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

      it('should has trigger', function () {
        o.should.have.property('trigger').and.be.a('function');
      });

      it('should has add', function () {
        o.should.have.property('add').and.be.a('function');
      });

      it('should has remove', function () {
        o.should.have.property('remove').and.be.a('function');
      });
    });

//    var moduleName = 'testModule';
//
//    var lol = function() {
//      return 'lol';
//    };
//
//    describe('Add and remove', function () {
//      it('new add should be true', function () {
//        o.add(moduleName, {
//          getLol: lol
//        }).should.be.equal(true);
//      });
//
//      it('dupe add should be false', function () {
//        o.add(moduleName, {
//          getLol: lol
//        }).should.be.equal(false);
//      });
//
//      it('remove should be true', function () {
//        o.remove(moduleName).should.be.equal(true);
//      });
//
//      it('dupe remove should be false', function () {
//        o.remove(moduleName).should.be.equal(false);
//      });
//    });
//
//    describe('Import modules', function () {
//      o.add(moduleName, {
//        getLol: lol
//      });
//
//      var module = ring(moduleName);
//
//      it('new add should be true', function () {
//        o(moduleName, {
//          getLol: lol
//        }).should.be.equal(true);
//      });
//
//      it('dupe add should be false', function () {
//        o.add(moduleName, {
//          getLol: lol
//        }).should.be.equal(false);
//      });
//
//      it('remove should be true', function () {
//        o.remove(moduleName).should.be.equal(true);
//      });
//
//      it('dupe remove should be false', function () {
//        o.remove(moduleName).should.be.equal(false);
//      });
//    });
  });
})();
