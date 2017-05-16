/* eslint-disable func-names */
/* eslint-disable camelcase */

import sniffer from '../global/sniffer';
import HTTP from '../http/http';

import Auth from './auth';
import AuthRequestBuilder from './request-builder';
import AuthResponseParser from './response-parser';
import BackgroundFlow from './background-flow';
import TokenValidator from './token-validator';

import MockedStorage from 'imports-loader?window=storage-mock!../storage/storage__local';

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
        query: {
          fields: 'guest,id,name,profile/avatar/url,profile/email'
        }
      });
    });

    it('should not redirect on object construction', function () {
      this.sinon.stub(Auth.prototype, '_redirectCurrentPage');
      // eslint-disable-next-line no-new
      new Auth({serverUri: ''});
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
      this.sinon.stub(Auth.prototype, 'getUser').resolves({login: 'user'});
      this.sinon.stub(Auth.prototype, '_saveCurrentService');
      this.sinon.stub(Auth.prototype, 'setHash');
    });

    afterEach(() => Promise.all([auth._storage.cleanStates(), auth._storage.wipeToken()]));

    it('should resolve to undefined if there is a valid token', async() => {
      await auth._storage.saveToken({
        access_token: 'token',
        expires: TokenValidator._epoch() + 60 * 60,
        scopes: ['0-0-0-0-0']
      });
      auth.init().should.eventually.be.undefined;
    });

    it('should fetch auth response from query parameters', async function () {
      const frozenTime = TokenValidator._epoch();

      this.sinon.stub(AuthResponseParser.prototype, 'getLocation').
        returns('http://localhost:8080/hub' +
          '#access_token=2YotnFZFEjr1zCsicMWpAA&state=xyz&token_type=example&expires_in=3600');
      this.sinon.stub(TokenValidator, '_epoch').returns(frozenTime);

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
        returns('http://localhost:8080/hub' +
          '#access_token=000&state=state&token_type=token&expires_in=3600');

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
        Auth.prototype._redirectCurrentPage.
          should.be.calledWith('api/rest/oauth2/auth?response_type=token' +
          '&state=unique&redirect_uri=http%3A%2F%2Flocalhost%3A8080%2Fhub' +
          '&request_credentials=default&client_id=1-1-1-1-1' +
          '&scope=0-0-0-0-0%20youtrack');
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

    it(
      'should not clear location hash if cleanHash = true and there is nothing to clear',
      async function () {
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
      }
    );

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
        Auth.prototype._redirectCurrentPage.
          should.be.calledWith('api/rest/oauth2/auth?response_type=token&' +
          'state=unique&redirect_uri=http%3A%2F%2Flocalhost%3A8080%2Fhub' +
          '&request_credentials=skip&client_id=0-0-0-0-0&scope=0-0-0-0-0');
      }
    });
  });

  describe('background init', () => {
    let auth;

    beforeEach(function () {
      this.sinon.stub(TokenValidator.prototype, '_getValidatedToken').
        returns(Promise.reject({authRedirect: true}));
      this.sinon.stub(Auth.prototype, '_redirectCurrentPage');
      this.sinon.stub(Auth.prototype, 'getUser');
      this.sinon.stub(Auth.prototype, '_saveCurrentService');
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
      TokenValidator.prototype._getValidatedToken.onCall(1).
        returns(Promise.resolve('token'));

      this.sinon.stub(BackgroundFlow.prototype, '_redirectFrame').callsFake(() => {
        auth._storage.saveToken({
          access_token: 'token',
          expires: TokenValidator._epoch() + 60 * 60,
          scopes: ['0-0-0-0-0']
        });
      });

      await auth.init();

      BackgroundFlow.prototype._redirectFrame.
        should.have.been.calledWithMatch(
        sinon.match.any,
        'api/rest/oauth2/auth?response_type=token&state=unique' +
        '&redirect_uri=http%3A%2F%2Flocalhost%3A8080%2Fhub&request_credentials=silent' +
        '&client_id=1-1-1-1-1&scope=0-0-0-0-0%20youtrack'
      );

      Auth.prototype._redirectCurrentPage.should.not.have.been.called;

      TokenValidator.prototype._getValidatedToken.should.have.been.calledTwice;
    });

    it('should initiate and fall back to redirect when token check fails', async function () {
      this.sinon.stub(BackgroundFlow.prototype, '_redirectFrame').callsFake(() => {
        auth._storage.saveToken({
          access_token: 'token',
          expires: TokenValidator._epoch() + 60 * 60,
          scopes: ['0-0-0-0-0']
        });
      });

      try {
        await auth.init();
      } catch (reject) {
        // Background loading
        BackgroundFlow.prototype._redirectFrame.should.have.been.
          calledWithMatch(
            sinon.match.any,
            'api/rest/oauth2/auth?response_type=token' +
            '&state=unique&redirect_uri=http%3A%2F%2Flocalhost%3A8080%2Fhub' +
            '&request_credentials=silent&client_id=1-1-1-1-1&scope=0-0-0-0-0%20youtrack'
          );

        // Fallback redirect after second check fail
        Auth.prototype._redirectCurrentPage.should.have.been.
          calledWith('api/rest/oauth2/auth?response_type=token&state=unique' +
            '&redirect_uri=http%3A%2F%2Flocalhost%3A8080%2Fhub&request_credentials=default' +
            '&client_id=1-1-1-1-1&scope=0-0-0-0-0%20youtrack');

        TokenValidator.prototype._getValidatedToken.should.have.been.calledTwice;

        reject.authRedirect.should.be.true;
      }
    });

    it('should initiate and fall back to redirect when guest is banned', async function () {
      this.sinon.stub(BackgroundFlow.prototype, '_redirectFrame').callsFake(() => {
        auth._storage.saveState('unique', {error: {code: 'access_denied'}});
      });

      try {
        await auth.init();
      } catch (reject) {
        // Background loading
        BackgroundFlow.prototype._redirectFrame.should.have.been.
          calledWithMatch(sinon.match.any, 'api/rest/oauth2/auth?response_type=token&state=unique' +
            '&redirect_uri=http%3A%2F%2Flocalhost%3A8080%2Fhub&request_credentials=silent' +
            '&client_id=1-1-1-1-1&scope=0-0-0-0-0%20youtrack');

        // Fallback redirect after background fail
        Auth.prototype._redirectCurrentPage.should.have.been.
          calledWith('api/rest/oauth2/auth?response_type=token&state=unique' +
            '&redirect_uri=http%3A%2F%2Flocalhost%3A8080%2Fhub&request_credentials=default' +
            '&client_id=1-1-1-1-1&scope=0-0-0-0-0%20youtrack');

        TokenValidator.prototype._getValidatedToken.should.have.been.calledOnce;

        reject.code.should.deep.equal({code: 'access_denied'});
      }
    });
  });

  describe('requestToken', () => {
    beforeEach(function () {
      this.sinon.stub(Auth.prototype, '_redirectCurrentPage');
      this.sinon.stub(Auth.prototype, 'getUser').resolves({id: 'APIuser'});
      this.sinon.stub(Auth.prototype, '_saveCurrentService');
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
        expires: TokenValidator._epoch() + 60 * 60,
        scopes: ['0-0-0-0-0']
      });
      const token = await this.auth.requestToken();
      token.should.be.equal('token');
    });

    it('should get token in iframe if there is no valid token', async function () {
      this.sinon.stub(BackgroundFlow.prototype, '_redirectFrame').callsFake(() => {
        this.auth._storage.saveToken({
          access_token: 'token',
          expires: TokenValidator._epoch() + 60 * 60,
          scopes: ['0-0-0-0-0']
        });
      });
      const accessToken = await this.auth.requestToken();
      BackgroundFlow.prototype._redirectFrame.should.have.been.
        calledWithMatch(sinon.match.any, 'api/rest/oauth2/auth?response_type=token&state=unique' +
          '&redirect_uri=http%3A%2F%2Flocalhost%3A8080%2Fhub&request_credentials=silent' +
          '&client_id=1-1-1-1-1&scope=0-0-0-0-0%20youtrack');

      // Assert fails in IE for some reason
      if (sniffer.browser.name !== 'ie' && sniffer.browser.name !== 'edge') {
        Auth.prototype._redirectCurrentPage.should.not.have.been.called;
      }

      accessToken.should.be.equal('token');
    });

    it('should reload page', async function () {
      this.auth.user = {id: 'initUser'};
      this.sinon.stub(BackgroundFlow.prototype, '_redirectFrame').callsFake(() => {
        this.auth._storage.saveToken({
          access_token: 'token',
          expires: TokenValidator._epoch() + 60 * 60,
          scopes: ['0-0-0-0-0']
        });
      });
      const accessToken = await this.auth.requestToken();
      BackgroundFlow.prototype._redirectFrame.should.have.been.
        calledWithMatch(sinon.match.any, 'api/rest/oauth2/auth?response_type=token' +
          '&state=unique&redirect_uri=http%3A%2F%2Flocalhost%3A8080%2Fhub' +
          '&request_credentials=silent&client_id=1-1-1-1-1&scope=0-0-0-0-0%20youtrack');
      Auth.prototype._redirectCurrentPage.should.have.been.calledWith(window.location.href);
      accessToken.should.be.equal('token');
    });

    it('should redirect current page if get token in iframe fails', async function () {
      this.auth._backgroundFlow._timeout = 100;
      this.sinon.stub(BackgroundFlow.prototype, '_redirectFrame');
      try {
        await this.auth.requestToken();
      } catch (reject) {
        BackgroundFlow.prototype._redirectFrame.should.have.been.
          calledWithMatch(sinon.match.any, 'api/rest/oauth2/auth?response_type=token&state=unique' +
            '&redirect_uri=http%3A%2F%2Flocalhost%3A8080%2Fhub&request_credentials=silent' +
            '&client_id=1-1-1-1-1&scope=0-0-0-0-0%20youtrack');
        Auth.prototype._redirectCurrentPage.should.have.been.calledWith('api/rest/oauth2/auth' +
          '?response_type=token&state=unique&redirect_uri=http%3A%2F%2Flocalhost%3A8080%2Fhub' +
          '&request_credentials=default&client_id=1-1-1-1-1&scope=0-0-0-0-0%20youtrack');

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

      this.sinon.stub(Auth.prototype, 'getUser').resolves({name: 'APIuser'});
      this.sinon.stub(Auth.prototype, '_saveCurrentService');
    });

    it('should return existing user', async () => {
      auth._initDeferred = {};
      auth._initDeferred.promise = Promise.resolve();

      auth.user = {name: 'existingUser'};

      const user = await auth.requestUser();
      Auth.prototype.getUser.should.not.have.been.called;
      user.should.equal(auth.user);
    });

    it('should get user from API', async function () {
      auth._initDeferred = {};
      auth._initDeferred.promise = Promise.resolve();

      this.sinon.stub(Auth.prototype, 'requestToken').resolves('token');

      const user = await auth.requestUser();
      Auth.prototype.getUser.should.have.been.calledOnce;
      user.should.deep.equal({name: 'APIuser'});
    });

    it('should wait for user saved during validation', async () => {
      await auth._storage.saveToken({
        access_token: 'token',
        expires: TokenValidator._epoch() + 60 * 60,
        scopes: ['0-0-0-0-0']
      });
      await auth._tokenValidator.validateToken();

      const user = await auth.requestUser();
      Auth.prototype.getUser.should.have.been.calledOnce;
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
      auth._initDeferred = {};
      auth._initDeferred.promise = Promise.resolve();

      this.sinon.stub(HTTP.prototype, 'authorizedFetch').resolves({name: 'APIuser'});
    });

    it('should not return existing user', async () => {
      auth.user = {name: 'existingUser'};

      const user = await auth.getUser();

      user.should.deep.equal({name: 'APIuser'});
    });

    it('should get user from API', async () => {
      const user = await auth.getUser('token');
      HTTP.prototype.authorizedFetch.should.have.been.calledOnce;
      const matchParams = sinon.match({
        query: {
          fields: 'guest,id,name,profile/avatar/url'
        }
      });
      HTTP.prototype.authorizedFetch.should.have.been.
        calledWithMatch('users/me', 'token', matchParams);
      user.should.deep.equal({name: 'APIuser'});
    });
  });

  describe('login', () => {
    const auth = new Auth({
      serverUri: ''
    });

    beforeEach(function () {
      this.sinon.stub(BackgroundFlow.prototype, 'authorize').
        returns(Promise.resolve('token'));
      this.sinon.stub(Auth.prototype, '_saveCurrentService');
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

      auth.listeners.trigger.should.have.been.
        calledWithMatch('userChange', sinon.match({name: 'APIuser'}));
    });

    it('should update user in instance', async function () {
      const APIuser = {name: 'APIuser'};
      this.sinon.stub(Auth.prototype, 'getUser').resolves(APIuser);

      const user = {name: 'existingUser'};
      auth.user = user;

      await auth.login();

      auth.user.should.equal(APIuser);
    });

    it('should call _beforeLogout for guest', async function () {
      this.sinon.stub(Auth.prototype, '_beforeLogout');
      this.sinon.stub(Auth.prototype, 'getUser').resolves({guest: true});
      await auth.login();

      auth._beforeLogout.should.have.been.calledOnce;
    });

    it('should call _beforeLogout on reject', async function () {
      this.sinon.stub(Auth.prototype, '_beforeLogout');
      this.sinon.stub(Auth.prototype, 'getUser').rejects();
      await auth.login();

      auth._beforeLogout.should.have.been.calledOnce;
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
      Auth.prototype._redirectCurrentPage.should.have.been.
        calledWith(
          'api/rest/oauth2/auth?response_type=token&' +
          'state=unique&redirect_uri=http%3A%2F%2Flocalhost%3A8080%2Fhub&' +
          'request_credentials=required&client_id=1-1-1-1-1&scope=0-0-0-0-0%20youtrack'
        );

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
      Auth.prototype._redirectCurrentPage.should.have.been.
        calledWith(
          'api/rest/oauth2/auth?response_type=token&' +
          'state=unique&redirect_uri=http%3A%2F%2Flocalhost%3A8080%2Fhub&' +
          'request_credentials=required&client_id=1-1-1-1-1&scope=0-0-0-0-0%20youtrack&' +
          'message=access%20denied'
        );
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
});
