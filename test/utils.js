define(['global/global__utils', 'jquery', 'q'], function(utils, $, q) {
  'use strict';

  describe('Utils', function () {
    describe('Promises', function () {
      it('isDeferred', function () {
        utils.isDeferred($.Deferred()).should.be.true;
        utils.isDeferred($.Deferred().promise()).should.be.true; // Yes, it's jQuery
        utils.isDeferred(q.defer()).should.be.false;
        utils.isDeferred(q.defer().promise).should.be.false;
      });


      it('isPromise', function () {
        utils.isPromise($.Deferred()).should.be.true; // Yes, it's jQuery
        utils.isDeferred($.Deferred().promise()).should.be.true;
        utils.isPromise(q.defer()).should.be.false;
        utils.isPromise(q.defer().promise).should.be.true;
      });

      it('warpPromise', function () {
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
    });
  });
});
