function noop() {}

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
      const circular = {};
      circular.circular = circular;

      return storage.set('circular', circular).should.be.rejected;
    });
  });

  describe('get', function () {
    const test = {a: 666};

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
      const iterator = sinon.stub();
      return storage.set('test', 'value').
        then(function () {
          return storage.each(iterator);
        }).
        then(function () {
          iterator.should.have.been.calledWith('test', 'value');
        });
    });

    it('should not iterate without items', function () {
      const iterator = sinon.stub();
      return storage.each(iterator).
        then(function () {
          iterator.should.not.been.called;
        });
    });

    it('should iterate over all items', function () {
      const iterator = sinon.stub();
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
    let stop;

    afterEach(() => {
      stop();
    });

    it('on after set should be fired', function () {
      const testEvent = 'testKey';

      const change = new Promise(function (resolve) {
        stop = storage.on(testEvent, resolve);
      });

      storage.set(testEvent, 'testValue');

      return change.should.be.fulfilled;
    });

    it('on after set should be fired with correct value', function () {
      const testEvent = 'testKey2';
      const testValue = 'testValue';

      const change = new Promise(function (resolve) {
        stop = storage.on(testEvent, resolve);
      });

      storage.set(testEvent, testValue);

      return change.should.become(testValue);
    });

    it('on after remove should be fired with null', function () {
      const testEvent = 'testKey3';
      const testValue = 'test2Value';

      // Set test value and wait for it
      storage.set(testEvent, testValue);

      return new Promise(function (resolve) {
        const stopSetListening = storage.on(testEvent, function () {
          resolve(stopSetListening);
        });
      }).then(function (stopSetListening) {
        stopSetListening();

        // Set up listening for test target change
        const change = new Promise(function (resolve) {
          stop = storage.on(testEvent, resolve);
        });

        // Trigger target remove action
        storage.remove(testEvent);

        return change;
      }).should.become(null);
    });

    it('on after set with other key shouldn\'t be fired', function (done) {
      const spy = this.sinon.stub();

      stop = storage.on('testKey4', spy);
      storage.set('testWrong', 'testValue');

      setTimeout(function () {
        spy.should.not.have.been.called;
        done();
      }, 0);
    });

    it('stop should stop', function (done) {
      const spy = this.sinon.spy();

      const testEvent = 'testKey5';
      stop = storage.on(testEvent, spy);
      stop();
      storage.set(testEvent, 'testValue');

      setTimeout(function () {
        spy.should.not.have.been.called;
        done();
      }, 0);
    });
  });
}

describe('Storage', function () {
  describe('Local', function () {
    beforeEach(function () {
      localStorage.clear();
      sessionStorage.clear();
    });

    const Storage = require('./storage__local');
    const MockedStorage = require('imports?window=mocked-storage!./storage__local');
    const storage = new Storage();
    const storageSession = new Storage({
      type: 'session'
    });

    testStorage(storage);
    testStorage(storageSession);
    testStorageEvents(new MockedStorage());

    describe('specific', function () {
      beforeEach(function () {
        localStorage.setItem('invalid-json', 'invalid-json');
      });

      it('should get non-parseable values', function () {
        return storage.get('invalid-json').should.be.become('invalid-json');
      });

      it('shouldn\'t break iteration on non-parseable values', function () {
        return storage.each(noop).should.be.fulfilled;
      });

      it('should iterate over items with non-parseable values', function () {
        const iterator = sinon.stub();
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
    const cookieName = 'testCookie';

    beforeEach(function () {
      document.cookie = cookieName + '=;';
    });

    const FallbackStorage = require('./storage__fallback');

    const storage = new FallbackStorage({
      cookieName: cookieName,
      checkDelay: 200
    });

    const storageSession = new FallbackStorage({
      cookieName: cookieName,
      checkDelay: 200,
      type: 'session'
    });

    testStorage(storage);
    testStorage(storageSession);
    testStorageEvents(storage);
  });

  describe('Memory', function () {
    const spaceName = 'testSpace';
    const MemoryStorage = require('./storage__memory');

    beforeEach(function () {
      const storage = MemoryStorage._storage[spaceName];
      for (const key in storage) {
        if (storage.hasOwnProperty(key)) {
          Reflect.deleteProperty(storage, key);
        }
      }
    });

    testStorage(new MemoryStorage({spaceName: spaceName}));
  });
});
