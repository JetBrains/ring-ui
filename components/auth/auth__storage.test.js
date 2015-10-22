/* eslint-disable google-camelcase/google-camelcase */
import Sniffr from 'sniffr';
const sniffr = new Sniffr();
sniffr.sniff();


describe('Auth', function () {
  describe('AuthStorage', function () {
    var Auth = require('./auth');
    var AuthStorage = require('./auth__storage');
    var authStorage = new AuthStorage({
      stateKeyPrefix: 'state',
      tokenKey: 'token'
    });
    var stateId = 'unique';

    afterEach(function () {
      localStorage.clear();
    });

    describe('saveState', function () {
      it('should be fulfilled', function () {
        return authStorage.saveState(stateId, {
          restoreLocation: 'http://localhost:8080/hub#hash',
          scopes: ['0-0-0-0-0']
        }).should.be.fulfilled;
      });
    });

    describe('getState', function () {
      var state = {
        restoreLocation: 'http://localhost:8080/hub#hash',
        scopes: ['0-0-0-0-0']
      };
      it('should be get as it was saved', function () {
        return authStorage.saveState(stateId, state).
          then(function () {
            return authStorage.getState(stateId);
          }).should.become(state);
      });

      it('should be null if wasn\'t set', function () {
        return authStorage.getState(stateId).should.become.null;
      });

      it('should be null after first get', function () {
        return authStorage.saveState(stateId, state).
          then(function () {
            return authStorage.getState(stateId);
          }).
          then(function () {
            return authStorage.getState(stateId);
          }).should.eventually.be.null;
      });
    });

    describe('cleanStates', function () {
      var state = {
        restoreLocation: 'http://localhost:8080/hub#hash',
        scopes: ['0-0-0-0-0']
      };

      it('should clean state by id', function () {
        return authStorage.saveState(stateId, {
          restoreLocation: 'http://localhost:8080/hub#hash',
          scopes: ['0-0-0-0-0']
        }).then(function () {
          return authStorage.saveState('unique2', {
            restoreLocation: 'http://localhost:8080/hub#hash',
            scopes: ['0-0-0-0-0', 'youtrack']
          }).then(function () {
            return authStorage.cleanStates(stateId).then(function () {
              return localStorage;
            });
          });
        }).should.eventually.have.keys(['stateunique2']);
      });

      it('should clean state by quota', function () {
        // Looks like weird race condition in Fx
        if (sniffr.browser.name === 'firefox') {
          this.skip();
        }

        var limitedAuthStorage = new AuthStorage({
          stateKeyPrefix: 'state',
          tokenKey: 'token',
          stateQuota: 200
        });

        return limitedAuthStorage.saveState(stateId, state).then(function () {
          return limitedAuthStorage.saveState('unique2', {
            restoreLocation: 'http://localhost:8080/hub#hash',
            scopes: ['0-0-0-0-0', 'youtrack']
          }).then(function () {
            return limitedAuthStorage.cleanStates().then(function () {
              return localStorage;
            });
          });
        }).should.eventually.have.keys(['stateunique2']);
      });

      it('should clean state by TTL', function () {
        var limitedAuthStorage = new AuthStorage({
          stateKeyPrefix: 'state',
          tokenKey: 'token',
          stateTTL: 10
        });

        return limitedAuthStorage.saveState(stateId, state).
          then(() => new Promise(resolve => setTimeout(resolve, 70))).
          then(function () {
            return limitedAuthStorage.cleanStates().then(function () {
              return localStorage;
            });
          }).should.eventually.be.empty;
      });
    });

    var token = {
      access_token: 'silver-bullet',
      scopes: ['0-0-0-0-0'],
      expires: Auth._epoch() + 40 * 60
    };

    describe('saveToken', function () {
      it('should be fulfilled', function () {
        return authStorage.saveToken(token).should.be.fulfilled;
      });
    });

    describe('getToken', function () {
      it('should be get as it was saved', function () {
        return authStorage.saveToken(token).
          then(function () {
            return authStorage.getToken();
          }).should.become(token);
      });

      it('should be null if wasn\'t saved', function () {
        return authStorage.getToken().should.become.null;
      });

      it('should be the same after several get', function () {
        return authStorage.saveToken(token).
          then(function () {
            return authStorage.getToken();
          }).
          then(function () {
            return authStorage.getToken();
          }).should.become(token);
      });

      it('should be null after wipe', function () {
        return authStorage.saveToken(token).
          then(function () {
            return authStorage.wipeToken();
          }).
          then(function () {
            return authStorage.getToken();
          }).should.become.null;
      });
    });

    describe('events', function () {
      var MockedStorage = require('imports?window=mocked-storage!../storage/storage__local');
      var mockedAuthStorage;

      beforeEach(function () {
        mockedAuthStorage = new AuthStorage({
          stateKeyPrefix: 'state',
          tokenKey: 'loltoken',
          storage: MockedStorage
        });
      });

      it('onTokenChange should have been triggered', function (done) {
        var spy = this.sinon.spy();
        mockedAuthStorage.onTokenChange(spy);
        mockedAuthStorage.saveToken(token);

        setTimeout(function () {
          spy.should.have.been.calledOnce;
          done();
        }, 0);
      });

      it('onStateChange should have been triggered', function (done) {
        var spy = this.sinon.spy();
        mockedAuthStorage.onStateChange(stateId, spy);
        mockedAuthStorage.saveState(stateId, {});

        setTimeout(function () {
          spy.should.have.been.calledOnce;
          done();
        }, 0);
      });
    });
  });
});
