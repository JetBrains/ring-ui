function testStorage(storage) {
  describe('Set', function () {
    it('Correct set call should be fulfilled', function () {
      return storage.set('empty', {}).should.be.fulfilled;
    });

    it('Should correctly set url incompatible characters', function () {
      return storage.set('test;', 'value;').
        then(function () {
          return storage.get('test;');
        }).
        should.eventually.equal('value;');
    });

    it('Set should fail on wrong input (e.g. on circular objects)', function () {
      var circular = {};
      circular.circular = circular;

      return storage.set('circular', circular).should.be.rejected;
    });
  });

  describe('Get', function () {
    var test = {a: 666};

    it('Should get items', function () {
      return storage.set('test2', {a: 666}).
        then(function () {
          return storage.get('test2');
        }).
        should.become({a: 666});
    });

    it('Should not return same objects', function () {
      return storage.set('test', test).
        then(function () {
          return storage.get('test');
        }).
        should.not.eventually.equal(test);
    });

    it('Should fail when there is no item', function () {
      return storage.get('test').should.be.rejected;
    });
  });

  describe('Remove', function () {
    it('Should remove present items', function () {
      return storage.set('empty', {}).
        then(function () {
          return storage.remove('empty');
        }).
        then(function () {
          return storage.get('empty');
        }).
        should.be.rejected;
    });

    it('Correct remove should be fulfilled', function () {
      return storage.set('empty', {}).
        then(function () {
          return storage.remove('empty');
        }).
        should.be.fulfilled;
    });
  });

  describe('Each', function () {
    var noop = function () {
    };

    it('Should iterate over items', function () {
      var iterator = sinon.spy();
      return storage.set('test', 'value').
        then(function () {
          return storage.each(iterator);
        }).
        then(function () {
          iterator.should.have.been.calledWith('test', 'value');
        });
    });

    it('Correct iteration should be fulfilled', function () {
      return storage.set('test1', '').
        then(function () {
          return storage.each(noop);
        }).
        should.be.fulfilled;
    });

    it('Should not iterate without items', function () {
      return storage.each(noop).should.be.rejected;
    });

    it('Should iterate over all items', function () {
      var iterator = sinon.spy();
      return storage.set('test1', '').
        then(function () {
          return storage.set('test2', '');
        }).
        then(function () {
          return storage.set('test3', '');
        }).
        then(function () {
          storage.each(iterator);
        }).
        then(function () {
          iterator.should.have.been.calledThrice;
        });
    });

    it('Should fail on wrong callback', function () {
      return storage.set('test', '').
        then(function () {
          return storage.each();
        }).
        should.be.rejected;
    });
  });
}

describe('Storage', function () {
  beforeEach(function () {
    localStorage.clear();
  });

  var Storage = require('./storage__local');

  testStorage(new Storage());
});


describe('Fallback storage', function () {
  var cookieName = 'testCookie';

  beforeEach(function () {
    document.cookie = cookieName + '=;';
  });

  var FallbackStorage = require('./storage__fallback');

  testStorage(new FallbackStorage({cookieName: cookieName}));
});