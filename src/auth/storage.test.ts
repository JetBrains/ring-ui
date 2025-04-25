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
        sandbox.useFakeTimers({toFake: ['Date']});

        const limitedAuthStorage = new AuthStorage({
          stateKeyPrefix: 'state',
          tokenKey: 'token',
          stateTTL: 10,
        });

        await limitedAuthStorage.saveState(stateId, state);
        sandbox.clock.tick(TICK);
        await limitedAuthStorage.cleanStates();
        sandbox.clock.tick(TICK);
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
        sandbox.stub(window, 'addEventListener').value((...args: unknown[]) => mockedWindow.addEventListener(...args));
        sandbox
          .stub(window, 'removeEventListener')
          .value((...args: unknown[]) => mockedWindow.removeEventListener(...args));
        sandbox.stub(window, 'localStorage').value(mockedWindow.localStorage);
        sandbox.stub(window, 'sessionStorage').value(mockedWindow.sessionStorage);
        localStorage.clear();
        sessionStorage.clear();

        mockedAuthStorage = new AuthStorage({
          stateKeyPrefix: 'state',
          tokenKey: 'loltoken',
          storage: LocalStorage,
        });
      });

      it('onTokenChange should have been triggered', () => {
        const clock = sandbox.useFakeTimers({toFake: ['setTimeout']});
        const spy = sandbox.spy();
        mockedAuthStorage.onTokenChange(spy);
        mockedAuthStorage.saveToken(token);

        clock.tick(1);
        expect(spy).to.have.been.calledOnce;
      });

      it('onStateChange should have been triggered', () => {
        const clock = sandbox.useFakeTimers({toFake: ['setTimeout']});
        const spy = sandbox.spy();
        mockedAuthStorage.onStateChange(stateId, spy);
        mockedAuthStorage.saveState(stateId, {});

        clock.tick(1);
        expect(spy).to.have.been.calledOnce;
      });

      it('onMessage should have been triggered', () => {
        const clock = sandbox.useFakeTimers({toFake: ['setTimeout']});
        const spy = sandbox.spy();
        mockedAuthStorage.onMessage(stateId, spy);
        mockedAuthStorage.sendMessage(stateId, 'message');

        clock.tick(1);
        expect(spy).to.have.been.calledOnce;
        expect(spy).to.have.been.calledWith('message');
      });
    });
  });
});
