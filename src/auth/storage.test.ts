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
      tokenKey: 'token'
    });
    const stateId = 'unique';

    afterEach(() => {
      localStorage.clear();
    });

    describe('saveState', () => {
      it('should be fulfilled', () => authStorage.saveState(stateId, {
        restoreLocation: 'http://localhost:8080/hub#hash',
        scopes: ['0-0-0-0-0']
      }).should.be.fulfilled);
    });

    describe('getState', () => {
      const state = {
        restoreLocation: 'http://localhost:8080/hub#hash',
        scopes: ['0-0-0-0-0']
      };
      it('should be get as it was saved', async () => {
        await authStorage.saveState(stateId, state);
        const newState = await authStorage.getState(stateId);
        should.exist(newState);
        newState?.should.deep.equal(state);
      });

      it('should be null if wasn\'t set', () => {
        authStorage.getState(stateId).should.eventually.be.null;
      });

      it('should be null after first get', async () => {
        await authStorage.saveState(stateId, state);
        await authStorage.getState(stateId);
        authStorage.getState(stateId).should.eventually.be.null;
      });
    });

    describe('cleanStates', () => {
      const state = {
        restoreLocation: 'http://localhost:8080/hub#hash',
        scopes: ['0-0-0-0-0']
      };

      it('should clean state by id', async () => {
        await authStorage.saveState(stateId, {
          restoreLocation: 'http://localhost:8080/hub#hash',
          scopes: ['0-0-0-0-0']
        });
        await authStorage.saveState('unique2', {
          restoreLocation: 'http://localhost:8080/hub#hash',
          scopes: ['0-0-0-0-0', 'youtrack']
        });
        await authStorage.cleanStates(stateId);
        localStorage.should.have.keys(['stateunique2']);
      });

      it('should clean state by quota', async () => {

        const limitedAuthStorage = new AuthStorage({
          stateKeyPrefix: 'state',
          tokenKey: 'token',
          stateQuota: 200
        });

        await limitedAuthStorage.saveState(stateId, state);
        await limitedAuthStorage.saveState('unique2', {
          restoreLocation: 'http://localhost:8080/hub#hash',
          scopes: ['0-0-0-0-0', 'youtrack']
        });
        await limitedAuthStorage.cleanStates();
        localStorage.should.have.keys(['stateunique2']);
      });

      it('should clean state by TTL', async () => {
        sandbox.useFakeTimers({toFake: ['Date']});

        const limitedAuthStorage = new AuthStorage({
          stateKeyPrefix: 'state',
          tokenKey: 'token',
          stateTTL: 10
        });

        await limitedAuthStorage.saveState(stateId, state);
        sandbox.clock.tick(TICK);
        await limitedAuthStorage.cleanStates();
        sandbox.clock.tick(TICK);
        localStorage.should.be.empty;
      });
    });

    const token = {
      accessToken: 'silver-bullet',
      scopes: ['0-0-0-0-0'],
      // eslint-disable-next-line @typescript-eslint/no-magic-numbers
      expires: TokenValidator._epoch() + 40 * 60
    };

    describe('saveToken', () => {
      it('should be fulfilled', () => authStorage.saveToken(token).should.be.fulfilled);
    });

    describe('getToken', () => {
      it('should be get as it was saved', async () => {
        await authStorage.saveToken(token);
        authStorage.getToken().should.become(token);
      });

      it('should be null if wasn\'t saved', () => authStorage.getToken().should.eventually.be.null);

      it('should be the same after several get', async () => {
        await authStorage.saveToken(token);
        await authStorage.getToken();
        authStorage.getToken().should.become(token);
      });

      it('should be null after wipe', async () => {
        await authStorage.saveToken(token);
        await authStorage.wipeToken();
        authStorage.getToken().should.eventually.be.null;
      });
    });

    describe('events', () => {
      let mockedAuthStorage: AuthStorage;

      beforeEach(() => {
        sandbox.stub(window, 'addEventListener').
          value((...args: unknown[]) => mockedWindow.addEventListener(...args));
        sandbox.stub(window, 'removeEventListener').
          value((...args: unknown[]) => mockedWindow.removeEventListener(...args));
        sandbox.stub(window, 'localStorage').value(mockedWindow.localStorage);
        sandbox.stub(window, 'sessionStorage').value(mockedWindow.sessionStorage);
        localStorage.clear();
        sessionStorage.clear();

        mockedAuthStorage = new AuthStorage({
          stateKeyPrefix: 'state',
          tokenKey: 'loltoken',
          storage: LocalStorage
        });
      });

      it('onTokenChange should have been triggered', () => {
        const clock = sandbox.useFakeTimers({toFake: ['setTimeout']});
        const spy = sandbox.spy();
        mockedAuthStorage.onTokenChange(spy);
        mockedAuthStorage.saveToken(token);

        clock.tick(1);
        spy.should.have.been.calledOnce;
      });

      it('onStateChange should have been triggered', () => {
        const clock = sandbox.useFakeTimers({toFake: ['setTimeout']});
        const spy = sandbox.spy();
        mockedAuthStorage.onStateChange(stateId, spy);
        mockedAuthStorage.saveState(stateId, {});

        clock.tick(1);
        spy.should.have.been.calledOnce;
      });

      it('onMessage should have been triggered', () => {
        const clock = sandbox.useFakeTimers({toFake: ['setTimeout']});
        const spy = sandbox.spy();
        mockedAuthStorage.onMessage(stateId, spy);
        mockedAuthStorage.sendMessage(stateId, 'message');


        clock.tick(1);
        spy.should.have.been.calledOnce;
        spy.should.have.been.calledWith('message');
      });
    });
  });
});
