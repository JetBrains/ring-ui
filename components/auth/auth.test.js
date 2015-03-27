/* eslint-disable google-camelcase/google-camelcase */
describe('Auth', function () {
  var Auth = require('./auth');
  var AuthRequestBuilder = require('./auth__request-builder');
  var AuthResponseParser = require('./auth__response-parser');
  var AuthStorage = require('./auth__storage');
  var when = require('when');

  describe('construction', function () {
    it('should require provide config', function () {
      expect(function () {
        return new Auth();
      }).to.throw(Error, 'Config is required');
    });

    it('should require provide server uri', function () {
      expect(function () {
        return new Auth({
          serverUri: null
        });
      }).to.throw(Error, 'Property serverUri is required');

      expect(function () {
        return new Auth({});
      }).to.throw(Error, 'Property serverUri is required');
    });

    it('should fix serverUri', function () {
      expect(new Auth({serverUri: ''}).config.serverUri).to.equal('');
      expect(new Auth({serverUri: 'http://localhost'}).config.serverUri).to.equal('http://localhost/');
      expect(new Auth({serverUri: '.'}).config.serverUri).to.equal('./');
    });

    it('should merge passed config with default config', function () {
      var config = {
        serverUri: 'http://localhost/'
      };
      var auth = new Auth(config);

      auth.config.serverUri.should.equal(config.serverUri);
      auth.config.should.contain.keys(Object.keys(Auth.DEFAULT_CONFIG));
    });

    it('should not redirect on object construction', function () {
      this.sinon.stub(Auth.prototype, '_redirectCurrentPage');
      /* eslint-disable no-new */
      new Auth({serverUri: ''});
      /* eslint-enable no-new */
      Auth.prototype._redirectCurrentPage.should.not.have.been.called;
    });
  });

  describe('getValidatedToken', function () {
    var auth = new Auth({
      serverUri: '',
      scopes: ['0-0-0-0-0', 'youtrack'],
      optionalScopes: ['youtrack']
    });

    beforeEach(function () {
      this.sinon.stub(AuthStorage.prototype, 'getToken');
    });

    it('should resolve access token when it is valid', function () {
      AuthStorage.prototype.getToken.returns(when.resolve({
        access_token: 'token',
        expires: Auth._epoch() + 60 * 60,
        scopes: ['0-0-0-0-0', 'youtrack']
      }));
      return auth._getValidatedToken([Auth._validateExistence, Auth._validateExpiration, auth._validateScopes.bind(auth)]).
        should.eventually.be.equal('token');
    });

    it('should resolve access token when token is given for all required scopes', function () {
      AuthStorage.prototype.getToken.returns(when.resolve({
        access_token: 'token',
        expires: Auth._epoch() + 60 * 60,
        scopes: ['0-0-0-0-0']
      }));
      return auth._getValidatedToken([Auth._validateExistence, Auth._validateExpiration, auth._validateScopes.bind(auth)]).
        should.eventually.be.equal('token');
    });

    it('should reject if access_token is empty', function () {
      AuthStorage.prototype.getToken.returns(when.resolve({
        access_token: null,
        expires: Auth._epoch() + 60 * 60,
        scopes: ['0-0-0-0-0']
      }));
      return auth._getValidatedToken([Auth._validateExistence, Auth._validateExpiration, auth._validateScopes.bind(auth)]).
        should.be.rejectedWith(Auth.TokenValidationError, 'Token not found');
    });

    it('should reject if there is no token stored', function () {
      AuthStorage.prototype.getToken.returns(when.resolve(null));
      return auth._getValidatedToken([Auth._validateExistence, Auth._validateExpiration, auth._validateScopes.bind(auth)]).
        should.be.rejectedWith(Auth.TokenValidationError, 'Token not found');
    });

    it('should reject if token is expired', function () {
      AuthStorage.prototype.getToken.returns(when.resolve({
        access_token: 'token',
        expires: Auth._epoch() + 15 * 60,
        scopes: ['0-0-0-0-0']
      }));
      return auth._getValidatedToken([Auth._validateExistence, Auth._validateExpiration, auth._validateScopes.bind(auth)]).
        should.be.rejectedWith(Auth.TokenValidationError, 'Token expired');
    });

    it('should reject if token scopes don\'t match required scopes', function () {
      AuthStorage.prototype.getToken.returns(when.resolve({
        access_token: 'token',
        expires: Auth._epoch() + 60 * 60,
        scopes: ['youtrack']
      }));
      return auth._getValidatedToken([Auth._validateExistence, Auth._validateExpiration, auth._validateScopes.bind(auth)]).
        should.be.rejectedWith(Auth.TokenValidationError, 'Token doesn\'t match required scopes');
    });
  });

  describe('validateAgainstUser', function () {
    var auth = new Auth({
      serverUri: 'http://server',
      redirect_uri: 'http://client',
      scopes: ['0-0-0-0-0', 'youtrack'],
      optionalScopes: ['youtrack']
    });

    var hasCors = Auth.HAS_CORS;

    beforeEach(function () {
      Auth.HAS_CORS = true;
      this.sinon.stub(Auth.prototype, 'getSecure');
    });

    afterEach(function () {
      Auth.HAS_CORS = hasCors;
    });

    it('should resolve to access token when user is returned', function () {
      var token = { access_token: 'token' };
      Auth.prototype.getSecure.returns(when.resolve({login: 'user'}));
      return auth._validateAgainstUser(token).
        then(function (validToken) {
          Auth.prototype.getSecure.should.have.been.calledWith(Auth.API_PROFILE_PATH, 'token');
          return validToken;
        }).
        should.eventually.be.deep.equal(token);
    });

    it('should not validate user when CORS is disabled', function () {
      var token = { access_token: 'token' };
      Auth.HAS_CORS = false;

      return auth._validateAgainstUser(token).
        then(function (validToken) {
          Auth.prototype.getSecure.should.not.have.been.called;
          return validToken;
        }).
        should.eventually.be.deep.equal(token);
    });


    it('should reject with redirect if 401 response recieved', function () {
      var token = { access_token: 'token' };
      Auth.prototype.getSecure.returns(when.reject({status: 401, responseJSON: {error: 'Problem'}}));
      return auth._validateAgainstUser(token).
        should.be.rejectedWith(Auth.TokenValidationError, 'Problem');
    });

    it('should reject with redirect if invalid_grant response recieved', function () {
      var token = { access_token: 'token' };
      Auth.prototype.getSecure.returns(when.reject({responseJSON: {error: 'invalid_grant'}}));
      return auth._validateAgainstUser(token).
        should.be.rejectedWith(Auth.TokenValidationError, 'invalid_grant');
    });

    it('should reject with redirect if invalid_grant response recieved', function () {
      var token = { access_token: 'token' };
      Auth.prototype.getSecure.returns(when.reject({responseJSON: {error: 'invalid_request'}}));
      return auth._validateAgainstUser(token).
        should.be.rejectedWith(Auth.TokenValidationError, 'invalid_request');
    });
  });

  describe('init', function () {
    var auth = new Auth({
      serverUri: '',
      redirect: true,
      redirect_uri: 'http://localhost:8080/hub',
      client_id: '1-1-1-1-1',
      scope: ['0-0-0-0-0', 'youtrack'],
      optionalScopes: ['youtrack']
    });

    beforeEach(function () {
      this.sinon.stub(Auth.prototype, 'getSecure').returns(when({login: 'user'}));
      this.sinon.stub(Auth.prototype, 'setHash');
    });

    afterEach(function () {
      return when.join(auth._storage.cleanStates(), auth._storage.wipeToken());
    });

    it('should resolve to undefined if there is a valid token', function () {
      return auth._storage.saveToken({access_token: 'token', expires: Auth._epoch() + 60 * 60, scopes: ['0-0-0-0-0']}).
        then(function () {
          return auth.init();
        }).
        should.eventually.be.undefined;
    });

    it('should fetch auth response from query parameters', function () {
      var frozenTime = Auth._epoch();
      this.sinon.stub(AuthResponseParser.prototype, 'getLocation').returns('http://localhost:8080/hub#access_token=2YotnFZFEjr1zCsicMWpAA&state=xyz&token_type=example&expires_in=3600');
      this.sinon.stub(Auth, '_epoch').returns(frozenTime);

      auth = new Auth({
        serverUri: '',
        redirect_uri: 'http://localhost:8080/hub',
        client_id: '1-1-1-1-1',
        scope: ['0-0-0-0-0', 'youtrack'],
        optionalScopes: ['youtrack']
      });
      return auth._storage.saveState('xyz', {restoreLocation: 'http://localhost:8080/hub/users', scopes: ['0-0-0-0-0']}).
        then(function () {
          return auth.init();
        }).
        then(function (restoreLocation) {
          restoreLocation.should.be.equal('http://localhost:8080/hub/users');
          return auth._storage.getToken();
        }).
        should.eventually.be.deep.equal({
          access_token: '2YotnFZFEjr1zCsicMWpAA',
          scopes: ['0-0-0-0-0'],
          expires: frozenTime + 3600
        });
    });

    it('should not throw error if user does not have state in local storage', function () {
      this.sinon.stub(AuthResponseParser.prototype, 'getLocation')
        .returns('http://localhost:8080/hub#access_token=000&state=state&token_type=token&expires_in=3600');

      auth = new Auth({
        serverUri: '',
        redirect_uri: 'http://localhost:8080/hub',
        client_id: '1-1-1-1-1',
        scope: ['0-0-0-0-0', 'youtrack'],
        optionalScopes: ['youtrack']
      });

      return auth.init().should.be.fulfilled;
    });

    it('should redirect to auth when there is no valid token', function () {
      this.sinon.stub(Auth.prototype, '_redirectCurrentPage');
      this.sinon.stub(AuthRequestBuilder, '_uuid').returns('unique');

      auth = new Auth({
        serverUri: '',
        redirect: true,
        redirect_uri: 'http://localhost:8080/hub',
        client_id: '1-1-1-1-1',
        scope: ['0-0-0-0-0', 'youtrack'],
        optionalScopes: ['youtrack']
      });
      return auth.init().
        otherwise(function (reject) {
          Auth.prototype._redirectCurrentPage.should.be.calledWith('api/rest/oauth2/auth?response_type=token&' +
            'state=unique&redirect_uri=http%3A%2F%2Flocalhost%3A8080%2Fhub&request_credentials=default&client_id=1-1-1-1-1&scope=0-0-0-0-0%20youtrack');
          return reject.authRedirect;
        }).
        should.eventually.be.true;
    });

    it('should initiate background auth when there is no valid token and fallback to redirect when token check fails', function () {
      var MockedStorage = require('imports?window=mocked-storage!../storage/storage__local');

      this.sinon.stub(AuthRequestBuilder, '_uuid').returns('unique');
      this.sinon.stub(Auth.prototype, '_getValidatedToken').returns(when.reject({authRedirect: true}));

      this.sinon.stub(Auth.prototype, '_redirectCurrentPage');
      this.sinon.stub(Auth.prototype, '_redirectFrame', function () {
        auth._storage.saveToken({access_token: 'token', expires: Auth._epoch() + 60 * 60, scopes: ['0-0-0-0-0']});
      });

      auth = new Auth({
        serverUri: '',
        redirect: false,
        redirect_uri: 'http://localhost:8080/hub',
        client_id: '1-1-1-1-1',
        scope: ['0-0-0-0-0', 'youtrack'],
        optionalScopes: ['youtrack']
      });

      auth._storage._tokenStorage = new MockedStorage();

      return auth.init().
        otherwise(function (reject) {
          // Background loading
          Auth.prototype._redirectFrame.should.have.been.calledWithMatch(sinon.match.any, 'api/rest/oauth2/auth?response_type=token&' +
          'state=unique&redirect_uri=http%3A%2F%2Flocalhost%3A8080%2Fhub&request_credentials=silent&client_id=1-1-1-1-1&scope=0-0-0-0-0%20youtrack');

          // Fallback redirect after second check fail
          Auth.prototype._redirectCurrentPage.should.have.been.calledWith('api/rest/oauth2/auth?response_type=token&' +
          'state=unique&redirect_uri=http%3A%2F%2Flocalhost%3A8080%2Fhub&request_credentials=default&client_id=1-1-1-1-1&scope=0-0-0-0-0%20youtrack');

          Auth.prototype._getValidatedToken.should.have.been.called.twice;

          return reject.authRedirect;
        }).
        should.eventually.be.true;
    });

    it('should clear location hash if cleanHash = true', function () {
      this.sinon.stub(Auth.prototype, '_redirectCurrentPage');
      this.sinon.stub(AuthRequestBuilder, '_uuid').returns('unique');
      this.sinon.stub(AuthResponseParser.prototype, 'getAuthResponseFromURL').returns({});

      auth = new Auth({
        serverUri: '',
        redirect: true,
        cleanHash: true
      });

      return auth.init().otherwise(function () {

        auth.setHash.should.have.been.calledWith('');
      });
    });

    it('should not clear location hash if cleanHash = true and there is nothing to clear', function () {
      this.sinon.stub(Auth.prototype, '_redirectCurrentPage');
      this.sinon.stub(AuthRequestBuilder, '_uuid').returns('unique');

      auth = new Auth({
        serverUri: '',
        redirect: true,
        cleanHash: true
      });

      return auth.init().otherwise(function () {
        auth.setHash.should.not.have.been.called;
      });
    });

    it('should not clear location hash if cleanHash = false', function () {
      this.sinon.stub(Auth.prototype, '_redirectCurrentPage');
      this.sinon.stub(AuthRequestBuilder, '_uuid').returns('unique');
      this.sinon.stub(AuthResponseParser.prototype, 'getAuthResponseFromURL').returns({});

      auth = new Auth({
        serverUri: '',
        redirect: true,
        cleanHash: false
      });

      return auth.init().otherwise(function () {
        auth.setHash.should.not.have.been.called;
      });

    });

    it('should pass through request_credentials value', function () {
      this.sinon.stub(Auth.prototype, '_redirectCurrentPage');
      this.sinon.stub(AuthRequestBuilder, '_uuid').returns('unique');

      auth = new Auth({
        serverUri: '',
        redirect: true,
        redirect_uri: 'http://localhost:8080/hub',
        request_credentials: 'skip'
      });
      return auth.init().
        otherwise(function () {
          Auth.prototype._redirectCurrentPage.should.be.calledWith('api/rest/oauth2/auth?response_type=token&' +
          'state=unique&redirect_uri=http%3A%2F%2Flocalhost%3A8080%2Fhub&request_credentials=skip&client_id=0-0-0-0-0&scope=0-0-0-0-0');
        });
    });
  });

  describe('requestToken', function () {

    var auth = new Auth({
      serverUri: '',
      redirect_uri: 'http://localhost:8080/hub',
      client_id: '1-1-1-1-1',
      scope: ['0-0-0-0-0', 'youtrack'],
      optionalScopes: ['youtrack']
    });

    var MockedStorage = require('imports?window=mocked-storage!../storage/storage__local');
    auth._storage._tokenStorage = new MockedStorage();

    beforeEach(function () {
      this.sinon.stub(Auth.prototype, '_redirectCurrentPage');
      this.sinon.stub(AuthRequestBuilder, '_uuid').returns('unique');
      auth._initDeferred = when.defer();
      auth._initDeferred.resolve();
    });

    afterEach(function () {
      return when.join(auth._storage.cleanStates(), auth._storage.wipeToken());
    });

    it('should resolve to access token if there is a valid one', function () {
      return auth._storage.saveToken({access_token: 'token', expires: Auth._epoch() + 60 * 60, scopes: ['0-0-0-0-0']}).
        then(function () {
          return auth.requestToken();
        }).
        should.eventually.be.equal('token');
    });

    it('should get token in iframe if there is no valid token', function () {
      this.sinon.stub(Auth.prototype, '_redirectFrame', function () {
        auth._storage.saveToken({access_token: 'token', expires: Auth._epoch() + 60 * 60, scopes: ['0-0-0-0-0']});
      });
      return auth.requestToken().
        then(function (accessToken) {
          Auth.prototype._redirectFrame.should.have.been.calledWithMatch(sinon.match.any, 'api/rest/oauth2/auth?response_type=token&' +
            'state=unique&redirect_uri=http%3A%2F%2Flocalhost%3A8080%2Fhub&request_credentials=default&client_id=1-1-1-1-1&scope=0-0-0-0-0%20youtrack');
          Auth.prototype._redirectCurrentPage.should.not.have.been.called;
          return accessToken;
        }).should.eventually.be.equal('token');
    });

    it('should redirect current page if get token in iframe fails', function () {
      var authURL = 'api/rest/oauth2/auth?response_type=token&' +
        'state=unique&redirect_uri=http%3A%2F%2Flocalhost%3A8080%2Fhub&request_credentials=default&client_id=1-1-1-1-1&scope=0-0-0-0-0%20youtrack';
      Auth.BACKGROUND_TIMEOUT = 100;
      this.sinon.stub(Auth.prototype, '_redirectFrame');
      return auth.requestToken().
        otherwise(function (reject) {
          Auth.prototype._redirectFrame.should.have.been.calledWithMatch(sinon.match.any, authURL);
          Auth.prototype._redirectCurrentPage.should.have.been.calledWith(authURL);

          return reject.authRedirect;
        }).should.eventually.be.true;
    });
  });

  describe('logout', function() {
    var auth = new Auth({
      serverUri: '',
      redirect_uri: 'http://localhost:8080/hub',
      client_id: '1-1-1-1-1',
      scope: ['0-0-0-0-0', 'youtrack'],
      optionalScopes: ['youtrack']
    });

    beforeEach(function () {
      this.sinon.stub(Auth.prototype, '_redirectCurrentPage');
      this.sinon.stub(AuthRequestBuilder, '_uuid').returns('unique');
    });

    it('should clear access token and redirect to logout', function () {
      return auth.logout().
        then(function () {
          Auth.prototype._redirectCurrentPage.should.have.been.calledWith('api/rest/oauth2/auth?response_type=token&' +
            'state=unique&redirect_uri=http%3A%2F%2Flocalhost%3A8080%2Fhub&' +
            'request_credentials=required&client_id=1-1-1-1-1&scope=0-0-0-0-0%20youtrack');
          return auth._storage.getToken();
        }).
        then(function (storedToken) {
          expect(storedToken).to.be.null;
          return auth._storage.getState('unique');
        }).should.eventually.be.deep.equal({
          restoreLocation: window.location.href,
          scopes: ['0-0-0-0-0', 'youtrack']
        });
    });
  });

  describe('TokenValidationError', function() {
    it('should be cool', function () {
      expect(function () {
        throw new Auth.TokenValidationError('message');
      }).to.throw(Auth.TokenValidationError, 'message');
    });
  });
});
