define(['global/global__utils', 'jquery', 'q'], function(utils, $, q) {
  'use strict';

  describe('Utils', function () {
    describe('Promises utils', function () {
      it('isDeferred should detect jQuery Deferreds', function () {
        utils.isDeferred($.Deferred()).should.be.true;
        utils.isDeferred($.Deferred().promise()).should.be.true; // Yes, it's jQuery
      });

      it('isDeferred should not detect any other deferreds and promises', function () {
        utils.isDeferred(q.defer()).should.be.false;
        utils.isDeferred(q.defer().promise).should.be.false;
      });

      it('isPromise should detect jQuery Deferreds', function () {
        utils.isPromise($.Deferred()).should.be.true; // Yes, it's jQuery
        utils.isPromise($.Deferred().promise()).should.be.true;
      });

      it('isPromise should not detect other deferreds', function () {
        utils.isPromise(q.defer()).should.be.false;
      });

      it('isPromise should detect other promises', function () {
        utils.isPromise(q.defer().promise).should.be.true;
      });


      it('wrapPromise should properly wrap proper promise', function () {
        var dfd = q.defer();
        var handler = sinon.spy();

        utils
          .wrapPromise(dfd.promise)
          .done(handler)
          .always(handler);

        dfd.fulfill();

        return dfd.promise.then(function() {
          handler.should.have.been.calledTwice;
        });
      });

      it('wrapPromise should properly wrap object', function () {
        var object = {};

        return utils
          .wrapPromise(object)
          .done(function(result) {
            result.should.equal(object);
          });
      });
    });
  });
});
