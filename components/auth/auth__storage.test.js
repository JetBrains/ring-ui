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
      it('should be get as it was saved', () => authStorage.saveState(stateId, state).
        then(() => authStorage.getState(stateId)).should.become(state));

      it('should be null if wasn\'t set', () => authStorage.getState(stateId).should.become.null);

      it('should be null after first get', () => authStorage.saveState(stateId, state).
        then(() => authStorage.getState(stateId)).
        then(() => authStorage.getState(stateId)).should.eventually.be.null);
    });

    describe('cleanStates', () => {
      const state = {
        restoreLocation: 'http://localhost:8080/hub#hash',
        scopes: ['0-0-0-0-0']
      };

      it('should clean state by id', () => authStorage.saveState(stateId, {
        restoreLocation: 'http://localhost:8080/hub#hash',
        scopes: ['0-0-0-0-0']
      }).then(() => authStorage.saveState('unique2', {
        restoreLocation: 'http://localhost:8080/hub#hash',
        scopes: ['0-0-0-0-0', 'youtrack']
      }).then(() => authStorage.cleanStates(stateId).then(() => localStorage))).should.eventually.have.keys(['stateunique2']));

      it('should clean state by quota', () => {
        // Looks like weird race condition in Fx
        if (sniffer.browser.name === 'firefox') {
          return undefined;
        }

        const limitedAuthStorage = new AuthStorage({
          stateKeyPrefix: 'state',
          tokenKey: 'token',
          stateQuota: 200
        });

        return limitedAuthStorage.saveState(stateId, state).then(() => limitedAuthStorage.saveState('unique2', {
          restoreLocation: 'http://localhost:8080/hub#hash',
          scopes: ['0-0-0-0-0', 'youtrack']
        }).then(() => limitedAuthStorage.cleanStates().then(() => localStorage))).should.eventually.have.keys(['stateunique2']);
      });

      it('should clean state by TTL', function () {
        this.sinon.useFakeTimers();

        const limitedAuthStorage = new AuthStorage({
          stateKeyPrefix: 'state',
          tokenKey: 'token',
          stateTTL: 10
        });

        return limitedAuthStorage.
          saveState(stateId, state).
          then(() => new Promise(resolve => {
            setTimeout(() => {
              limitedAuthStorage.cleanStates().then(() => {
                resolve(localStorage);
              });
            }, 100);

            this.sinon.clock.tick(200);
          })
        ).
        should.eventually.be.empty;
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
      it('should be get as it was saved', () => authStorage.saveToken(token).
        then(() => authStorage.getToken()).should.become(token));

      it('should be null if wasn\'t saved', () => authStorage.getToken().should.become.null);

      it('should be the same after several get', () => authStorage.saveToken(token).
        then(() => authStorage.getToken()).
        then(() => authStorage.getToken()).should.become(token));

      it('should be null after wipe', () => authStorage.saveToken(token).
        then(() => authStorage.wipeToken()).
        then(() => authStorage.getToken()).should.become.null);
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
