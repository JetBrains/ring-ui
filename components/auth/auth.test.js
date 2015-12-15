/* eslint-disable camelcase */
import Auth from './auth';
import AuthRequestBuilder from './auth__request-builder';
import AuthResponseParser from './auth__response-parser';
import AuthStorage from './auth__storage';
import MockedStorage from 'imports?window=mocked-storage!../storage/storage__local';
import Sniffr from 'sniffr';

const sniffr = new Sniffr();
sniffr.sniff();

describe('Auth', function () {
  if (sniffr.browser.name === 'ie' && sniffr.browser.version[0] < 10) {
    return;
  }

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
      const config = {
        serverUri: 'http://localhost/'
      };

      const auth = new Auth(config);

      auth.config.serverUri.should.equal(config.serverUri);
      auth.config.should.contain.keys(Object.keys(Auth.DEFAULT_CONFIG));
    });

    it('should set config.userParams with proper fields property', function () {
      const config = {
        serverUri: 'http://localhost/',
        userFields: ['name', 'profile/email']
      };
      const auth = new Auth(config);

      auth.config.userParams.should.deep.equal({
        fields: 'guest,id,name,profile/avatar/url,profile/email'
      });
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
    const auth = new Auth({
      serverUri: '',
      scopes: ['0-0-0-0-0', 'youtrack'],
      optionalScopes: ['youtrack']
    });

    beforeEach(function () {
      this.sinon.stub(AuthStorage.prototype, 'getToken');
    });

    it('should resolve access token when it is valid', function () {
      AuthStorage.prototype.getToken.returns(Promise.resolve({
        access_token: 'token',
        expires: Auth._epoch() + 60 * 60,
        scopes: ['0-0-0-0-0', 'youtrack']
      }));
      return auth._getValidatedToken([Auth._validateExistence, Auth._validateExpiration, auth._validateScopes.bind(auth)]).
        should.eventually.be.equal('token');
    });

    it('should resolve access token when token is given for all required scopes', function () {
      AuthStorage.prototype.getToken.returns(Promise.resolve({
        access_token: 'token',
        expires: Auth._epoch() + 60 * 60,
        scopes: ['0-0-0-0-0']
      }));
      return auth._getValidatedToken([Auth._validateExistence, Auth._validateExpiration, auth._validateScopes.bind(auth)]).
        should.eventually.be.equal('token');
    });

    it('should reject if access_token is empty', function () {
      AuthStorage.prototype.getToken.returns(Promise.resolve({
        access_token: null,
        expires: Auth._epoch() + 60 * 60,
        scopes: ['0-0-0-0-0']
      }));
      return auth._getValidatedToken([Auth._validateExistence, Auth._validateExpiration, auth._validateScopes.bind(auth)]).
        should.be.rejectedWith(Auth.TokenValidationError, 'Token not found');
    });

    it('should reject if there is no token stored', function () {
      AuthStorage.prototype.getToken.returns(Promise.resolve(null));
      return auth._getValidatedToken([Auth._validateExistence, Auth._validateExpiration, auth._validateScopes.bind(auth)]).
        should.be.rejectedWith(Auth.TokenValidationError, 'Token not found');
    });

    it('should reject if token is expired', function () {
      AuthStorage.prototype.getToken.returns(Promise.resolve({
        access_token: 'token',
        expires: Auth._epoch() + 15 * 60,
        scopes: ['0-0-0-0-0']
      }));
      return auth._getValidatedToken([Auth._validateExistence, Auth._validateExpiration, auth._validateScopes.bind(auth)]).
        should.be.rejectedWith(Auth.TokenValidationError, 'Token expired');
    });

    it('should reject if token scopes don\'t match required scopes', function () {
      AuthStorage.prototype.getToken.returns(Promise.resolve({
        access_token: 'token',
        expires: Auth._epoch() + 60 * 60,
        scopes: ['youtrack']
      }));
      return auth._getValidatedToken([Auth._validateExistence, Auth._validateExpiration, auth._validateScopes.bind(auth)]).
        should.be.rejectedWith(Auth.TokenValidationError, 'Token doesn\'t match required scopes');
    });
  });

  describe('validateAgainstUser', function () {
    const auth = new Auth({
      serverUri: 'http://server',
      redirect_uri: 'http://client',
      scopes: ['0-0-0-0-0', 'youtrack'],
      optionalScopes: ['youtrack']
    });

    const hasCors = Auth.HAS_CORS;

    beforeEach(function () {
      Auth.HAS_CORS = true;
      this.sinon.stub(Auth.prototype, 'getApi');
    });

    afterEach(function () {
      Auth.HAS_CORS = hasCors;
    });

    it('should resolve to access token when user is returned', function () {
      const token = {access_token: 'token'};
      Auth.prototype.getApi.returns(Promise.resolve({login: 'user'}));
      return auth._validateAgainstUser(token).
        then(function (validToken) {
          Auth.prototype.getApi.should.have.been.calledWith(Auth.API_PROFILE_PATH, 'token');
          return validToken;
        }).
        should.eventually.be.deep.equal(token);
    });

    it('should not validate user when CORS is disabled', function () {
      const token = {access_token: 'token'};
      Auth.HAS_CORS = false;

      return auth._validateAgainstUser(token).
        then(function (validToken) {
          Auth.prototype.getApi.should.not.have.been.called;
          return validToken;
        }).
        should.eventually.be.deep.equal(token);
    });


    it('should reject with redirect if 401 response recieved', function () {
      const token = {access_token: 'token'};
      Auth.prototype.getApi.returns(Promise.reject({
        status: 401,
        response: {
          json: function () {
            return Promise.resolve({error: 'Problem'});
          }
        }
      }));
      return auth._validateAgainstUser(token).
        should.be.rejectedWith(Auth.TokenValidationError, 'Problem');
    });

    it('should reject with redirect if invalid_grant response recieved', function () {
      const token = {access_token: 'token'};
      Auth.prototype.getApi.returns(Promise.reject({
        response: {
          json: function () {
            return Promise.resolve({error: 'invalid_grant'});
          }
        }
      }));
      return auth._validateAgainstUser(token).
        should.be.rejectedWith(Auth.TokenValidationError, 'invalid_grant');
    });

    it('should reject with redirect if invalid_grant response recieved', function () {
      const token = {access_token: 'token'};
      Auth.prototype.getApi.returns(Promise.reject({
        response: {
          json: function () {
            return Promise.resolve({error: 'invalid_request'});
          }
        }
      }));
      return auth._validateAgainstUser(token).
        should.be.rejectedWith(Auth.TokenValidationError, 'invalid_request');
    });

    it('should reject with redirect if 401 response without json recieved', function () {
      const token = {access_token: 'token'};
      Auth.prototype.getApi.returns(Promise.reject({
        status: 401,
        message: '403 Forbidden',
        response: {
          json: function () {
            return Promise.reject();
          }
        }
      }));
      return auth._validateAgainstUser(token).
        should.be.rejectedWith(Auth.TokenValidationError, '403 Forbidden');
    });
  });

  describe('init', function () {
    let auth = new Auth({
      serverUri: '',
      redirect: true,
      redirect_uri: 'http://localhost:8080/hub',
      client_id: '1-1-1-1-1',
      scope: ['0-0-0-0-0', 'youtrack'],
      optionalScopes: ['youtrack']
    });

    beforeEach(function () {
      this.sinon.stub(Auth.prototype, 'getApi').returns(Promise.resolve({login: 'user'}));
      this.sinon.stub(Auth.prototype, 'setHash');
    });

    afterEach(function () {
      return Promise.all([auth._storage.cleanStates(), auth._storage.wipeToken()]);
    });

    it('should resolve to undefined if there is a valid token', function () {
      return auth._storage.saveToken({access_token: 'token', expires: Auth._epoch() + 60 * 60, scopes: ['0-0-0-0-0']}).
        then(function () {
          return auth.init();
        }).
        should.eventually.be.undefined;
    });

    it('should fetch auth response from query parameters', function () {
      const frozenTime = Auth._epoch();

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
        catch(function (reject) {
          Auth.prototype._redirectCurrentPage.should.be.calledWith('api/rest/oauth2/auth?response_type=token&' +
            'state=unique&redirect_uri=http%3A%2F%2Flocalhost%3A8080%2Fhub&request_credentials=default&client_id=1-1-1-1-1&scope=0-0-0-0-0%20youtrack');
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

      return auth.init().catch(function () {

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

      return auth.init().catch(function () {
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

      return auth.init().catch(function () {
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
        catch(function () {
          Auth.prototype._redirectCurrentPage.should.be.calledWith('api/rest/oauth2/auth?response_type=token&' +
          'state=unique&redirect_uri=http%3A%2F%2Flocalhost%3A8080%2Fhub&request_credentials=skip&client_id=0-0-0-0-0&scope=0-0-0-0-0');
        });
    });
  });

  describe('background init', function () {
    if (sniffr.browser.name === 'ie') {
      return;
    }

    let auth;

    beforeEach(function () {
      this.sinon.stub(Auth.prototype, '_getValidatedToken').returns(Promise.reject({authRedirect: true}));
      this.sinon.stub(Auth.prototype, '_redirectCurrentPage');
      this.sinon.stub(AuthRequestBuilder, '_uuid').returns('unique');

      auth = new Auth({
        serverUri: '',
        redirect: false,
        redirect_uri: 'http://localhost:8080/hub',
        client_id: '1-1-1-1-1',
        scope: ['0-0-0-0-0', 'youtrack'],
        optionalScopes: ['youtrack']
      });

      auth._storage._tokenStorage = auth._storage._stateStorage = new MockedStorage();
    });

    it('should initiate when there is no valid token', function () {
      Auth.prototype._getValidatedToken.onCall(1).returns(Promise.resolve('token'));

      this.sinon.stub(Auth.prototype, '_redirectFrame', function () {
        auth._storage.saveToken({access_token: 'token', expires: Auth._epoch() + 60 * 60, scopes: ['0-0-0-0-0']});
      });

      return auth.init().
        then(function () {
          Auth.prototype._redirectFrame.should.have.been.calledWithMatch(sinon.match.any, 'api/rest/oauth2/auth?response_type=token&' +
          'state=unique&redirect_uri=http%3A%2F%2Flocalhost%3A8080%2Fhub&request_credentials=silent&client_id=1-1-1-1-1&scope=0-0-0-0-0%20youtrack');

          Auth.prototype._redirectCurrentPage.should.not.have.been.called;

          Auth.prototype._getValidatedToken.should.have.been.calledTwice;
        });
    });

    it('should initiate and fall back to redirect when token check fails', function () {
      this.sinon.stub(Auth.prototype, '_redirectFrame', function () {
        auth._storage.saveToken({access_token: 'token', expires: Auth._epoch() + 60 * 60, scopes: ['0-0-0-0-0']});
      });

      return auth.init().
        catch(function (reject) {
          // Background loading
          Auth.prototype._redirectFrame.should.have.been.calledWithMatch(sinon.match.any, 'api/rest/oauth2/auth?response_type=token&' +
          'state=unique&redirect_uri=http%3A%2F%2Flocalhost%3A8080%2Fhub&request_credentials=silent&client_id=1-1-1-1-1&scope=0-0-0-0-0%20youtrack');

          // Fallback redirect after second check fail
          Auth.prototype._redirectCurrentPage.should.have.been.calledWith('api/rest/oauth2/auth?response_type=token&' +
          'state=unique&redirect_uri=http%3A%2F%2Flocalhost%3A8080%2Fhub&request_credentials=default&client_id=1-1-1-1-1&scope=0-0-0-0-0%20youtrack');

          Auth.prototype._getValidatedToken.should.have.been.calledTwice;

          return reject.authRedirect;
        }).
        should.eventually.be.true;
    });

    it('should initiate and fall back to redirect when guest is banned', function () {
      this.sinon.stub(Auth.prototype, '_redirectFrame', function () {
        auth._storage.saveState('unique', {error: {code: 'access_denied'}});
      });

      return auth.init().
        catch(function (reject) {
          // Background loading
          Auth.prototype._redirectFrame.should.have.been.calledWithMatch(sinon.match.any, 'api/rest/oauth2/auth?response_type=token&' +
          'state=unique&redirect_uri=http%3A%2F%2Flocalhost%3A8080%2Fhub&request_credentials=silent&client_id=1-1-1-1-1&scope=0-0-0-0-0%20youtrack');

          // Fallback redirect after background fail
          Auth.prototype._redirectCurrentPage.should.have.been.calledWith('api/rest/oauth2/auth?response_type=token&' +
          'state=unique&redirect_uri=http%3A%2F%2Flocalhost%3A8080%2Fhub&request_credentials=default&client_id=1-1-1-1-1&scope=0-0-0-0-0%20youtrack');

          Auth.prototype._getValidatedToken.should.have.been.calledOnce;

          return reject.code;
        }).
        should.become({code: 'access_denied'});
    });
  });

  describe('requestToken', function () {
    if (sniffr.browser.name === 'ie') {
      return;
    }

    beforeEach(function () {
      this.sinon.stub(Auth.prototype, '_redirectCurrentPage');
      this.sinon.stub(Auth.prototype, 'getApi').returns(Promise.resolve({id: 'APIuser'}));
      this.sinon.stub(AuthRequestBuilder, '_uuid').returns('unique');

      this.auth = new Auth({
        serverUri: '',
        redirect_uri: 'http://localhost:8080/hub',
        client_id: '1-1-1-1-1',
        scope: ['0-0-0-0-0', 'youtrack'],
        optionalScopes: ['youtrack']
      });

      this.auth._storage._tokenStorage = new MockedStorage();
      this.auth._initDeferred.resolve();
    });

    afterEach(function () {
      return Promise.all([this.auth._storage.cleanStates(), this.auth._storage.wipeToken()]);
    });

    it('should resolve to access token if there is a valid one', function () {
      return this.auth._storage.saveToken({access_token: 'token', expires: Auth._epoch() + 60 * 60, scopes: ['0-0-0-0-0']}).
        then(() => this.auth.requestToken()).
        should.eventually.be.equal('token');
    });

    it('should get token in iframe if there is no valid token', function () {
      this.sinon.stub(Auth.prototype, '_redirectFrame', () => {
        this.auth._storage.saveToken({access_token: 'token', expires: Auth._epoch() + 60 * 60, scopes: ['0-0-0-0-0']});
      });
      return this.auth.requestToken().
        then(function (accessToken) {
          Auth.prototype._redirectFrame.should.have.been.calledWithMatch(sinon.match.any, 'api/rest/oauth2/auth?response_type=token&' +
            'state=unique&redirect_uri=http%3A%2F%2Flocalhost%3A8080%2Fhub&request_credentials=silent&client_id=1-1-1-1-1&scope=0-0-0-0-0%20youtrack');

          // Assert fails in IE for some reason
          if (sniffr.browser.name !== 'ie') {
            Auth.prototype._redirectCurrentPage.should.not.have.been.called;
          }

          return accessToken;
        }).should.eventually.be.equal('token');
    });

    it('should reload page', function () {
      this.auth.user = {id: 'initUser'};
      this.sinon.stub(Auth.prototype, '_redirectFrame', () => {
        this.auth._storage.saveToken({access_token: 'token', expires: Auth._epoch() + 60 * 60, scopes: ['0-0-0-0-0']});
      });
      return this.auth.requestToken().
        then(function (accessToken) {
          Auth.prototype._redirectFrame.should.have.been.calledWithMatch(sinon.match.any, 'api/rest/oauth2/auth?response_type=token&' +
            'state=unique&redirect_uri=http%3A%2F%2Flocalhost%3A8080%2Fhub&request_credentials=silent&client_id=1-1-1-1-1&scope=0-0-0-0-0%20youtrack');
          Auth.prototype._redirectCurrentPage.should.have.been.calledWith(window.location.href);
          return accessToken;
        }).should.eventually.be.equal('token');
    });

    it('should redirect current page if get token in iframe fails', function () {
      Auth.BACKGROUND_TIMEOUT = 100;
      this.sinon.stub(Auth.prototype, '_redirectFrame');
      return this.auth.requestToken().
        catch(function (reject) {
          Auth.prototype._redirectFrame.should.have.been.calledWithMatch(sinon.match.any, 'api/rest/oauth2/auth?response_type=token&' +
          'state=unique&redirect_uri=http%3A%2F%2Flocalhost%3A8080%2Fhub&request_credentials=silent&client_id=1-1-1-1-1&scope=0-0-0-0-0%20youtrack');
          Auth.prototype._redirectCurrentPage.should.have.been.calledWith('api/rest/oauth2/auth?response_type=token&' +
          'state=unique&redirect_uri=http%3A%2F%2Flocalhost%3A8080%2Fhub&request_credentials=default&client_id=1-1-1-1-1&scope=0-0-0-0-0%20youtrack');

          return reject.authRedirect;
        }).should.eventually.be.true;
    });
  });

  describe('requestUser', function () {
    let auth;

    beforeEach(function () {
      auth = new Auth({
        serverUri: '',
        redirect_uri: 'http://localhost:8080/hub',
        client_id: '1-1-1-1-1',
        scope: ['0-0-0-0-0', 'youtrack'],
        optionalScopes: ['youtrack']
      });

      this.sinon.stub(Auth.prototype, 'getApi').returns(Promise.resolve({name: 'APIuser'}));
    });

    it('should return existing user', function () {
      auth._initDeferred = {};
      auth._initDeferred.promise = Promise.resolve();

      auth.user = {name: 'existingUser'};

      return auth.requestUser().then(function (user) {
        Auth.prototype.getApi.should.not.have.been.called;
        return user;
      }).should.eventually.equal(auth.user);
    });

    it('should get user from API', function () {
      auth._initDeferred = {};
      auth._initDeferred.promise = Promise.resolve();

      this.sinon.stub(Auth.prototype, 'requestToken').returns(Promise.resolve('token'));

      return auth.requestUser().then(function (user) {
        Auth.prototype.getApi.should.have.been.calledOnce;
        Auth.prototype.getApi.should.have.been.calledWithMatch('users/me', 'token', sinon.match({fields: 'guest,id,name,profile/avatar/url'}));
        return user;
      }).should.become({name: 'APIuser'});
    });

    it('should wait user saved during validation', function () {
      auth.init();
      auth._storage.saveToken({access_token: 'token', expires: Auth._epoch() + 60 * 60, scopes: ['0-0-0-0-0']});

      return auth.requestUser().then(function (user) {
        Auth.prototype.getApi.should.have.been.calledOnce;
        return user;
      }).should.become({name: 'APIuser'});
    });
  });

  describe('getSecure and getApi', function () {
    const auth = new Auth({
      serverUri: 'http://localhost:8080'
    });

    beforeEach(function () {
      this.sinon.useFakeServer();
      this.sinon.server.respondWith('http://localhost:500', [500, {}, '{"error": "lol"}']);
      this.sinon.server.respondWith('http://localhost:6666/users/me', '{"name": "user"}');
      this.sinon.server.respondWith('http://localhost:8080/api/rest/users/me', '{"name": "user"}');
    });

    it('getSecure should return promise with response object', function () {
      const response = auth.getSecure('http://localhost:6666/users/me', 'token');
      this.sinon.server.respond();

      return response.should.become({name: 'user'});
    });

    it('getSecure should reject promise for non-200 response codes', function () {
      const response = auth.getSecure('http://localhost:404', 'token');
      const server = this.sinon.server;
      server.respond();

      return response.should.have.been.rejected;
    });

    it('getSecure should reject promise with error and response for non-200 response codes', function () {
      const response = auth.getSecure('http://localhost:500', 'token');
      const server = this.sinon.server;
      server.respond();

      return response.catch(function (error) {
        error.message.should.equal('500 Internal Server Error');

        return error.response.json();
      }).should.become({error: 'lol'});
    });

    it('getSecure should set headers', function () {
      const response = auth.getSecure('http://localhost:6666/users/me', 'token');
      const server = this.sinon.server;
      server.respond();

      return response.then(function () {
        server.requests[0].requestHeaders.should.deep.equal({
          authorization: 'Bearer token',
          accept: 'application/json'
        });
      });
    });

    it('getSecure should pass params', function () {
      const response = auth.getSecure('http://localhost:6666/users/me', 'token', {
        fields: 'one,two',
        $top: '2'
      });
      const server = this.sinon.server;
      server.respond();

      return response.catch(function () {
        server.requests[0].url.should.equal('http://localhost:6666/users/me?fields=one%2Ctwo&%24top=2');
      });
    });

    it('getApi should return promise with response object', function () {
      const response = auth.getApi('users/me', 'token');
      this.sinon.server.respond();

      return response.should.become({name: 'user'});
    });
  });

  describe('logout', function () {
    const auth = new Auth({
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
        }).then(function (state) {
          state.should.contain.all.keys({
            restoreLocation: window.location.href,
            scopes: ['0-0-0-0-0', 'youtrack']
          });
        });
    });

    it('should clear access token and redirect to logout', function () {
      return auth.logout({
        message: 'access denied'
      }).
        then(function () {
          Auth.prototype._redirectCurrentPage.should.have.been.calledWith('api/rest/oauth2/auth?response_type=token&' +
            'state=unique&redirect_uri=http%3A%2F%2Flocalhost%3A8080%2Fhub&' +
            'request_credentials=required&client_id=1-1-1-1-1&scope=0-0-0-0-0%20youtrack&' +
            'message=access%20denied');
        });
    });
  });

  describe('TokenValidationError', function () {
    it('should be cool', function () {
      expect(function () {
        throw new Auth.TokenValidationError('message');
      }).to.throw(Auth.TokenValidationError, 'message');
    });
  });
});
