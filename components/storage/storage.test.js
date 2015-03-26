var when = require('when');
var noop = function () {};

function testStorage(storage) {
  describe('set', function () {
    it('should be fulfilled', function () {
      return storage.set('empty', {}).should.be.fulfilled;
    });

    it('should correctly set url incompatible characters', function () {
      return storage.set('test;', 'value;').
        then(function () {
          return storage.get('test;');
        }).
        should.eventually.equal('value;');
    });

    it('should fail on wrong input (e.g. on circular objects)', function () {
      var circular = {};
      circular.circular = circular;

      return storage.set('circular', circular).should.be.rejected;
    });
  });

  describe('get', function () {
    var test = {a: 666};

    it('should get items', function () {
      return storage.set('test2', {a: 666}).
        then(function () {
          return storage.get('test2');
        }).
        should.become({a: 666});
    });

    it('should not return same objects', function () {
      return storage.set('test', test).
        then(function () {
          return storage.get('test');
        }).
        should.not.eventually.equal(test);
    });

    it('should return null when there is no item', function () {
      return storage.get('test').should.become(null);
    });
  });

  describe('remove', function () {
    it('should remove present items', function () {
      return storage.set('empty', {}).
        then(function () {
          return storage.remove('empty');
        }).
        then(function () {
          return storage.get('empty');
        }).
        should.become(null);
    });

    it('should be fulfilled when is correct', function () {
      return storage.set('empty', {}).
        then(function () {
          return storage.remove('empty');
        }).
        should.be.fulfilled;
    });

    it('should be fulfilled for missing elemnt', function () {
      return storage.remove('missing').should.be.fulfilled;
    });
  });

  describe('each', function () {
    it('should be fulfilled', function () {
      return storage.set('test1', '').
        then(function () {
          return storage.each(noop);
        }).
        should.be.fulfilled;
    });

    it('should iterate over items', function () {
      var iterator = sinon.stub();
      return storage.set('test', 'value').
        then(function () {
          return storage.each(iterator);
        }).
        then(function () {
          iterator.should.have.been.calledWith('test', 'value');
        });
    });

    it('should not iterate without items', function () {
      var iterator = sinon.stub();
      return storage.each(iterator).
        then(function () {
          iterator.should.not.been.called;
        });
    });

    it('should iterate over all items', function () {
      var iterator = sinon.stub();
      return storage.set('test1', '').
        then(function () {
          return storage.set('test2', '');
        }).
        then(function () {
          return storage.set('test3', '');
        }).
        then(function () {
          return storage.each(iterator);
        }).
        then(function () {
          iterator.should.have.been.calledThrice;
        });
    });

    it('should fail on wrong callback', function () {
      return storage.set('test', '').
        then(function () {
          return storage.each();
        }).
        should.be.rejected;
    });
  });
}

function testStorageEvents(storage) {
  describe('events', function () {
    var stop;

    afterEach(function () {
      stop();
    });

    it('on after set should be fired', function () {
      var testEvent = 'testKey';

      var change = when.promise(function (resolve) {
        stop = storage.on(testEvent, resolve);
      });

      storage.set(testEvent, 'testValue');

      return change.should.be.fulfilled;
    });

    it('on after set should be fired with correct value', function () {
      var testEvent = 'testKey2';
      var testValue = 'testValue';

      var change = when.promise(function (resolve) {
        stop = storage.on(testEvent, resolve);
      });

      storage.set(testEvent, testValue);

      return change.should.become(testValue);
    });

    it('on after remove should be fired with null', function () {
      var testEvent = 'testKey3';
      var testValue = 'testValue';

      var change = storage.set(testEvent, testValue).then(function () {
        return when.promise(function (resolve) {
          stop = storage.on(testEvent, resolve);

          storage.remove(testEvent);
        });
      });

      return change.should.become(null);
    });

    it('on after set with other key shouldn\'t be fired', function () {
      var change = when.promise(function (resolve) {
        stop = storage.on('testKey4', resolve);
      });
      storage.set('testWrong', 'testValue');

      return change.timeout(300).should.be.rejected;
    });

    it('stop should stop', function () {
      var testEvent = 'testKey5';

      var change = when.promise(function (resolve) {
        stop = storage.on(testEvent, resolve);
        stop();
      });

      storage.set(testEvent, 'testValue');

      return change.timeout(300).should.be.rejected;
    });
  });
}

describe('Storage', function () {
  describe('Local', function () {
    beforeEach(function () {
      localStorage.clear();
    });

    var Storage = require('./storage__local');
    var MockedStorage = require('imports?window=mocked-storage!./storage__local');
    var storage = new Storage();

    testStorage(storage);
    testStorageEvents(new MockedStorage());

    describe('specific', function () {
      beforeEach(function () {
        localStorage.setItem('invalid-json', 'invalid-json');
      });

      it('shouldn\'t break on non-parseable values', function () {
        return storage.each(noop).should.be.fulfilled;
      });

      it('should iterate over items with non-parseable values', function () {
        var iterator = sinon.stub();
        return storage.set('test', 'value').
          then(function () {
            return storage.each(iterator);
          }).
          then(function () {
            iterator.should.have.been.calledWith('invalid-json', 'invalid-json');
          });
      });
    });
  });


  describe('Fallback', function () {
    var cookieName = 'testCookie';

    beforeEach(function () {
      document.cookie = cookieName + '=;';
    });

    var FallbackStorage = require('./storage__fallback');
    var storage = new FallbackStorage({
      cookieName: cookieName,
      checkDelay: 200
    });

    testStorage(storage);
    testStorageEvents(storage);
  });

  describe('Memory', function () {
    var spaceName = 'testSpace';

    var MemoryStorage = require('./storage__memory');

    beforeEach(function () {
      var storage = MemoryStorage._storage[spaceName];
      for (var key in storage) {
        if (storage.hasOwnProperty(key)) {
          delete storage[key];
        }
      }
    });

    testStorage(new MemoryStorage({spaceName: spaceName}));
  });
});
