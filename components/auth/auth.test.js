/* eslint-disable func-names */
/* eslint-disable camelcase */

import Auth from './auth';
import AuthRequestBuilder from './request-builder';
import AuthResponseParser from './response-parser';
import BackgroundTokenGetter from './background-token-getter';
import AuthStorage from './storage';
import MockedStorage from 'imports-loader?window=storage-mock!../storage/storage__local';
import sniffer from '../global/sniffer';

describe('Auth', () => {
  describe('construction', () => {
    it('should require provide config', () => {
      expect(() => new Auth()).to.throw(Error, 'Config is required');
    });

    it('should require provide server uri', () => {
      expect(() => new Auth({
        serverUri: null
      })).to.throw(Error, '\"serverUri\" property is required');

      expect(() => new Auth({})).
        to.throw(Error, '\"serverUri\" property is required');
    });

    it('should fix serverUri', () => {
      expect(new Auth({serverUri: ''}).config.serverUri).to.equal('');
      expect(new Auth({serverUri: 'http://localhost'}).config.serverUri).
        to.equal('http://localhost/');
      expect(new Auth({serverUri: '.'}).config.serverUri).to.equal('./');
    });

    it('should merge passed config with default config', () => {
      const config = {
        serverUri: 'http://localhost/'
      };

      const auth = new Auth(config);

      auth.config.serverUri.should.equal(config.serverUri);
      auth.config.should.contain.keys(Object.keys(Auth.DEFAULT_CONFIG));
    });

    it('should set config.userParams with proper fields property', () => {
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

    it('should subscribe on logout if passed', function () {
      const onLogout = this.sinon.stub();

      const auth = new Auth({
        serverUri: '',
        onLogout
      });

      auth.listeners.trigger('logout');

      onLogout.should.have.been.called;
    });

    it('should perform redirect on userChange by default', function () {
      this.sinon.stub(Auth.prototype, '_redirectCurrentPage');

      const auth = new Auth({serverUri: ''});
      auth.listeners.trigger('userChange');

      Auth.prototype._redirectCurrentPage.should.have.been.called;
    });

    it('should not perform redirect on userChange when avoidPageReload is set', function () {
      this.sinon.stub(Auth.prototype, '_redirectCurrentPage');

      const auth = new Auth({
        avoidPageReload: true,
        serverUri: ''
      });
      auth.listeners.trigger('userChange');

      Auth.prototype._redirectCurrentPage.should.not.been.called;
    });
  });

  describe('getValidatedToken', () => {
    const auth = new Auth({
      serverUri: '',
      scopes: ['0-0-0-0-0', 'youtrack'],
      optionalScopes: ['youtrack']
    });

    beforeEach(function () {
      this.sinon.stub(AuthStorage.prototype, 'getToken');
    });

    it('should resolve access token when it is valid', () => {
      AuthStorage.prototype.getToken.returns(Promise.resolve({
        access_token: 'token',
        expires: Auth._epoch() + 60 * 60,
        scopes: ['0-0-0-0-0', 'youtrack']
      }));
      return auth._getValidatedToken([Auth._validateExistence, Auth._validateExpiration, auth._validateScopes.bind(auth)]).
        should.eventually.be.equal('token');
    });

    it('should resolve access token when token is given for all required scopes', () => {
      AuthStorage.prototype.getToken.returns(Promise.resolve({
        access_token: 'token',
        expires: Auth._epoch() + 60 * 60,
        scopes: ['0-0-0-0-0']
      }));
      return auth._getValidatedToken([Auth._validateExistence, Auth._validateExpiration, auth._validateScopes.bind(auth)]).
        should.eventually.be.equal('token');
    });

    it('should reject if access_token is empty', () => {
      AuthStorage.prototype.getToken.returns(Promise.resolve({
        access_token: null,
        expires: Auth._epoch() + 60 * 60,
        scopes: ['0-0-0-0-0']
      }));
      return auth._getValidatedToken([Auth._validateExistence, Auth._validateExpiration, auth._validateScopes.bind(auth)]).
        should.be.rejectedWith(Auth.TokenValidationError, 'Token not found');
    });

    it('should reject if there is no token stored', () => {
      AuthStorage.prototype.getToken.returns(Promise.resolve(null));
      return auth._getValidatedToken([Auth._validateExistence, Auth._validateExpiration, auth._validateScopes.bind(auth)]).
        should.be.rejectedWith(Auth.TokenValidationError, 'Token not found');
    });

    it('should reject if token is expired', () => {
      AuthStorage.prototype.getToken.returns(Promise.resolve({
        access_token: 'token',
        expires: Auth._epoch() + 15 * 60,
        scopes: ['0-0-0-0-0']
      }));
      return auth._getValidatedToken([Auth._validateExistence, Auth._validateExpiration, auth._validateScopes.bind(auth)]).
        should.be.rejectedWith(Auth.TokenValidationError, 'Token expired');
    });

    it('should reject if token scopes don\'t match required scopes', () => {
      AuthStorage.prototype.getToken.returns(Promise.resolve({
        access_token: 'token',
        expires: Auth._epoch() + 60 * 60,
        scopes: ['youtrack']
      }));
      return auth._getValidatedToken([Auth._validateExistence, Auth._validateExpiration, auth._validateScopes.bind(auth)]).
        should.be.rejectedWith(Auth.TokenValidationError, 'Token doesn\'t match required scopes');
    });
  });

  describe('validateAgainstUser', () => {
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

    afterEach(() => {
      Auth.HAS_CORS = hasCors;
    });

    it('should resolve to access token when user is returned', async () => {
      const token = {access_token: 'token'};
      Auth.prototype.getApi.returns(Promise.resolve({login: 'user'}));
      const promise = auth._validateAgainstUser(token);
      promise.should.be.fulfilled;
      await promise;
      Auth.prototype.getApi.should.have.been.calledWith(Auth.API_PROFILE_PATH, 'token');
    });

    it('should reject with redirect if 401 response received', () => {
      const token = {access_token: 'token'};
      Auth.prototype.getApi.returns(Promise.reject({
        status: 401,
        response: {
          json() {
            return Promise.resolve({error: 'Problem'});
          }
        }
      }));
      return auth._validateAgainstUser(token).
        should.be.rejectedWith(Auth.TokenValidationError, 'Problem');
    });

    it('should reject with redirect if invalid_grant response received', () => {
      const token = {access_token: 'token'};
      Auth.prototype.getApi.returns(Promise.reject({
        response: {
          json() {
            return Promise.resolve({error: 'invalid_grant'});
          }
        }
      }));
      return auth._validateAgainstUser(token).
        should.be.rejectedWith(Auth.TokenValidationError, 'invalid_grant');
    });

    it('should reject with redirect if invalid_request response received', () => {
      const token = {access_token: 'token'};
      Auth.prototype.getApi.returns(Promise.reject({
        response: {
          json() {
            return Promise.resolve({error: 'invalid_request'});
          }
        }
      }));
      return auth._validateAgainstUser(token).
        should.be.rejectedWith(Auth.TokenValidationError, 'invalid_request');
    });

    it('should reject with redirect if 401 response without json received', () => {
      const token = {access_token: 'token'};
      Auth.prototype.getApi.returns(Promise.reject({
        status: 401,
        message: '403 Forbidden',
        response: {
          json() {
            return Promise.reject();
          }
        }
      }));
      return auth._validateAgainstUser(token).
        should.be.rejectedWith(Auth.TokenValidationError, '403 Forbidden');
    });
  });

  describe('init', () => {
    let auth = new Auth({
      serverUri: '',
      redirect: true,
      redirect_uri: 'http://localhost:8080/hub',
      client_id: '1-1-1-1-1',
      scope: ['0-0-0-0-0', 'youtrack'],
      optionalScopes: ['youtrack']
    });

    beforeEach(function () {
      this.sinon.stub(Auth.prototype, 'getApi').
        returns(Promise.resolve({login: 'user'}));
      this.sinon.stub(Auth.prototype, 'setHash');
    });

    afterEach(() => Promise.all([auth._storage.cleanStates(), auth._storage.wipeToken()]));

    it('should resolve to undefined if there is a valid token', async() => {
      await auth._storage.saveToken({
        access_token: 'token',
        expires: Auth._epoch() + 60 * 60,
        scopes: ['0-0-0-0-0']
      });
      auth.init().should.eventually.be.undefined;
    });

    it('should fetch auth response from query parameters', async function () {
      const frozenTime = Auth._epoch();

      this.sinon.stub(AuthResponseParser.prototype, 'getLocation').
        returns('http://localhost:8080/hub#access_token=2YotnFZFEjr1zCsicMWpAA&state=xyz&token_type=example&expires_in=3600');
      this.sinon.stub(Auth, '_epoch').returns(frozenTime);

      auth = new Auth({
        serverUri: '',
        redirect_uri: 'http://localhost:8080/hub',
        client_id: '1-1-1-1-1',
        scope: ['0-0-0-0-0', 'youtrack'],
        optionalScopes: ['youtrack']
      });
      await auth._storage.saveState('xyz', {
        restoreLocation: 'http://localhost:8080/hub/users',
        scopes: ['0-0-0-0-0']
      });
      const restoreLocation = await auth.init();
      restoreLocation.should.be.equal('http://localhost:8080/hub/users');
      const token = await auth._storage.getToken();
      token.should.be.deep.equal({
        access_token: '2YotnFZFEjr1zCsicMWpAA',
        scopes: ['0-0-0-0-0'],
        expires: frozenTime + 3600
      });
    });

    it('should not throw error if user does not have state in local storage', function () {
      this.sinon.stub(AuthResponseParser.prototype, 'getLocation').
        returns('http://localhost:8080/hub#access_token=000&state=state&token_type=token&expires_in=3600');

      auth = new Auth({
        serverUri: '',
        redirect_uri: 'http://localhost:8080/hub',
        client_id: '1-1-1-1-1',
        scope: ['0-0-0-0-0', 'youtrack'],
        optionalScopes: ['youtrack']
      });

      return auth.init().should.be.fulfilled;
    });

    it('should redirect to auth when there is no valid token', async function () {
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
      try {
        await auth.init();
      } catch (reject) {
        Auth.prototype._redirectCurrentPage.should.be.calledWith('api/rest/oauth2/auth?response_type=token&' +
          'state=unique&redirect_uri=http%3A%2F%2Flocalhost%3A8080%2Fhub&request_credentials=default&client_id=1-1-1-1-1&scope=0-0-0-0-0%20youtrack');
        reject.authRedirect.should.be.true;
      }
    });

    it('should clear location hash if cleanHash = true', async function () {
      this.sinon.stub(Auth.prototype, '_redirectCurrentPage');
      this.sinon.stub(AuthRequestBuilder, '_uuid').returns('unique');
      this.sinon.stub(AuthResponseParser.prototype, 'getAuthResponseFromURL').
        returns({});

      auth = new Auth({
        serverUri: '',
        redirect: true,
        cleanHash: true
      });

      try {
        await auth.init();
      } catch (e) {
        auth.setHash.should.have.been.calledWith('');
      }
    });

    it('should not clear location hash if cleanHash = true and there is nothing to clear', async function () {
      this.sinon.stub(Auth.prototype, '_redirectCurrentPage');
      this.sinon.stub(AuthRequestBuilder, '_uuid').returns('unique');

      auth = new Auth({
        serverUri: '',
        redirect: true,
        cleanHash: true
      });

      try {
        await auth.init();
      } catch (e) {
        auth.setHash.should.not.have.been.called;
      }
    });

    it('should not clear location hash if cleanHash = false', async function () {
      this.sinon.stub(Auth.prototype, '_redirectCurrentPage');
      this.sinon.stub(AuthRequestBuilder, '_uuid').returns('unique');
      this.sinon.stub(AuthResponseParser.prototype, 'getAuthResponseFromURL').
        returns({});

      auth = new Auth({
        serverUri: '',
        redirect: true,
        cleanHash: false
      });

      try {
        await auth.init();
      } catch (e) {
        auth.setHash.should.not.have.been.called;
      }

    });

    it('should pass through request_credentials value', async function () {
      this.sinon.stub(Auth.prototype, '_redirectCurrentPage');
      this.sinon.stub(AuthRequestBuilder, '_uuid').returns('unique');

      auth = new Auth({
        serverUri: '',
        redirect: true,
        redirect_uri: 'http://localhost:8080/hub',
        request_credentials: 'skip'
      });
      try {
        await auth.init();
      } catch (e) {
        Auth.prototype._redirectCurrentPage.should.be.calledWith('api/rest/oauth2/auth?response_type=token&' +
          'state=unique&redirect_uri=http%3A%2F%2Flocalhost%3A8080%2Fhub&request_credentials=skip&client_id=0-0-0-0-0&scope=0-0-0-0-0');
      }
    });
  });

  describe('background init', () => {
    let auth;

    beforeEach(function () {
      this.sinon.stub(Auth.prototype, '_getValidatedToken').
        returns(Promise.reject({authRedirect: true}));
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

    it('should initiate when there is no valid token', async function () {
      Auth.prototype._getValidatedToken.onCall(1).
        returns(Promise.resolve('token'));

      this.sinon.stub(BackgroundTokenGetter.prototype, '_redirectFrame').callsFake(() => {
        auth._storage.saveToken({
          access_token: 'token',
          expires: Auth._epoch() + 60 * 60,
          scopes: ['0-0-0-0-0']
        });
      });

      await auth.init();

      BackgroundTokenGetter.prototype._redirectFrame.should.have.been.calledWithMatch(sinon.match.any, 'api/rest/oauth2/auth?response_type=token&' +
        'state=unique&redirect_uri=http%3A%2F%2Flocalhost%3A8080%2Fhub&request_credentials=silent&client_id=1-1-1-1-1&scope=0-0-0-0-0%20youtrack');

      Auth.prototype._redirectCurrentPage.should.not.have.been.called;

      Auth.prototype._getValidatedToken.should.have.been.calledTwice;
    });

    it('should initiate and fall back to redirect when token check fails', async function () {
      this.sinon.stub(BackgroundTokenGetter.prototype, '_redirectFrame').callsFake(() => {
        auth._storage.saveToken({
          access_token: 'token',
          expires: Auth._epoch() + 60 * 60,
          scopes: ['0-0-0-0-0']
        });
      });

      try {
        await auth.init();
      } catch (reject) {
        // Background loading
        BackgroundTokenGetter.prototype._redirectFrame.should.have.been.calledWithMatch(sinon.match.any, 'api/rest/oauth2/auth?response_type=token&' +
          'state=unique&redirect_uri=http%3A%2F%2Flocalhost%3A8080%2Fhub&request_credentials=silent&client_id=1-1-1-1-1&scope=0-0-0-0-0%20youtrack');

        // Fallback redirect after second check fail
        Auth.prototype._redirectCurrentPage.should.have.been.calledWith('api/rest/oauth2/auth?response_type=token&' +
          'state=unique&redirect_uri=http%3A%2F%2Flocalhost%3A8080%2Fhub&request_credentials=default&client_id=1-1-1-1-1&scope=0-0-0-0-0%20youtrack');

        Auth.prototype._getValidatedToken.should.have.been.calledTwice;

        reject.authRedirect.should.be.true;
      }
    });

    it('should initiate and fall back to redirect when guest is banned', async function () {
      this.sinon.stub(BackgroundTokenGetter.prototype, '_redirectFrame').callsFake(() => {
        auth._storage.saveState('unique', {error: {code: 'access_denied'}});
      });

      try {
        await auth.init();
      } catch (reject) {
        // Background loading
        BackgroundTokenGetter.prototype._redirectFrame.should.have.been.calledWithMatch(sinon.match.any, 'api/rest/oauth2/auth?response_type=token&' +
          'state=unique&redirect_uri=http%3A%2F%2Flocalhost%3A8080%2Fhub&request_credentials=silent&client_id=1-1-1-1-1&scope=0-0-0-0-0%20youtrack');

        // Fallback redirect after background fail
        Auth.prototype._redirectCurrentPage.should.have.been.calledWith('api/rest/oauth2/auth?response_type=token&' +
          'state=unique&redirect_uri=http%3A%2F%2Flocalhost%3A8080%2Fhub&request_credentials=default&client_id=1-1-1-1-1&scope=0-0-0-0-0%20youtrack');

        Auth.prototype._getValidatedToken.should.have.been.calledOnce;

        reject.code.should.deep.equal({code: 'access_denied'});
      }
    });
  });

  describe('requestToken', () => {
    beforeEach(function () {
      this.sinon.stub(Auth.prototype, '_redirectCurrentPage');
      this.sinon.stub(Auth.prototype, 'getApi').
        returns(Promise.resolve({id: 'APIuser'}));
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

    it('should resolve to access token if there is a valid one', async function () {
      await this.auth._storage.saveToken({
        access_token: 'token',
        expires: Auth._epoch() + 60 * 60,
        scopes: ['0-0-0-0-0']
      });
      const token = await this.auth.requestToken();
      token.should.be.equal('token');
    });

    it('should get token in iframe if there is no valid token', async function () {
      this.sinon.stub(BackgroundTokenGetter.prototype, '_redirectFrame').callsFake(() => {
        this.auth._storage.saveToken({
          access_token: 'token',
          expires: Auth._epoch() + 60 * 60,
          scopes: ['0-0-0-0-0']
        });
      });
      const accessToken = await this.auth.requestToken();
      BackgroundTokenGetter.prototype._redirectFrame.should.have.been.calledWithMatch(sinon.match.any, 'api/rest/oauth2/auth?response_type=token&' +
        'state=unique&redirect_uri=http%3A%2F%2Flocalhost%3A8080%2Fhub&request_credentials=silent&client_id=1-1-1-1-1&scope=0-0-0-0-0%20youtrack');

      // Assert fails in IE for some reason
      if (sniffer.browser.name !== 'ie') {
        Auth.prototype._redirectCurrentPage.should.not.have.been.called;
      }

      accessToken.should.be.equal('token');
    });

    it('should reload page', async function () {
      this.auth.user = {id: 'initUser'};
      this.sinon.stub(BackgroundTokenGetter.prototype, '_redirectFrame').callsFake(() => {
        this.auth._storage.saveToken({
          access_token: 'token',
          expires: Auth._epoch() + 60 * 60,
          scopes: ['0-0-0-0-0']
        });
      });
      const accessToken = await this.auth.requestToken();
      BackgroundTokenGetter.prototype._redirectFrame.should.have.been.calledWithMatch(sinon.match.any, 'api/rest/oauth2/auth?response_type=token&' +
        'state=unique&redirect_uri=http%3A%2F%2Flocalhost%3A8080%2Fhub&request_credentials=silent&client_id=1-1-1-1-1&scope=0-0-0-0-0%20youtrack');
      Auth.prototype._redirectCurrentPage.should.have.been.calledWith(window.location.href);
      accessToken.should.be.equal('token');
    });

    it('should redirect current page if get token in iframe fails', async function () {
      this.auth._backgroundTokenGetter._timeout = 100;
      this.sinon.stub(BackgroundTokenGetter.prototype, '_redirectFrame');
      try {
        await this.auth.requestToken();
      } catch (reject) {
        BackgroundTokenGetter.prototype._redirectFrame.should.have.been.calledWithMatch(sinon.match.any, 'api/rest/oauth2/auth?response_type=token&' +
          'state=unique&redirect_uri=http%3A%2F%2Flocalhost%3A8080%2Fhub&request_credentials=silent&client_id=1-1-1-1-1&scope=0-0-0-0-0%20youtrack');
        Auth.prototype._redirectCurrentPage.should.have.been.calledWith('api/rest/oauth2/auth?response_type=token&' +
          'state=unique&redirect_uri=http%3A%2F%2Flocalhost%3A8080%2Fhub&request_credentials=default&client_id=1-1-1-1-1&scope=0-0-0-0-0%20youtrack');

        reject.authRedirect.should.be.true;
      }
    });
  });

  describe('requestUser', () => {
    let auth;

    beforeEach(function () {
      auth = new Auth({
        serverUri: '',
        redirect_uri: 'http://localhost:8080/hub',
        client_id: '1-1-1-1-1',
        scope: ['0-0-0-0-0', 'youtrack'],
        optionalScopes: ['youtrack']
      });

      this.sinon.stub(Auth.prototype, 'getApi').
        returns(Promise.resolve({name: 'APIuser'}));
    });

    it('should return existing user', async () => {
      auth._initDeferred = {};
      auth._initDeferred.promise = Promise.resolve();

      auth.user = {name: 'existingUser'};

      const user = await auth.requestUser();
      Auth.prototype.getApi.should.not.have.been.called;
      user.should.equal(auth.user);
    });

    it('should get user from API', async function () {
      auth._initDeferred = {};
      auth._initDeferred.promise = Promise.resolve();

      this.sinon.stub(Auth.prototype, 'requestToken').
        returns(Promise.resolve('token'));

      const user = await auth.requestUser();
      Auth.prototype.getApi.should.have.been.calledOnce;
      Auth.prototype.getApi.should.have.been.calledWithMatch('users/me', 'token', sinon.match({fields: 'guest,id,name,profile/avatar/url'}));
      user.should.deep.equal({name: 'APIuser'});
    });

    it('should wait user saved during validation', async () => {
      auth.init();
      auth._storage.saveToken({
        access_token: 'token',
        expires: Auth._epoch() + 60 * 60,
        scopes: ['0-0-0-0-0']
      });

      const user = await auth.requestUser();
      Auth.prototype.getApi.should.have.been.calledOnce;
      user.should.deep.equal({name: 'APIuser'});
    });
  });

  describe('getUser', () => {
    let auth;

    beforeEach(function () {
      auth = new Auth({
        serverUri: '',
        redirect_uri: 'http://localhost:8080/hub',
        client_id: '1-1-1-1-1',
        scope: ['0-0-0-0-0', 'youtrack'],
        optionalScopes: ['youtrack']
      });

      this.sinon.stub(Auth.prototype, 'getApi').
        returns(Promise.resolve({name: 'APIuser'}));
    });

    it('should not return existing user', async () => {
      auth._initDeferred = {};
      auth._initDeferred.promise = Promise.resolve();

      auth.user = {name: 'existingUser'};

      const user = await auth.getUser();

      user.should.deep.equal({name: 'APIuser'});
    });

    it('should get user from API', async () => {
      auth._initDeferred = {};
      auth._initDeferred.promise = Promise.resolve();

      const user = await auth.getUser('token');
      Auth.prototype.getApi.should.have.been.calledOnce;
      Auth.prototype.getApi.should.have.been.calledWithMatch('users/me', 'token', sinon.match({fields: 'guest,id,name,profile/avatar/url'}));
      user.should.deep.equal({name: 'APIuser'});
    });
  });

  describe('getSecure and getApi', () => {
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

    it('getSecure should reject promise with error and response for non-200 response codes', async function () {
      const response = auth.getSecure('http://localhost:500', 'token');
      const server = this.sinon.server;
      server.respond();

      try {
        await response;
      } catch (error) {
        error.message.should.equal('500 Internal Server Error');

        const res = await error.response.json();
        res.should.deep.equal({error: 'lol'});
      }
    });

    it('getSecure should set headers', async function () {
      const response = auth.getSecure('http://localhost:6666/users/me', 'token');
      const server = this.sinon.server;
      server.respond();

      await response;
      server.requests[0].requestHeaders.should.deep.equal({
        authorization: 'Bearer token',
        accept: 'application/json',
        'content-type': 'application/json;charset=utf-8' //NOTE: charset is added by sinon server automatically
      });
    });

    it('getSecure should pass params', async function () {
      const response = auth.getSecure('http://localhost:6666/users/me', 'token', {
        fields: 'one,two',
        $top: '2'
      });
      const server = this.sinon.server;
      server.respond();

      try {
        await response;
      } catch (e) {
        server.requests[0].url.should.equal('http://localhost:6666/users/me?fields=one%2Ctwo&%24top=2');
      }
    });

    it('getApi should return promise with response object', function () {
      const response = auth.getApi('users/me', 'token');
      this.sinon.server.respond();

      return response.should.become({name: 'user'});
    });

    it('should not set credentials by default', function () {
      this.sinon.spy(auth, '_fetch');

      auth.getSecure('http://localhost:6666/users/me', 'token');

      auth._fetch.should.have.been.calledWithMatch(
        'http://localhost:6666/users/me',
        {}
      );
    });

    it('should allow pass cookie policy for fetch', function () {
      this.sinon.spy(auth, '_fetch');

      auth.config.fetchCredentials = 'include';
      auth.getSecure('http://localhost:6666/users/me', 'token');

      auth._fetch.should.have.been.calledWithMatch(
        'http://localhost:6666/users/me',
        {
          credentials: auth.config.fetchCredentials
        }
      );
    });
  });

  describe('login', () => {
    const auth = new Auth({
      serverUri: ''
    });

    beforeEach(function () {
      this.sinon.stub(BackgroundTokenGetter.prototype, 'get').
        returns(Promise.resolve('token'));
      this.sinon.stub(Auth.prototype, 'logout');
      this.sinon.stub(auth.listeners, 'trigger');
    });

    it('should call getUser', async function () {
      this.sinon.stub(Auth.prototype, 'getUser');

      await auth.login();

      auth.getUser.should.have.been.calledWith('token');
    });

    it('should trigger userChange', async function () {
      this.sinon.stub(Auth.prototype, 'getUser').returns({name: 'APIuser'});

      await auth.login();

      auth.listeners.trigger.should.have.been.calledWithMatch('userChange', sinon.match({name: 'APIuser'}));
    });

    it('should not change user in instance', async function () {
      this.sinon.stub(Auth.prototype, 'getUser').
        returns(Promise.resolve({name: 'APIuser'}));

      const user = {name: 'existingUser'};
      auth.user = user;

      await auth.login();

      auth.user.should.equal(user);
    });

    it('should call logout for guest', async function () {
      this.sinon.stub(Auth.prototype, 'getUser').
        returns(Promise.resolve({guest: true}));
      await auth.login();

      auth.logout.should.have.been.calledOnce;
    });

    it('should call logout on reject', async function () {
      this.sinon.stub(Auth.prototype, 'getUser').
        returns(Promise.reject());
      await auth.login();

      auth.logout.should.have.been.calledOnce;
    });
  });

  describe('logout', () => {
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

    it('should clear access token and redirect to logout', async () => {
      await auth.logout();
      Auth.prototype._redirectCurrentPage.should.have.been.calledWith('api/rest/oauth2/auth?response_type=token&' +
        'state=unique&redirect_uri=http%3A%2F%2Flocalhost%3A8080%2Fhub&' +
        'request_credentials=required&client_id=1-1-1-1-1&scope=0-0-0-0-0%20youtrack');

      const storedToken = await auth._storage.getToken();
      expect(storedToken).to.be.null;

      const state = await auth._storage.getState('unique');
      state.should.contain.all.keys({
        restoreLocation: window.location.href,
        scopes: ['0-0-0-0-0', 'youtrack']
      });
    });

    it('should pass error message to server', async () => {
      await auth.logout({
        message: 'access denied'
      });
      Auth.prototype._redirectCurrentPage.should.have.been.calledWith('api/rest/oauth2/auth?response_type=token&' +
        'state=unique&redirect_uri=http%3A%2F%2Flocalhost%3A8080%2Fhub&' +
        'request_credentials=required&client_id=1-1-1-1-1&scope=0-0-0-0-0%20youtrack&' +
        'message=access%20denied');
    });

    it('should logout when no onLogout passed', () => auth.logout().should.be.fulfilled);

    it('should fail pass when onLogout returns rejected promise', async function () {
      const onLogout = this.sinon.spy();
      const logoutAuth = new Auth({
        serverUri: '',
        onLogout
      });

      await logoutAuth.logout();
      onLogout.should.have.been.calledOnce;
    });

    it('should fail pass when onLogout returns rejected promise', () => {
      const logoutAuth = new Auth({
        serverUri: '',
        onLogout: () => Promise.reject()
      });

      return logoutAuth.logout().should.be.rejected;
    });

    it('should logout when no onLogout passed', () => auth.logout().should.be.fulfilled);

    it('should fail pass when onLogout returns rejected promise', async function () {
      const onLogout = this.sinon.spy();
      const logoutAuth = new Auth({
        serverUri: '',
        onLogout
      });

      await logoutAuth.logout();
      onLogout.should.have.been.calledOnce;
    });

    it('should fail pass when onLogout returns rejected promise', () => {
      const logoutAuth = new Auth({
        serverUri: '',
        onLogout: () => Promise.reject()
      });

      return logoutAuth.logout().should.be.rejected;
    });
  });

  describe('TokenValidationError', () => {
    it('should be cool', () => {
      expect(() => {
        throw new Auth.TokenValidationError('message');
      }).to.throw(Auth.TokenValidationError, 'message');
    });
  });
});
