/* eslint-disable func-names, import/no-duplicates */
import Storage from './storage__local';
import FallbackStorage from './storage__fallback';

import MockedStorage from 'imports-loader?window=storage-mock!./storage__local';

function noop() {}

function testStorage(storage) {
  describe('set', () => {
    it('should be fulfilled', () => storage.set('empty', {}).should.be.fulfilled);

    it('should correctly set url incompatible characters', async () => {
      await storage.set('test;', 'value;');
      const value = await storage.get('test;');
      value.should.equal('value;');
    });

    it('should fail on wrong input (e.g. on circular objects)', () => {
      const circular = {};
      circular.circular = circular;

      return storage.set('circular', circular).should.be.rejected;
    });
  });

  describe('get', () => {
    const test = {a: 666};

    it('should get items', async () => {
      await storage.set('test2', test);
      const value = await storage.get('test2');
      value.should.deep.equal(test);
    });

    it('should not return same objects', async () => {
      await storage.set('test', test);
      const value = await storage.get('test');
      value.should.not.equal(test);
    });

    it('should return null when there is no item', () => storage.get('test').should.become(null));
  });

  describe('remove', () => {
    it('should remove present items', async () => {
      await storage.set('empty', {});
      await storage.remove('empty');
      storage.get('empty').should.become(null);
    });

    it('should be fulfilled when is correct', async () => {
      await storage.set('empty', {});
      storage.remove('empty').
        should.be.fulfilled;
    });

    it('should be fulfilled for missing element', () => storage.remove('missing').should.be.fulfilled);
  });

  describe('each', () => {
    it('should be fulfilled', async () => {
      await storage.set('test1', '');
      storage.each(noop).
        should.be.fulfilled;
    });

    it('should iterate over items', async () => {
      const iterator = sinon.stub();
      await storage.set('test', 'value');
      await storage.each(iterator);
      iterator.should.have.been.calledWith('test', 'value');
    });

    it('should not iterate without items', async () => {
      const iterator = sinon.stub();
      await storage.each(iterator);
      iterator.should.not.been.called;
    });

    it('should iterate over all items', async () => {
      const iterator = sinon.stub();
      await storage.set('test1', '');
      await storage.set('test2', '');
      await storage.set('test3', '');
      await storage.each(iterator);
      iterator.should.have.been.calledThrice;
    });

    it('should fail on wrong callback', async () => {
      await storage.set('test', '');
      storage.each().should.be.rejected;
    });
  });
}

function testStorageEvents(storage) {
  describe('events', () => {
    let stop;

    afterEach(() => {
      stop();
    });

    it('on after set should be fired', () => {
      const testEvent = 'testKey';

      const change = new Promise(resolve => {
        stop = storage.on(testEvent, resolve);
      });

      storage.set(testEvent, 'testValue');

      return change.should.be.fulfilled;
    });

    it('on after set should be fired with correct value', () => {
      const testEvent = 'testKey2';
      const testValue = 'testValue';

      const change = new Promise(resolve => {
        stop = storage.on(testEvent, resolve);
      });

      storage.set(testEvent, testValue);

      return change.should.become(testValue);
    });

    it('on after remove should be fired with null', async () => {
      const testEvent = 'testKey3';
      const testValue = 'test2Value';

      // Set test value and wait for it
      storage.set(testEvent, testValue);

      const disposer = await new Promise(resolve => {
        const stopSetListening = storage.on(testEvent, () => {
          resolve(stopSetListening);
        });
      });
      disposer();

      // Set up listening for test target change
      const change = new Promise(resolve => {
        stop = storage.on(testEvent, resolve);
      });

      // Trigger target remove action
      storage.remove(testEvent);

      change.should.become(null);
    });

    it('on after set with other key shouldn\'t be fired', function (done) {
      const spy = this.sinon.stub();

      stop = storage.on('testKey4', spy);
      storage.set('testWrong', 'testValue');

      setTimeout(() => {
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

      setTimeout(() => {
        spy.should.not.have.been.called;
        done();
      }, 0);
    });
  });
}

describe('Storage', () => {
  describe('Local', () => {
    beforeEach(() => {
      localStorage.clear();
      sessionStorage.clear();
    });

    const storage = new Storage();
    const storageSession = new Storage({
      type: 'session'
    });

    describe('Long-term', () => {
      testStorage(storage);
    });
    describe('Session', () => {
      testStorage(storageSession);
    });
    testStorageEvents(new MockedStorage());

    describe('specific', () => {
      beforeEach(() => {
        localStorage.setItem('invalid-json', 'invalid-json');
      });

      it('should get non-parseable values', () => storage.get('invalid-json').should.be.become('invalid-json'));

      it('shouldn\'t break iteration on non-parseable values', () => storage.each(noop).should.be.fulfilled);

      it('should iterate over items with non-parseable values', async () => {
        const iterator = sinon.stub();
        await storage.set('test', 'value');
        await storage.each(iterator);
        iterator.should.have.been.calledWith('invalid-json', 'invalid-json');
      });
    });
  });

  describe('Fallback', () => {
    const cookieName = 'testCookie';

    beforeEach(() => {
      document.cookie = `${cookieName}=;`;
    });

    const storage = new FallbackStorage({
      cookieName,
      checkDelay: 200
    });

    const storageSession = new FallbackStorage({
      cookieName,
      checkDelay: 200,
      type: 'session'
    });
    describe('Long-term', () => {
      testStorage(storage);
    });
    describe('Session', () => {
      testStorage(storageSession);
    });
    testStorageEvents(storage);
  });
});
