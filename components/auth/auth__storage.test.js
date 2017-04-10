/* eslint-disable func-names */
/* eslint-disable camelcase */

import Auth from './auth';
import AuthStorage from './auth__storage';
import sniffer from '../global/sniffer';

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
        newState.should.deep.equal(state);
      });

      it('should be null if wasn\'t set', () => authStorage.getState(stateId).should.become.null);

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
        // Looks like weird race condition in Fx
        if (sniffer.browser.name === 'firefox') {
          return;
        }

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

      it('should clean state by TTL', async function () {
        this.sinon.useFakeTimers();

        const limitedAuthStorage = new AuthStorage({
          stateKeyPrefix: 'state',
          tokenKey: 'token',
          stateTTL: 10
        });

        await limitedAuthStorage.saveState(stateId, state);
        this.sinon.clock.tick(100);
        await limitedAuthStorage.cleanStates();
        this.sinon.clock.tick(100);
        localStorage.should.be.empty;
      });
    });

    const token = {
      access_token: 'silver-bullet',
      scopes: ['0-0-0-0-0'],
      expires: Auth._epoch() + 40 * 60
    };

    describe('saveToken', () => {
      it('should be fulfilled', () => authStorage.saveToken(token).should.be.fulfilled);
    });

    describe('getToken', () => {
      it('should be get as it was saved', async () => {
        await authStorage.saveToken(token);
        authStorage.getToken().should.become(token);
      });

      it('should be null if wasn\'t saved', () => authStorage.getToken().should.become.null);

      it('should be the same after several get', async () => {
        await authStorage.saveToken(token);
        await authStorage.getToken();
        authStorage.getToken().should.become(token);
      });

      it('should be null after wipe', async () => {
        await authStorage.saveToken(token);
        await authStorage.wipeToken();
        authStorage.getToken().should.become.null;
      });
    });

    describe('events', () => {
      const MockedStorage = require('imports-loader?window=mocked-storage!../storage/storage__local');
      let mockedAuthStorage;

      beforeEach(() => {
        mockedAuthStorage = new AuthStorage({
          stateKeyPrefix: 'state',
          tokenKey: 'loltoken',
          storage: MockedStorage
        });
      });

      it('onTokenChange should have been triggered', function (done) {
        const spy = this.sinon.spy();
        mockedAuthStorage.onTokenChange(spy);
        mockedAuthStorage.saveToken(token);

        setTimeout(() => {
          spy.should.have.been.calledOnce;
          done();
        }, 0);
      });

      it('onStateChange should have been triggered', function (done) {
        const spy = this.sinon.spy();
        mockedAuthStorage.onStateChange(stateId, spy);
        mockedAuthStorage.saveState(stateId, {});

        setTimeout(() => {
          spy.should.have.been.calledOnce;
          done();
        }, 0);
      });
    });
  });
});
