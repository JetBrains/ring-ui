// @ts-expect-error no typings available
import mockedWindow from 'storage-mock';

import {act} from 'react';

import HTTP from '../http/http';
import LocalStorage from '../storage/storage__local';

import type {Stub} from '../../test-helpers/globals.d';

import Auth, {USER_CHANGED_EVENT, LOGOUT_EVENT, AuthUser} from './auth';
import AuthRequestBuilder from './request-builder';
import AuthResponseParser, {AuthError} from './response-parser';
import BackgroundFlow from './background-flow';
import TokenValidator, {TokenValidationError} from './token-validator';

const HOUR = 3600;

describe('Auth', () => {
  beforeEach(() => {
    sandbox.stub(window, 'addEventListener').
      value((...args: unknown[]) => mockedWindow.addEventListener(...args));
    sandbox.stub(window, 'removeEventListener').
      value((...args: unknown[]) => mockedWindow.removeEventListener(...args));
    sandbox.stub(window, 'localStorage').value(mockedWindow.localStorage);
    sandbox.stub(window, 'sessionStorage').value(mockedWindow.sessionStorage);
    localStorage.clear();
    sessionStorage.clear();
  });

  describe('construction', () => {
    it('should require provide config', () => {
      // @ts-expect-error testing a wrong usage
      (() => new Auth()).should.throw(Error, 'Config is required');
    });

    it('should throw on unsupported params usage', () => {
      (() => new Auth({
        serverUri: 'value',
        /* eslint-disable camelcase */
        // @ts-expect-error testing a wrong usage
        redirect_uri: 'value',
        request_credentials: 'value',
        client_id: 'value'
        /* eslint-enable camelcase */
      })).
        should.
        throw(Error, 'The following parameters are no longer supported: redirect_uri, request_credentials, client_id. Please change them from snake_case to camelCase.');
    });

    it('should require provide server uri', () => {
      (() => new Auth({
        // @ts-expect-error testing a wrong usage
        serverUri: null
      })).should.throw(Error, '\"serverUri\" property is required');

      // @ts-expect-error testing a wrong usage
      (() => new Auth({})).
        should.throw(Error, '\"serverUri\" property is required');
    });

    it('should fix serverUri', () => {
      new Auth({serverUri: ''}).config.serverUri.should.equal('');
      new Auth({serverUri: 'http://localhost'}).config.serverUri.
        should.equal('http://localhost/');
      new Auth({serverUri: '.'}).config.serverUri.should.equal('./');
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

      const expectedParams = {
        query: {
          fields: 'guest,id,name,login,profile/avatar/url,profile/email'
        }
      };
      expectedParams.should.deep.equal(auth.config.userParams);
    });

    it('should not redirect on object construction', () => {
      sandbox.stub(Auth.prototype, '_redirectCurrentPage');
      // eslint-disable-next-line no-new
      new Auth({serverUri: ''});
      Auth.prototype._redirectCurrentPage.should.not.have.been.called;
    });

    it('should subscribe on logout if passed', () => {
      const onLogout = sandbox.stub();

      const auth = new Auth({
        serverUri: '',
        onLogout
      });

      auth.listeners.trigger(LOGOUT_EVENT);

      onLogout.should.have.been.called;
    });

    it('should perform redirect on userChange by default', () => {
      sandbox.stub(Auth.prototype, '_redirectCurrentPage');

      const auth = new Auth({serverUri: ''});
      auth.listeners.trigger(USER_CHANGED_EVENT);

      Auth.prototype._redirectCurrentPage.should.have.been.called;
    });

    it('should not perform redirect on userChange when reloadOnUserChange is false', () => {
      sandbox.stub(Auth.prototype, '_redirectCurrentPage');

      const auth = new Auth({
        reloadOnUserChange: false,
        serverUri: ''
      });
      auth.listeners.trigger(USER_CHANGED_EVENT);

      Auth.prototype._redirectCurrentPage.should.not.been.called;
    });

    it('should add preconnect link tag', () => {
      const config = {serverUri: 'http://url-to-preconnect.ru/'};
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const auth = new Auth(config);

      should.exist(
        document.querySelector(`[rel=preconnect][href="${config.serverUri}"]`)
      );
    });
  });

  describe('init', () => {
    let auth = new Auth({
      serverUri: '',
      redirect: true,
      redirectUri: 'http://localhost:8080/hub',
      clientId: '1-1-1-1-1',
      scope: ['0-0-0-0-0', 'youtrack'],
      optionalScopes: ['youtrack']
    });

    beforeEach(() => {
      sandbox.stub(Auth.prototype, 'getUser').resolves({login: 'user'});
      sandbox.stub(Auth.prototype, 'setHash');
    });

    afterEach(async () => {
      await Promise.all([auth._storage?.cleanStates(), auth._storage?.wipeToken()]);
    });

    it('should resolve to undefined if there is a valid token', async () => {
      await auth._storage?.saveToken({
        accessToken: 'token',
        expires: TokenValidator._epoch() + HOUR,
        scopes: ['0-0-0-0-0']
      });
      auth.init().should.eventually.be.undefined;
    });

    it('should fetch auth response from query parameters', async () => {
      const frozenTime = TokenValidator._epoch();

      sandbox.stub(AuthResponseParser.prototype, 'getLocation').
        returns('http://localhost:8080/hub' +
          '#access_token=2YotnFZFEjr1zCsicMWpAA&state=xyz&token_type=example&expires_in=3600');
      sandbox.stub(TokenValidator, '_epoch').returns(frozenTime);

      auth = new Auth({
        serverUri: '',
        redirectUri: 'http://localhost:8080/hub',
        clientId: '1-1-1-1-1',
        scope: ['0-0-0-0-0', 'youtrack'],
        optionalScopes: ['youtrack']
      });
      await auth._storage?.saveState('xyz', {
        restoreLocation: 'http://localhost:8080/hub/users',
        scopes: ['0-0-0-0-0']
      });
      const restoreLocation = await auth.init();
      'http://localhost:8080/hub/users'.should.be.equal(restoreLocation);
      const token = await auth._storage?.getToken();
      const expectedToken = {
        accessToken: '2YotnFZFEjr1zCsicMWpAA',
        scopes: ['0-0-0-0-0'],
        expires: frozenTime + HOUR,
        lifeTime: 3600
      };
      expectedToken.should.be.deep.equal(token);
    });

    it('should not throw error if user does not have state in local storage', () => {
      sandbox.stub(AuthResponseParser.prototype, 'getLocation').
        returns('http://localhost:8080/hub' +
          '#access_token=000&state=state&token_type=token&expires_in=3600');

      auth = new Auth({
        serverUri: '',
        redirectUri: 'http://localhost:8080/hub',
        clientId: '1-1-1-1-1',
        scope: ['0-0-0-0-0', 'youtrack'],
        optionalScopes: ['youtrack']
      });

      return auth.init().should.be.fulfilled;
    });

    it('should redirect to auth when there is no valid token', async () => {
      sandbox.stub(Auth.prototype, '_redirectCurrentPage');
      sandbox.stub(AuthRequestBuilder, '_uuid').returns('unique');

      auth = new Auth({
        serverUri: '',
        redirect: true,
        redirectUri: 'http://localhost:8080/hub',
        clientId: '1-1-1-1-1',
        scope: ['0-0-0-0-0', 'youtrack'],
        optionalScopes: ['youtrack'],
        waitForRedirectTimeout: 0
      });
      try {
        await act(() => auth.init());
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (reject: any) {
        Auth.prototype._redirectCurrentPage.
          should.be.calledWith('api/rest/oauth2/auth?response_type=token' +
          '&state=unique&redirect_uri=http%3A%2F%2Flocalhost%3A8080%2Fhub' +
          '&request_credentials=default&client_id=1-1-1-1-1' +
          '&scope=0-0-0-0-0%20youtrack');
        reject.authRedirect.should.be.true;
      }
    });

    it('should clear location hash if cleanHash = true', async () => {
      sandbox.stub(Auth.prototype, '_redirectCurrentPage');
      sandbox.stub(AuthRequestBuilder, '_uuid').returns('unique');
      sandbox.stub(AuthResponseParser.prototype, 'getAuthResponseFromURL').
        returns({});

      auth = new Auth({
        serverUri: '',
        redirect: true,
        cleanHash: true,
        waitForRedirectTimeout: 0
      });

      try {
        await auth.init();
      } catch (e) {
        auth.setHash.should.have.been.calledWith('');
      }
    });

    it(
      'should not clear location hash if cleanHash = true and there is nothing to clear',
      async () => {
        sandbox.stub(Auth.prototype, '_redirectCurrentPage');
        sandbox.stub(AuthRequestBuilder, '_uuid').returns('unique');

        auth = new Auth({
          serverUri: '',
          redirect: true,
          cleanHash: true,
          waitForRedirectTimeout: 0
        });

        try {
          await auth.init();
        } catch (e) {
          auth.setHash.should.not.have.been.called;
        }
      }
    );

    it('should not clear location hash if cleanHash = false', async () => {
      sandbox.stub(Auth.prototype, '_redirectCurrentPage');
      sandbox.stub(AuthRequestBuilder, '_uuid').returns('unique');
      sandbox.stub(AuthResponseParser.prototype, 'getAuthResponseFromURL').
        returns({});

      auth = new Auth({
        serverUri: '',
        redirect: true,
        cleanHash: false,
        waitForRedirectTimeout: 0
      });

      try {
        await auth.init();
      } catch (e) {
        auth.setHash.should.not.have.been.called;
      }

    });

    it('should pass through request_credentials value', async () => {
      sandbox.stub(Auth.prototype, '_redirectCurrentPage');
      sandbox.stub(AuthRequestBuilder, '_uuid').returns('unique');

      auth = new Auth({
        serverUri: '',
        redirect: true,
        redirectUri: 'http://localhost:8080/hub',
        requestCredentials: 'skip',
        waitForRedirectTimeout: 0
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
    let auth: Auth;
    let _getValidatedToken: Stub<TokenValidator['_getValidatedToken']>;

    beforeEach(() => {
      _getValidatedToken = sandbox.stub(TokenValidator.prototype, '_getValidatedToken').
        returns(Promise.reject(new TokenValidationError('error')));
      sandbox.stub(Auth.prototype, '_redirectCurrentPage');
      sandbox.stub(Auth.prototype, 'getUser');
      sandbox.stub(AuthRequestBuilder, '_uuid').returns('unique');

      auth = new Auth({
        serverUri: '',
        redirect: false,
        redirectUri: 'http://localhost:8080/hub',
        clientId: '1-1-1-1-1',
        scope: ['0-0-0-0-0', 'youtrack'],
        optionalScopes: ['youtrack'],
        waitForRedirectTimeout: 0
      });

      if (auth._storage != null) {
        auth._storage._tokenStorage = auth._storage._stateStorage =
        auth._storage._messagesStorage = new LocalStorage();
      }

      if (auth._domainStorage != null) {
        auth._domainStorage._messagesStorage = new LocalStorage();
      }
    });

    it('should initiate when there is no valid token', async () => {
      _getValidatedToken.onCall(1).
        returns(Promise.resolve('token'));

      sandbox.stub(BackgroundFlow.prototype, '_redirectFrame').callsFake(() => {
        auth._storage?.saveToken({
          accessToken: 'token',
          expires: TokenValidator._epoch() + HOUR,
          scopes: ['0-0-0-0-0'],
          waitForRedirectTimeout: 0
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

    it('should initiate and fall back to redirect when token check fails', async () => {
      sandbox.stub(BackgroundFlow.prototype, '_redirectFrame').callsFake(() => {
        auth._storage?.saveToken({
          accessToken: 'token',
          expires: TokenValidator._epoch() + HOUR,
          scopes: ['0-0-0-0-0']
        });
      });

      try {
        await act(() => auth.init());
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (reject: any) {
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

    it('should initiate and fall back to redirect when guest is banned', async () => {
      sandbox.stub(BackgroundFlow.prototype, '_redirectFrame').callsFake(() => {
        auth._storage?.saveState('unique', {error: new AuthError({error: 'access_denied'})});
      });

      try {
        await act(() => auth.init());
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (reject: any) {
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
    let auth: Auth;
    beforeEach(() => {
      sandbox.stub(Auth.prototype, '_redirectCurrentPage');
      sandbox.stub(Auth.prototype, 'getUser').resolves({id: 'APIuser'});
      sandbox.stub(Auth.prototype, '_checkBackendsAreUp');
      sandbox.stub(AuthRequestBuilder, '_uuid').returns('unique');

      auth = new Auth({
        serverUri: '',
        redirectUri: 'http://localhost:8080/hub',
        clientId: '1-1-1-1-1',
        scope: ['0-0-0-0-0', 'youtrack'],
        optionalScopes: ['youtrack'],
        embeddedLogin: true
      });

      if (auth._storage != null) {
        auth._storage._tokenStorage = new LocalStorage();
      }
      auth.setAuthDialogService(() => () => {});
      auth._initDeferred?.resolve?.();
    });

    afterEach(async () => {
      await Promise.all([auth._storage?.cleanStates(), auth._storage?.wipeToken()]);
    });

    it('should resolve to access token if there is a valid one', async () => {
      await auth._storage?.saveToken({
        accessToken: 'token',
        expires: TokenValidator._epoch() + HOUR,
        scopes: ['0-0-0-0-0']
      });
      const token = await auth.requestToken();
      'token'.should.be.equal(token);
    });

    it('should get token in iframe if there is no valid token', async () => {
      sandbox.stub(BackgroundFlow.prototype, '_redirectFrame').callsFake(() => {
        auth._storage?.saveToken({
          accessToken: 'token',
          expires: TokenValidator._epoch() + HOUR,
          scopes: ['0-0-0-0-0']
        });
      });
      const accessToken = await auth.requestToken();
      BackgroundFlow.prototype._redirectFrame.should.have.been.
        calledWithMatch(sinon.match.any, 'api/rest/oauth2/auth?response_type=token&state=unique' +
          '&redirect_uri=http%3A%2F%2Flocalhost%3A8080%2Fhub&request_credentials=silent' +
          '&client_id=1-1-1-1-1&scope=0-0-0-0-0%20youtrack');

      'token'.should.be.equal(accessToken);
    });

    it('should show userchanged overlay if token was changed', async () => {
      auth.user = {id: 'initUser'} as AuthUser;
      sandbox.stub(BackgroundFlow.prototype, '_redirectFrame').callsFake(() => {
        auth._storage?.saveToken({
          accessToken: 'token',
          expires: TokenValidator._epoch() + HOUR,
          scopes: ['0-0-0-0-0']
        });
      });
      sandbox.stub(Auth.prototype, '_showUserChangedDialog');

      const accessToken = await auth.requestToken();
      // _detectUserChange is called by localStorage event in real life
      await auth._detectUserChange('token');

      BackgroundFlow.prototype._redirectFrame.should.have.been.
        calledWithMatch(sinon.match.any, 'api/rest/oauth2/auth?response_type=token' +
          '&state=unique&redirect_uri=http%3A%2F%2Flocalhost%3A8080%2Fhub' +
          '&request_credentials=silent&client_id=1-1-1-1-1&scope=0-0-0-0-0%20youtrack');
      auth._showUserChangedDialog.should.have.been.called;
      'token'.should.be.equal(accessToken);
    });

    it('should reload page if user change was applied', () => {
      auth.user = {id: 'initUser'} as AuthUser;
      auth.listeners.trigger(USER_CHANGED_EVENT);
      Auth.prototype._redirectCurrentPage.should.have.been.calledWith(window.location.href);
    });

    it('should redirect current page if get token in iframe fails', async () => {
      auth.config.embeddedLogin = false;
      if (auth._backgroundFlow != null) {
        auth._backgroundFlow._timeout = 100;
      }
      sandbox.stub(BackgroundFlow.prototype, '_redirectFrame');

      try {
        await auth.requestToken();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (reject: any) {
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

    it('should show login overlay if token refresh fails and window login enabled', async () => {
      const TIMEOUT = 100;
      if (auth._backgroundFlow != null) {
        auth._backgroundFlow._timeout = TIMEOUT;
      }
      sandbox.stub(BackgroundFlow.prototype, '_redirectFrame');
      sandbox.stub(Auth.prototype, '_showAuthDialog');

      auth.requestToken();

      await new Promise<void>(resolve => setTimeout(() => {
        Auth.prototype._showAuthDialog.should.have.been.called;
        resolve();
      }, TIMEOUT * 2));
    });
  });

  describe('requestUser', () => {
    let auth: Auth;

    beforeEach(() => {
      auth = new Auth({
        serverUri: '',
        redirectUri: 'http://localhost:8080/hub',
        clientId: '1-1-1-1-1',
        scope: ['0-0-0-0-0', 'youtrack'],
        optionalScopes: ['youtrack']
      });

      sandbox.stub(Auth.prototype, 'getUser').resolves({name: 'APIuser'});
    });

    it('should return existing user', async () => {
      auth._initDeferred = {};
      auth._initDeferred.promise = Promise.resolve();

      auth.user = {name: 'existingUser'} as AuthUser;

      const user = await auth.requestUser();
      Auth.prototype.getUser.should.not.have.been.called;
      user.should.equal(auth.user);
    });

    it('should get user from API', async () => {
      auth._initDeferred = {};
      auth._initDeferred.promise = Promise.resolve();

      sandbox.stub(Auth.prototype, 'requestToken').resolves('token');

      const user = await auth.requestUser();
      Auth.prototype.getUser.should.have.been.calledOnce;
      user.should.deep.equal({name: 'APIuser'});
    });

    it('should wait for user saved during validation', async () => {
      await auth._storage?.saveToken({
        accessToken: 'token',
        expires: TokenValidator._epoch() + HOUR,
        scopes: ['0-0-0-0-0']
      });
      await auth._tokenValidator?.validateToken();

      const user = await auth.requestUser();
      Auth.prototype.getUser.should.have.been.calledOnce;
      user.should.deep.equal({name: 'APIuser'});
    });
  });

  describe('getUser', () => {
    let auth: Auth;

    beforeEach(() => {
      auth = new Auth({
        serverUri: '',
        redirectUri: 'http://localhost:8080/hub',
        clientId: '1-1-1-1-1',
        scope: ['0-0-0-0-0', 'youtrack'],
        optionalScopes: ['youtrack']
      });
      auth._initDeferred = {};
      auth._initDeferred.promise = Promise.resolve();

      sandbox.stub(HTTP.prototype, 'authorizedFetch').resolves({name: 'APIuser'});
    });

    it('should not return existing user', async () => {
      auth.user = {name: 'existingUser'} as AuthUser;

      const user = await auth.getUser();

      user.should.deep.equal({name: 'APIuser'});
    });

    it('should get user from API', async () => {
      const user = await auth.getUser('token');
      HTTP.prototype.authorizedFetch.should.have.been.calledOnce;
      const matchParams = sinon.match({
        query: {
          fields: 'guest,id,name,login,profile/avatar/url'
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

    beforeEach(() => {
      sandbox.stub(BackgroundFlow.prototype, 'authorize').
        returns(Promise.resolve('token'));
      sandbox.stub(Auth.prototype, '_checkBackendsAreUp');
      sandbox.stub(Auth.prototype, LOGOUT_EVENT);
      sandbox.stub(auth.listeners, 'trigger');
    });

    it('should call getUser', async () => {
      sandbox.stub(Auth.prototype, 'getUser');

      await auth.login();

      auth.getUser.should.have.been.calledWith('token');
    });

    it('should trigger userChange', async () => {
      sandbox.stub(Auth.prototype, 'getUser').returns(Promise.resolve({name: 'APIuser'}));

      await auth.login();

      auth.listeners.trigger.should.have.been.
        calledWithMatch(USER_CHANGED_EVENT, sinon.match({name: 'APIuser'}));
    });

    it('should update user in instance', async () => {
      const APIuser = {name: 'APIuser'};
      sandbox.stub(Auth.prototype, 'getUser').resolves(APIuser);

      auth.user = {name: 'existingUser'} as AuthUser;

      await auth.login();

      auth.user.should.equal(APIuser);
    });

    it('should call _beforeLogout for guest', async () => {
      sandbox.stub(Auth.prototype, '_beforeLogout');
      sandbox.stub(Auth.prototype, 'getUser').resolves({guest: true});
      await auth.login();

      auth._beforeLogout.should.have.been.calledOnce;
    });

    it('should call _beforeLogout on reject', async () => {
      sandbox.stub(Auth.prototype, '_beforeLogout');
      sandbox.stub(Auth.prototype, 'getUser').rejects();
      await auth.login();

      auth._beforeLogout.should.have.been.calledOnce;
    });
  });

  describe('Logout', () => {
    const auth = new Auth({
      serverUri: '',
      redirectUri: 'http://localhost:8080/hub',
      clientId: '1-1-1-1-1',
      scope: ['0-0-0-0-0', 'youtrack'],
      optionalScopes: ['youtrack']
    });

    beforeEach(() => {
      sandbox.stub(Auth.prototype, '_redirectCurrentPage');
      sandbox.stub(Auth.prototype, '_checkBackendsAreUp');
      sandbox.stub(AuthRequestBuilder, '_uuid').returns('unique');
    });

    it('should clear access token and redirect to logout', async () => {
      await auth.logout();
      Auth.prototype._redirectCurrentPage.should.have.been.
        calledWith(
          'api/rest/oauth2/auth?response_type=token&' +
          'state=unique&redirect_uri=http%3A%2F%2Flocalhost%3A8080%2Fhub&' +
          'request_credentials=required&client_id=1-1-1-1-1&scope=0-0-0-0-0%20youtrack'
        );

      const storedToken = await auth._storage?.getToken();
      should.not.exist(storedToken);

      const state = await auth._storage?.getState('unique');
      should.exist(state);
      state?.should.contain.all.keys({
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

    it('should fail pass when onLogout returns rejected promise', async () => {
      const onLogout = sandbox.spy();
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

    it('should fail pass when onLogout returns rejected promise', async () => {
      const onLogout = sandbox.spy();
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
