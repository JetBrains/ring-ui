// @ts-expect-error no typings available
import mockedWindow from 'storage-mock';

import LocalStorage from '../storage/storage__local';

import AuthStorage from './storage';
import TokenValidator from './token-validator';

const TICK = 100;

describe('Auth', () => {
  describe('AuthStorage', () => {
    const authStorage = new AuthStorage({
      stateKeyPrefix: 'state',
      tokenKey: 'token',
    });
    const stateId = 'unique';

    afterEach(() => {
      localStorage.clear();
    });

    describe('saveState', () => {
      it('should be fulfilled', () =>
        expect(
          authStorage.saveState(stateId, {
            restoreLocation: 'http://localhost:8080/hub#hash',
            scopes: ['0-0-0-0-0'],
          }),
        ).to.be.fulfilled);
    });

    describe('getState', () => {
      const state = {
        restoreLocation: 'http://localhost:8080/hub#hash',
        scopes: ['0-0-0-0-0'],
      };
      it('should be get as it was saved', async () => {
        await authStorage.saveState(stateId, state);
        const newState = await authStorage.getState(stateId);
        expect(newState).to.exist;
        expect(newState).to.deep.equal(state);
      });

      it("should be null if wasn't set", () => {
        expect(authStorage.getState(stateId)).to.eventually.be.null;
      });

      it('should be null after first get', async () => {
        await authStorage.saveState(stateId, state);
        await authStorage.getState(stateId);
        expect(authStorage.getState(stateId)).to.eventually.be.null;
      });
    });

    describe('cleanStates', () => {
      const state = {
        restoreLocation: 'http://localhost:8080/hub#hash',
        scopes: ['0-0-0-0-0'],
      };

      it('should clean state by id', async () => {
        await authStorage.saveState(stateId, {
          restoreLocation: 'http://localhost:8080/hub#hash',
          scopes: ['0-0-0-0-0'],
        });
        await authStorage.saveState('unique2', {
          restoreLocation: 'http://localhost:8080/hub#hash',
          scopes: ['0-0-0-0-0', 'youtrack'],
        });
        await authStorage.cleanStates(stateId);
        expect(localStorage).to.have.keys(['stateunique2']);
      });

      it('should clean state by quota', async () => {
        const limitedAuthStorage = new AuthStorage({
          stateKeyPrefix: 'state',
          tokenKey: 'token',
          stateQuota: 200,
        });

        await limitedAuthStorage.saveState(stateId, state);
        await limitedAuthStorage.saveState('unique2', {
          restoreLocation: 'http://localhost:8080/hub#hash',
          scopes: ['0-0-0-0-0', 'youtrack'],
        });
        await limitedAuthStorage.cleanStates();
        expect(localStorage).to.have.keys(['stateunique2']);
      });

      it('should clean state by TTL', async () => {
        vi.useFakeTimers({toFake: ['Date']});

        const limitedAuthStorage = new AuthStorage({
          stateKeyPrefix: 'state',
          tokenKey: 'token',
          stateTTL: 10,
        });

        await limitedAuthStorage.saveState(stateId, state);
        vi.advanceTimersByTime(TICK);
        await limitedAuthStorage.cleanStates();
        vi.advanceTimersByTime(TICK);
        expect(localStorage).to.be.empty;
      });
    });

    const token = {
      accessToken: 'silver-bullet',
      scopes: ['0-0-0-0-0'],
      // eslint-disable-next-line @typescript-eslint/no-magic-numbers
      expires: TokenValidator._epoch() + 40 * 60,
    };

    describe('saveToken', () => {
      it('should be fulfilled', () => expect(authStorage.saveToken(token)).to.be.fulfilled);
    });

    describe('getToken', () => {
      it('should be get as it was saved', async () => {
        await authStorage.saveToken(token);
        expect(authStorage.getToken()).to.become(token);
      });

      it("should be null if wasn't saved", () => expect(authStorage.getToken()).to.eventually.be.null);

      it('should be the same after several get', async () => {
        await authStorage.saveToken(token);
        await authStorage.getToken();
        expect(authStorage.getToken()).to.become(token);
      });

      it('should be null after wipe', async () => {
        await authStorage.saveToken(token);
        await authStorage.wipeToken();
        expect(authStorage.getToken()).to.eventually.be.null;
      });
    });

    describe('events', () => {
      let mockedAuthStorage: AuthStorage;

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

        mockedAuthStorage = new AuthStorage({
          stateKeyPrefix: 'state',
          tokenKey: 'loltoken',
          storage: LocalStorage,
        });
      });

      it('onTokenChange should have been triggered', () => {
        vi.useFakeTimers({toFake: ['setTimeout']});
        const spy = vi.fn();
        mockedAuthStorage.onTokenChange(spy);
        mockedAuthStorage.saveToken(token);

        vi.advanceTimersByTime(1);
        expect(spy).toHaveBeenCalledOnce;
      });

      it('onStateChange should have been triggered', () => {
        vi.useFakeTimers({toFake: ['setTimeout']});
        const spy = vi.fn();
        mockedAuthStorage.onStateChange(stateId, spy);
        mockedAuthStorage.saveState(stateId, {});

        vi.advanceTimersByTime(1);
        expect(spy).toHaveBeenCalledOnce;
      });

      it('onMessage should have been triggered', () => {
        vi.useFakeTimers({toFake: ['setTimeout']});
        const spy = vi.fn();
        mockedAuthStorage.onMessage(stateId, spy);
        mockedAuthStorage.sendMessage(stateId, 'message');

        vi.advanceTimersByTime(1);
        expect(spy).toHaveBeenCalledOnce;
        expect(spy).toHaveBeenCalledWith('message');
      });
    });
  });
});
