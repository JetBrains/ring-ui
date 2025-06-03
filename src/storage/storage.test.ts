// @ts-expect-error no typings
import mockedWindow from 'storage-mock';

import {StorageInterface} from './storage';
import LocalStorage from './storage__local';

function noop() {}

type Circular = {
  circular?: Circular;
};

function testStorage(storage: StorageInterface) {
  describe('set', () => {
    it('should be fulfilled', () => expect(storage.set('empty', {})).to.be.fulfilled);

    it('should correctly set url incompatible characters', async () => {
      await storage.set('test;', 'value;');
      const value = await storage.get('test;');
      expect('value;').to.equal(value);
    });

    it('should fail on wrong input (e.g. on circular objects)', () => {
      const circular: Circular = {};
      circular.circular = circular;

      return expect(storage.set('circular', circular)).to.be.rejected;
    });
  });

  describe('get', () => {
    const test = {a: 666};

    it('should get items', async () => {
      await storage.set('test2', test);
      const value = await storage.get('test2');
      expect(test).to.deep.equal(value);
    });

    it('should not return same objects', async () => {
      await storage.set('test', test);
      const value = await storage.get('test');
      expect(test).to.not.equal(value);
    });

    it('should return null when there is no item', () => expect(storage.get('test')).to.become(null));
  });

  describe('remove', () => {
    it('should remove present items', async () => {
      await storage.set('empty', {});
      await storage.remove('empty');
      expect(storage.get('empty')).to.become(null);
    });

    it('should be fulfilled when is correct', async () => {
      await storage.set('empty', {});
      expect(storage.remove('empty')).to.be.fulfilled;
    });

    it('should be fulfilled for missing element', () => expect(storage.remove('missing')).to.be.fulfilled);
  });

  describe('each', () => {
    it('should be fulfilled', async () => {
      await storage.set('test1', '');
      expect(storage.each(noop)).to.be.fulfilled;
    });

    it('should iterate over items', async () => {
      const iterator = vi.fn();
      await storage.set('test', 'value');
      await storage.each(iterator);
      expect(iterator).toHaveBeenCalledWith('test', 'value');
    });

    it('should not iterate without items', async () => {
      const iterator = vi.fn();
      await storage.each(iterator);
      expect(iterator).not.toHaveBeenCalled;
    });

    it('should iterate over all items', async () => {
      const iterator = vi.fn();
      await storage.set('test1', '');
      await storage.set('test2', '');
      await storage.set('test3', '');
      await storage.each(iterator);
      // eslint-disable-next-line @typescript-eslint/no-magic-numbers
      expect(iterator).toHaveBeenCalledTimes(3);
    });

    it('should fail on wrong callback', async () => {
      await storage.set('test', '');
      // @ts-expect-error testing a wrong usage
      expect(storage.each()).to.be.rejected;
    });
  });
}

function testStorageEvents(storage: StorageInterface) {
  describe('events', () => {
    let stop: () => void;

    afterEach(() => {
      stop?.();
    });

    it('on after set should be fired', async () => {
      const testEvent = 'testKey';

      const change = new Promise<void>(resolve => {
        stop = storage.on(testEvent, () => {
          resolve();
        });
      });

      storage.set(testEvent, 'testValue');

      return await change;
    });

    it('on after set should be fired with correct value', () => {
      const testEvent = 'testKey2';
      const testValue = 'testValue';

      const change = new Promise(resolve => {
        stop = storage.on(testEvent, resolve);
      });

      storage.set(testEvent, testValue);

      return expect(change).to.become(testValue);
    });

    it('on after remove should be fired with null', async () => {
      const testEvent = 'testKey3';
      const testValue = 'test2Value';

      // Set test value and wait for it
      storage.set(testEvent, testValue);

      const disposer: () => void = await new Promise(resolve => {
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

      expect(change).to.become(null);
    });

    it("on after set with other key shouldn't be fired", () => {
      vi.useFakeTimers({toFake: ['setTimeout']});
      const spy = vi.fn();

      stop = storage.on('testKey4', spy);
      storage.set('testWrong', 'testValue');

      vi.advanceTimersByTime(1);
      expect(spy).not.toHaveBeenCalled;
    });

    it('stop should stop', () => {
      vi.useFakeTimers({toFake: ['setTimeout']});
      const spy = vi.fn();

      const testEvent = 'testKey5';
      stop = storage.on(testEvent, spy);
      stop();
      storage.set(testEvent, 'testValue');

      vi.advanceTimersByTime(1);
      expect(spy).not.toHaveBeenCalled;
    });
  });
}

describe('Storage', () => {
  describe('Local', () => {
    beforeEach(() => {
      vi.spyOn(window, 'addEventListener').mockImplementation((...args: unknown[]) =>
        mockedWindow.addEventListener(...args),
      );
      vi.spyOn(window, 'removeEventListener').mockImplementation((...args: unknown[]) =>
        mockedWindow.removeEventListener(...args),
      );
      vi.stubGlobal('localStorage', mockedWindow.localStorage);
      vi.stubGlobal('sessionStorage', mockedWindow.sessionStorage);
      localStorage.clear();
      sessionStorage.clear();
    });

    const storage = new LocalStorage();
    const storageSession = new LocalStorage({
      type: 'session',
    });

    describe('Long-term', () => {
      testStorage(storage);
    });
    describe('Session', () => {
      testStorage(storageSession);
    });
    testStorageEvents(new LocalStorage());

    describe('specific', () => {
      beforeEach(() => {
        localStorage.setItem('invalid-json', 'invalid-json');
      });

      it('should get non-parseable values', () => expect(storage.get('invalid-json')).to.be.become('invalid-json'));

      it("shouldn't break iteration on non-parseable values", () => expect(storage.each(noop)).to.be.fulfilled);

      it('should iterate over items with non-parseable values', async () => {
        const iterator = vi.fn();
        await storage.set('test', 'value');
        await storage.each(iterator);
        expect(iterator).toHaveBeenCalledWith('invalid-json', 'invalid-json');
      });
    });
  });
});
