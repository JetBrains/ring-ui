describe.only('AuthStorage', function () {
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
        restoreHash: 'hash',
        restoreLocation: 'http://localhost:8080/hub',
        scopes: ['0-0-0-0-0']
      }).should.be.fulfilled;
    });
  });

  describe('getState', function () {
    var state = {
      restoreHash: 'hash',
      restoreLocation: 'http://localhost:8080/hub',
      scopes: ['0-0-0-0-0']
    };
    it('should be get as it was saved', function () {
      return authStorage.saveState(stateId, state).
        then(function () {
          return authStorage.getState(stateId);
        }).should.be.eventually.deep.equal(state);
    });

    it('should be null if wasn\'t set', function () {
      return authStorage.getState(stateId).should.be.eventually.null;
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
        }).should.be.eventually.deep.equal(token);
    });

    it('should be null if wasn\'t saved', function () {
      return authStorage.getToken().should.be.eventually.null;
    });

    it('should be the same after several get', function () {
      return authStorage.saveToken(token).
        then(function () {
          return authStorage.getToken();
        }).
        then(function () {
          return authStorage.getToken();
        }).should.be.eventually.deep.equal(token);
    });

    it('should be null after wipe', function () {
      return authStorage.saveToken(token).
        then(function () {
          return authStorage.wipeToken();
        }).
        then(function () {
          return authStorage.getToken();
        }).should.be.eventually.null;
    });
  });
});