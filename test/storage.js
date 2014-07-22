define(['global/global', 'chai', 'q', 'storage/storage', 'storage/storage__fallback', 'chai-as-promised'], function(ring, chai, q, Storage, FallbackStorage) {
  'use strict';

  describe('Storage', function () {
    beforeEach(function(){
      localStorage.clear();
    });

    testStorage(new Storage());
  });

  describe('Fallback storage', function () {
    var cookieName = 'testCookie';

    beforeEach(function(){
      document.cookie = cookieName + '=;';
    });

    testStorage(new FallbackStorage({cookieName: cookieName}));
  });

  function testStorage(storage) {
    describe('Set', function () {
      it('Correct set call should be fulfilled', function () {
        return q(storage.set('empty', {})).should.be.fulfilled;
      });

      it('Should correctly set url incopatible characters', function () {
        storage.set('test;', 'value;');

        return q(storage.get('test;')).should.eventually.equal('value;');
      });

      it('Set should fail on wrong input (e.g. on circular objects)', function () {
        var circular = {};
        circular.circular = circular;

        return q(storage.set('circular', circular)).should.be.rejected;
      });
    });

    describe('Get', function () {
      var test = {a: 666};

      it('Should get items', function () {
        storage.set('test2', test);

        return q(storage.get('test2')).should.eventually.deep.equal(test);
      });

      it('Should not return same objects', function () {
        storage.set('test', test);

        return q(storage.get('test')).should.not.eventually.equal(test);
      });

      it('Should fail when there is no item', function () {
        return q(storage.get('test')).should.be.rejected;
      });
    });

    describe('Remove', function () {
      it('Should remove present items', function () {
        storage.set('empty', {});
        storage.remove('empty');

        return q(storage.get('empty')).should.be.rejected;
      });

      it('Correct remove should be fulfilled', function () {
        storage.set('empty', {});
        return q(storage.remove('empty')).should.be.fulfilled;
      });
    });

    describe('Each', function () {
      it('Should iterate over items', function () {
        storage.set('test', 'value');
        var iterator = sinon.spy();

        storage.each(iterator);
        iterator.should.have.been.calledWith('test', 'value');
      });

      it('Correct iteration should be fulfilled', function () {
        storage.set('test1', '');

        return q(storage.each(function () {
        })).should.be.fulfilled;
      });

      it('Should not iterate without items', function () {
        return q(storage.each(function () {
        })).should.be.rejected;
      });

      it('Should iterate over all items', function () {
        var iterator = sinon.spy();

        storage.set('test1', '');
        storage.set('test2', '');
        storage.set('test3', '');
        storage.each(iterator);

        iterator.should.have.been.calledThrice;
      });

      it('Should fail on wrong callback', function () {
        storage.set('test', '');

        return q(storage.each()).should.be.rejected;
      });
    });
  }
});
