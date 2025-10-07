/* eslint-disable no-underscore-dangle */
// @ts-expect-error no typings available
import mockedWindow from 'storage-mock';
import {act} from 'react';
import {type MockInstance} from 'vitest';

import HTTP from '../http/http';
import LocalStorage from '../storage/storage-local';
import Auth, {USER_CHANGED_EVENT, LOGOUT_EVENT, type AuthUser} from './auth';
import AuthRequestBuilder from './request-builder';
import AuthResponseParser, {AuthError} from './response-parser';
import BackgroundFlow from './background-flow';
import TokenValidator, {TokenValidationError} from './token-validator';

const HOUR = 3600;

describe('Auth', () => {
  beforeEach(() => {
    vi.spyOn(window, 'addEventListener').mockImplementation((...args: unknown[]) =>
      mockedWindow.addEventListener(...args),
    );
    vi.spyOn(window, 'removeEventListener').mockImplementation((...args: unknown[]) =>
      mockedWindow.removeEventListener(...args),
    );
    vi.stubGlobal('localStorage', mockedWindow.localStorage);
    vi.stubGlobal('sessionStorage', mockedWindow.sessionStorage);
    localStorage.clear();
    sessionStorage.clear();
  });

  describe('construction', () => {
    it('should require provide config', () => {
      // @ts-expect-error testing a wrong usage
      expect(() => new Auth()).to.throw(Error, 'Config is required');
    });

    it('should throw on unsupported params usage', () => {
      expect(
        () =>
          new Auth({
            serverUri: 'value',

            // @ts-expect-error testing a wrong usage
            redirect_uri: 'value',
            request_credentials: 'value',
            client_id: 'value',
          }),
      ).to.throw(
        Error,
        'The following parameters are no longer supported: redirect_uri, request_credentials, client_id. Please change them from snake_case to camelCase.',
      );
    });

    it('should require provide server uri', () => {
      expect(
        () =>
          new Auth({
            // @ts-expect-error testing a wrong usage
            serverUri: null,
          }),
      ).to.throw(Error, '"serverUri" property is required');

      // @ts-expect-error testing a wrong usage
      expect(() => new Auth({})).to.throw(Error, '"serverUri" property is required');
    });

    it('should fix serverUri', () => {
      expect(new Auth({serverUri: ''}).config.serverUri).to.equal('');
      expect(new Auth({serverUri: 'http://localhost'}).config.serverUri).to.equal('http://localhost/');
      expect(new Auth({serverUri: '.'}).config.serverUri).to.equal('./');
    });

    it('should merge passed config with default config', () => {
      const config = {
        serverUri: 'http://localhost/',
      };

      const auth = new Auth(config);

      expect(auth.config.serverUri).to.equal(config.serverUri);
      expect(auth.config).to.contain.keys(Object.keys(Auth.DEFAULT_CONFIG));
    });

    it('should set config.userParams with proper fields property', () => {
      const config = {
        serverUri: 'http://localhost/',
        userFields: ['name', 'profile/email'],
      };
      const auth = new Auth(config);

      const expectedParams = {
        query: {
          fields: 'guest,id,name,login,profile/avatar/url,profile/email',
        },
      };
      expect(expectedParams).to.deep.equal(auth.config.userParams);
    });

    it('should not redirect on object construction', () => {
      vi.spyOn(Auth.prototype, '_redirectCurrentPage').mockReturnValue();
      // eslint-disable-next-line no-new
      new Auth({serverUri: ''});
      expect(Auth.prototype._redirectCurrentPage).not.toHaveBeenCalled();
    });

    it('should subscribe on logout if passed', () => {
      const onLogout = vi.fn();

      const auth = new Auth({
        serverUri: '',
        onLogout,
      });

      auth.listeners.trigger(LOGOUT_EVENT);

      expect(onLogout).toHaveBeenCalled();
    });

    it('should perform redirect on userChange by default', () => {
      vi.useFakeTimers({toFake: ['setTimeout']});
      vi.spyOn(Auth.prototype, '_redirectCurrentPage').mockReturnValue();

      const auth = new Auth({serverUri: ''});
      auth.listeners.trigger(USER_CHANGED_EVENT);
      vi.advanceTimersByTime(0);

      expect(Auth.prototype._redirectCurrentPage).toHaveBeenCalled();
    });

    it('should not perform redirect on userChange when reloadOnUserChange is false', () => {
      vi.useFakeTimers({toFake: ['setTimeout']});
      vi.spyOn(Auth.prototype, '_redirectCurrentPage').mockReturnValue();

      const auth = new Auth({
        reloadOnUserChange: false,
        serverUri: '',
      });
      auth.listeners.trigger(USER_CHANGED_EVENT);
      vi.advanceTimersByTime(0);

      expect(Auth.prototype._redirectCurrentPage).not.toHaveBeenCalled;
    });

    it('should add preconnect link tag', () => {
      const config = {serverUri: 'http://url-to-preconnect.ru/'};

      const _auth = new Auth(config);

      expect(document.querySelector(`[rel=preconnect][href="${config.serverUri}"]`)).to.exist;
    });
  });

  describe('init', () => {
    let auth = new Auth({
      serverUri: '',
      redirect: true,
      redirectUri: 'http://localhost:8080/hub',
      clientId: '1-1-1-1-1',
      scope: ['0-0-0-0-0', 'youtrack'],
      optionalScopes: ['youtrack'],
    });

    beforeEach(() => {
      vi.spyOn(Auth.prototype, 'getUser').mockResolvedValue({login: 'user'});
      vi.spyOn(Auth.prototype, 'setHash').mockReturnValue();
    });

    afterEach(async () => {
      await Promise.all([auth._storage?.cleanStates(), auth._storage?.wipeToken()]);
    });

    it('should resolve to undefined if there is a valid token', async () => {
      await auth._storage?.saveToken({
        accessToken: 'token',
        expires: TokenValidator._epoch() + HOUR,
        scopes: ['0-0-0-0-0'],
      });
      expect(auth.init()).to.eventually.be.undefined;
    });

    it('should fetch auth response from query parameters', async () => {
      const frozenTime = TokenValidator._epoch();

      vi.spyOn(AuthResponseParser.prototype, 'getLocation').mockReturnValue(
        'http://localhost:8080/hub' +
          '#access_token=2YotnFZFEjr1zCsicMWpAA&state=xyz&token_type=example&expires_in=3600',
      );
      vi.spyOn(TokenValidator, '_epoch').mockReturnValue(frozenTime);

      auth = new Auth({
        serverUri: '',
        redirectUri: 'http://localhost:8080/hub',
        clientId: '1-1-1-1-1',
        scope: ['0-0-0-0-0', 'youtrack'],
        optionalScopes: ['youtrack'],
      });
      await auth._storage?.saveState('xyz', {
        restoreLocation: 'http://localhost:8080/hub/users',
        scopes: ['0-0-0-0-0'],
      });
      const restoreLocation = await auth.init();
      expect('http://localhost:8080/hub/users').to.be.equal(restoreLocation);
      const token = await auth._storage?.getToken();
      const expectedToken = {
        accessToken: '2YotnFZFEjr1zCsicMWpAA',
        scopes: ['0-0-0-0-0'],
        expires: frozenTime + HOUR,
        lifeTime: 3600,
      };
      expect(expectedToken).to.be.deep.equal(token);
    });

    it('should throw error if user does not have state in local storage (RG-2380)', () => {
      vi.spyOn(AuthResponseParser.prototype, 'getLocation').mockReturnValue(
        'http://localhost:8080/hub#access_token=000&state=state&token_type=token&expires_in=3600',
      );

      auth = new Auth({
        serverUri: '',
        redirectUri: 'http://localhost:8080/hub',
        clientId: '1-1-1-1-1',
        scope: ['0-0-0-0-0', 'youtrack'],
        optionalScopes: ['youtrack'],
      });

      return expect(auth.init()).to.be.rejectedWith(Error, 'Could not create state where stateId="state');
    });

    it('should get target URL from state field, if valid URL (RG-2380)', () => {
      const origin = window.location.origin;
      vi.spyOn(AuthResponseParser.prototype, 'getLocation').mockReturnValue(
        `http://localhost:8080/hub#access_token=000&state=${origin}/test&token_type=token&expires_in=3600`,
      );

      auth = new Auth({
        serverUri: '',
        redirectUri: 'http://localhost:8080/hub',
        clientId: '1-1-1-1-1',
        scope: ['0-0-0-0-0', 'youtrack'],
        optionalScopes: ['youtrack'],
      });

      return expect(auth.init()).to.be.eventually.equal(`${origin}/test`);
    });

    it('should throw error if target URL from state field has different origin (RG-2380)', () => {
      vi.spyOn(AuthResponseParser.prototype, 'getLocation').mockReturnValue(
        'http://localhost:8080/hub#access_token=000&state=http://google.com/test&token_type=token&expires_in=3600',
      );

      auth = new Auth({
        serverUri: '',
        redirectUri: 'http://localhost:8080/hub',
        clientId: '1-1-1-1-1',
        scope: ['0-0-0-0-0', 'youtrack'],
        optionalScopes: ['youtrack'],
      });

      return expect(auth.init()).to.be.rejectedWith(
        Error,
        'State contains URL with different origin: "http://google.com/test"',
      );
    });

    it('should redirect to auth when there is no valid token', async () => {
      vi.spyOn(Auth.prototype, '_redirectCurrentPage').mockReturnValue();
      vi.spyOn(AuthRequestBuilder, '_uuid').mockReturnValue('unique');

      auth = new Auth({
        serverUri: '',
        redirect: true,
        redirectUri: 'http://localhost:8080/hub',
        clientId: '1-1-1-1-1',
        scope: ['0-0-0-0-0', 'youtrack'],
        optionalScopes: ['youtrack'],
        waitForRedirectTimeout: 0,
      });
      try {
        await act(() => auth.init());
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (reject: any) {
        expect(Auth.prototype._redirectCurrentPage).toHaveBeenCalledWith(
          'api/rest/oauth2/auth?response_type=token' +
            '&state=unique&redirect_uri=http%3A%2F%2Flocalhost%3A8080%2Fhub' +
            '&request_credentials=default&client_id=1-1-1-1-1' +
            '&scope=0-0-0-0-0%20youtrack',
        );
        expect(reject.authRedirect).to.be.true;
      }
    });

    it('should clear location hash if cleanHash = true', async () => {
      vi.spyOn(Auth.prototype, '_redirectCurrentPage').mockReturnValue();
      vi.spyOn(AuthRequestBuilder, '_uuid').mockReturnValue('unique');
      vi.spyOn(AuthResponseParser.prototype, 'getAuthResponseFromURL').mockReturnValue({});

      auth = new Auth({
        serverUri: '',
        redirect: true,
        cleanHash: true,
        waitForRedirectTimeout: 0,
      });

      try {
        await auth.init();
      } catch (e) {
        expect(auth.setHash).toHaveBeenCalledWith('');
      }
    });

    it('should not clear location hash if cleanHash = true and there is nothing to clear', async () => {
      vi.spyOn(Auth.prototype, '_redirectCurrentPage').mockReturnValue();
      vi.spyOn(AuthRequestBuilder, '_uuid').mockReturnValue('unique');

      auth = new Auth({
        serverUri: '',
        redirect: true,
        cleanHash: true,
        waitForRedirectTimeout: 0,
      });

      try {
        await auth.init();
      } catch (e) {
        expect(auth.setHash).not.toHaveBeenCalled;
      }
    });

    it('should not clear location hash if cleanHash = false', async () => {
      vi.spyOn(Auth.prototype, '_redirectCurrentPage').mockReturnValue();
      vi.spyOn(AuthRequestBuilder, '_uuid').mockReturnValue('unique');
      vi.spyOn(AuthResponseParser.prototype, 'getAuthResponseFromURL').mockReturnValue({});

      auth = new Auth({
        serverUri: '',
        redirect: true,
        cleanHash: false,
        waitForRedirectTimeout: 0,
      });

      try {
        await auth.init();
      } catch (e) {
        expect(auth.setHash).not.toHaveBeenCalled;
      }
    });

    it('should pass through request_credentials value', async () => {
      vi.spyOn(Auth.prototype, '_redirectCurrentPage').mockReturnValue();
      vi.spyOn(AuthRequestBuilder, '_uuid').mockReturnValue('unique');

      auth = new Auth({
        serverUri: '',
        redirect: true,
        redirectUri: 'http://localhost:8080/hub',
        requestCredentials: 'skip',
        waitForRedirectTimeout: 0,
      });
      try {
        await auth.init();
      } catch (e) {
        expect(Auth.prototype._redirectCurrentPage).toHaveBeenCalledWith(
          'api/rest/oauth2/auth?response_type=token&' +
            'state=unique&redirect_uri=http%3A%2F%2Flocalhost%3A8080%2Fhub' +
            '&request_credentials=skip&client_id=0-0-0-0-0&scope=0-0-0-0-0',
        );
      }
    });
  });

  describe('background init', () => {
    let auth: Auth;
    let _getValidatedToken: MockInstance<TokenValidator['_getValidatedToken']>;

    beforeEach(() => {
      _getValidatedToken = vi
        .spyOn(TokenValidator.prototype, '_getValidatedToken')
        .mockRejectedValue(new TokenValidationError('error'));
      vi.spyOn(Auth.prototype, '_redirectCurrentPage').mockReturnValue();
      vi.spyOn(Auth.prototype, 'getUser').mockResolvedValue(null);
      vi.spyOn(AuthRequestBuilder, '_uuid').mockReturnValue('unique');

      auth = new Auth({
        serverUri: '',
        redirect: false,
        redirectUri: 'http://localhost:8080/hub',
        clientId: '1-1-1-1-1',
        scope: ['0-0-0-0-0', 'youtrack'],
        optionalScopes: ['youtrack'],
        waitForRedirectTimeout: 0,
      });

      if (auth._storage) {
        auth._storage._tokenStorage = auth._storage._stateStorage = auth._storage._messagesStorage = new LocalStorage();
      }

      if (auth._domainStorage) {
        auth._domainStorage._messagesStorage = new LocalStorage();
      }
    });

    it('should initiate when there is no valid token', async () => {
      _getValidatedToken
        .mockReturnValueOnce(Promise.reject(new TokenValidationError('error')))
        .mockReturnValueOnce(Promise.resolve('token'));

      vi.spyOn(BackgroundFlow.prototype, '_redirectFrame').mockImplementation(() => {
        auth._storage?.saveToken({
          accessToken: 'token',
          expires: TokenValidator._epoch() + HOUR,
          scopes: ['0-0-0-0-0'],
          waitForRedirectTimeout: 0,
        });
      });

      await auth.init();

      expect(BackgroundFlow.prototype._redirectFrame).toHaveBeenCalledWith(
        expect.anything(),
        'api/rest/oauth2/auth?response_type=token&state=unique' +
          '&redirect_uri=http%3A%2F%2Flocalhost%3A8080%2Fhub&request_credentials=silent' +
          '&client_id=1-1-1-1-1&scope=0-0-0-0-0%20youtrack',
      );

      expect(Auth.prototype._redirectCurrentPage).not.toHaveBeenCalled;

      expect(TokenValidator.prototype._getValidatedToken).toHaveBeenCalledTimes(2);
    });

    it('should initiate and fall back to redirect when token check fails', async () => {
      vi.spyOn(BackgroundFlow.prototype, '_redirectFrame').mockImplementation(() => {
        auth._storage?.saveToken({
          accessToken: 'token',
          expires: TokenValidator._epoch() + HOUR,
          scopes: ['0-0-0-0-0'],
        });
      });

      try {
        await act(() => auth.init());
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (reject: any) {
        // Background loading
        expect(BackgroundFlow.prototype._redirectFrame).toHaveBeenCalledWith(
          expect.anything(),
          'api/rest/oauth2/auth?response_type=token' +
            '&state=unique&redirect_uri=http%3A%2F%2Flocalhost%3A8080%2Fhub' +
            '&request_credentials=silent&client_id=1-1-1-1-1&scope=0-0-0-0-0%20youtrack',
        );

        // Fallback redirect after second check fail
        expect(Auth.prototype._redirectCurrentPage).toHaveBeenCalledWith(
          'api/rest/oauth2/auth?response_type=token&state=unique' +
            '&redirect_uri=http%3A%2F%2Flocalhost%3A8080%2Fhub&request_credentials=default' +
            '&client_id=1-1-1-1-1&scope=0-0-0-0-0%20youtrack',
        );

        expect(TokenValidator.prototype._getValidatedToken).toHaveBeenCalledTimes(2);

        expect(reject.authRedirect).to.be.true;
      }
    });

    it('should initiate and fall back to redirect when guest is banned', async () => {
      vi.spyOn(BackgroundFlow.prototype, '_redirectFrame').mockImplementation(() => {
        auth._storage?.saveState('unique', {error: new AuthError({error: 'access_denied'})});
      });

      try {
        await act(() => auth.init());
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (reject: any) {
        // Background loading
        expect(BackgroundFlow.prototype._redirectFrame).toHaveBeenCalledWith(
          expect.anything(),
          'api/rest/oauth2/auth?response_type=token&state=unique' +
            '&redirect_uri=http%3A%2F%2Flocalhost%3A8080%2Fhub&request_credentials=silent' +
            '&client_id=1-1-1-1-1&scope=0-0-0-0-0%20youtrack',
        );

        // Fallback redirect after background fail
        expect(Auth.prototype._redirectCurrentPage).toHaveBeenCalledWith(
          'api/rest/oauth2/auth?response_type=token&state=unique' +
            '&redirect_uri=http%3A%2F%2Flocalhost%3A8080%2Fhub&request_credentials=default' +
            '&client_id=1-1-1-1-1&scope=0-0-0-0-0%20youtrack',
        );

        expect(TokenValidator.prototype._getValidatedToken).toHaveBeenCalledOnce;

        expect(reject.code).to.deep.equal({code: 'access_denied'});
      }
    });
  });

  describe('requestToken', () => {
    let auth: Auth;
    beforeEach(() => {
      vi.spyOn(Auth.prototype, '_redirectCurrentPage').mockReturnValue();
      vi.spyOn(Auth.prototype, 'getUser').mockResolvedValue({id: 'APIuser'});
      vi.spyOn(Auth.prototype, '_checkBackendsAreUp').mockResolvedValue([null, null]);
      vi.spyOn(AuthRequestBuilder, '_uuid').mockReturnValue('unique');

      auth = new Auth({
        serverUri: '',
        redirectUri: 'http://localhost:8080/hub',
        clientId: '1-1-1-1-1',
        scope: ['0-0-0-0-0', 'youtrack'],
        optionalScopes: ['youtrack'],
        embeddedLogin: true,
      });

      if (auth._storage) {
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
        scopes: ['0-0-0-0-0'],
      });
      const token = await auth.requestToken();
      expect('token').to.be.equal(token);
    });

    it('should get token in iframe if there is no valid token', async () => {
      vi.spyOn(BackgroundFlow.prototype, '_redirectFrame').mockImplementation(() => {
        auth._storage?.saveToken({
          accessToken: 'token',
          expires: TokenValidator._epoch() + HOUR,
          scopes: ['0-0-0-0-0'],
        });
      });
      const accessToken = await act(() => auth.requestToken());
      expect(BackgroundFlow.prototype._redirectFrame).toHaveBeenCalledWith(
        expect.anything(),
        'api/rest/oauth2/auth?response_type=token&state=unique' +
          '&redirect_uri=http%3A%2F%2Flocalhost%3A8080%2Fhub&request_credentials=silent' +
          '&client_id=1-1-1-1-1&scope=0-0-0-0-0%20youtrack',
      );

      expect('token').to.be.equal(accessToken);
    });

    it('should show userchanged overlay if token was changed', async () => {
      auth.user = {id: 'initUser'} as AuthUser;
      vi.spyOn(BackgroundFlow.prototype, '_redirectFrame').mockImplementation(() => {
        auth._storage?.saveToken({
          accessToken: 'token',
          expires: TokenValidator._epoch() + HOUR,
          scopes: ['0-0-0-0-0'],
        });
      });
      vi.spyOn(Auth.prototype, '_showUserChangedDialog').mockReturnValue();

      const accessToken = await auth.requestToken();
      // _detectUserChange is called by localStorage event in real life
      await auth._detectUserChange('token');

      expect(BackgroundFlow.prototype._redirectFrame).toHaveBeenCalledWith(
        expect.anything(),
        'api/rest/oauth2/auth?response_type=token' +
          '&state=unique&redirect_uri=http%3A%2F%2Flocalhost%3A8080%2Fhub' +
          '&request_credentials=silent&client_id=1-1-1-1-1&scope=0-0-0-0-0%20youtrack',
      );
      expect(auth._showUserChangedDialog).toHaveBeenCalled();
      expect('token').to.be.equal(accessToken);
    });

    it('should redirect current page if get token in iframe fails', async () => {
      auth.config.embeddedLogin = false;
      if (auth._backgroundFlow) {
        auth._backgroundFlow._timeout = 100;
      }
      vi.spyOn(BackgroundFlow.prototype, '_redirectFrame').mockReturnValue();

      try {
        await auth.requestToken();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (reject: any) {
        expect(BackgroundFlow.prototype._redirectFrame).toHaveBeenCalledWith(
          expect.anything(),
          'api/rest/oauth2/auth?response_type=token&state=unique' +
            '&redirect_uri=http%3A%2F%2Flocalhost%3A8080%2Fhub&request_credentials=silent' +
            '&client_id=1-1-1-1-1&scope=0-0-0-0-0%20youtrack',
        );
        expect(Auth.prototype._redirectCurrentPage).toHaveBeenCalledWith(
          'api/rest/oauth2/auth' +
            '?response_type=token&state=unique&redirect_uri=http%3A%2F%2Flocalhost%3A8080%2Fhub' +
            '&request_credentials=default&client_id=1-1-1-1-1&scope=0-0-0-0-0%20youtrack',
        );

        expect(reject.authRedirect).to.be.true;
      }
    });

    it('should show login overlay if token refresh fails and window login enabled', async () => {
      const TIMEOUT = 100;
      if (auth._backgroundFlow) {
        auth._backgroundFlow._timeout = TIMEOUT;
      }
      vi.spyOn(BackgroundFlow.prototype, '_redirectFrame').mockReturnValue();
      vi.spyOn(Auth.prototype, '_showAuthDialog').mockReturnValue();

      await act(() => {
        auth.requestToken();

        return new Promise<void>(resolve =>
          setTimeout(() => {
            expect(Auth.prototype._showAuthDialog).toHaveBeenCalled();
            resolve();
          }, TIMEOUT * 2),
        );
      });
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
        optionalScopes: ['youtrack'],
      });

      vi.spyOn(Auth.prototype, 'getUser').mockResolvedValue({name: 'APIuser'});
    });

    it('should return existing user', async () => {
      auth._initDeferred = {};
      auth._initDeferred.promise = Promise.resolve();

      auth.user = {name: 'existingUser'} as AuthUser;

      const user = await auth.requestUser();
      expect(Auth.prototype.getUser).not.toHaveBeenCalled;
      expect(user).to.equal(auth.user);
    });

    it('should get user from API', async () => {
      auth._initDeferred = {};
      auth._initDeferred.promise = Promise.resolve();

      vi.spyOn(Auth.prototype, 'requestToken').mockResolvedValue('token');

      const user = await auth.requestUser();
      expect(Auth.prototype.getUser).toHaveBeenCalledOnce;
      expect(user).to.deep.equal({name: 'APIuser'});
    });

    it('should wait for user saved during validation', async () => {
      await auth._storage?.saveToken({
        accessToken: 'token',
        expires: TokenValidator._epoch() + HOUR,
        scopes: ['0-0-0-0-0'],
      });
      await auth._tokenValidator?.validateToken();

      const user = await auth.requestUser();
      expect(Auth.prototype.getUser).toHaveBeenCalledOnce;
      expect(user).to.deep.equal({name: 'APIuser'});
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
        optionalScopes: ['youtrack'],
      });
      auth._initDeferred = {};
      auth._initDeferred.promise = Promise.resolve();

      vi.spyOn(HTTP.prototype, 'authorizedFetch').mockResolvedValue({name: 'APIuser'});
    });

    it('should not return existing user', async () => {
      auth.user = {name: 'existingUser'} as AuthUser;

      const user = await auth.getUser();

      expect(user).to.deep.equal({name: 'APIuser'});
    });

    it('should get user from API', async () => {
      const user = await auth.getUser('token');
      expect(HTTP.prototype.authorizedFetch).toHaveBeenCalledOnce;
      const matchParams = expect.objectContaining({
        query: {
          fields: 'guest,id,name,login,profile/avatar/url',
        },
      });
      expect(HTTP.prototype.authorizedFetch).toHaveBeenCalledWith('users/me', 'token', matchParams);
      expect(user).to.deep.equal({name: 'APIuser'});
    });
  });

  describe('login', () => {
    const auth = new Auth({
      serverUri: '',
    });

    beforeEach(() => {
      vi.spyOn(BackgroundFlow.prototype, 'authorize').mockReturnValue(Promise.resolve('token'));
      vi.spyOn(Auth.prototype, '_checkBackendsAreUp').mockResolvedValue([null, null]);
      vi.spyOn(Auth.prototype, LOGOUT_EVENT).mockResolvedValue(undefined);
      vi.spyOn(auth.listeners, 'trigger').mockResolvedValue([]);
    });

    it('should call getUser', async () => {
      vi.spyOn(Auth.prototype, 'getUser').mockResolvedValue(null);

      await auth.login();

      expect(auth.getUser).toHaveBeenCalledWith('token');
    });

    it('should trigger userChange', async () => {
      vi.spyOn(Auth.prototype, 'getUser').mockReturnValue(Promise.resolve({name: 'APIuser'}));

      await auth.login();

      expect(auth.listeners.trigger).toHaveBeenCalledWith(
        USER_CHANGED_EVENT,
        expect.objectContaining({name: 'APIuser'}),
      );
    });

    it('should update user in instance', async () => {
      const APIuser = {name: 'APIuser'};
      vi.spyOn(Auth.prototype, 'getUser').mockResolvedValue(APIuser);

      auth.user = {name: 'existingUser'} as AuthUser;

      await auth.login();

      expect(auth.user).to.equal(APIuser);
    });

    it('should call _beforeLogout for guest', async () => {
      vi.spyOn(Auth.prototype, '_beforeLogout').mockReturnValue();
      vi.spyOn(Auth.prototype, 'getUser').mockResolvedValue({guest: true});
      await act(() => auth.login());

      expect(auth._beforeLogout).toHaveBeenCalledOnce;
    });

    it('should call _beforeLogout on reject', async () => {
      vi.spyOn(Auth.prototype, '_beforeLogout').mockReturnValue();
      vi.spyOn(Auth.prototype, 'getUser').mockRejectedValue(undefined);
      await auth.login();

      expect(auth._beforeLogout).toHaveBeenCalledOnce;
    });
  });

  describe('Logout', () => {
    const auth = new Auth({
      serverUri: '',
      redirectUri: 'http://localhost:8080/hub',
      clientId: '1-1-1-1-1',
      scope: ['0-0-0-0-0', 'youtrack'],
      optionalScopes: ['youtrack'],
    });

    beforeEach(() => {
      vi.spyOn(Auth.prototype, '_redirectCurrentPage').mockReturnValue();
      vi.spyOn(Auth.prototype, '_checkBackendsAreUp').mockResolvedValue([null, null]);
      vi.spyOn(AuthRequestBuilder, '_uuid').mockReturnValue('unique');
    });

    it('should clear access token and redirect to logout', async () => {
      await auth.logout();
      expect(Auth.prototype._redirectCurrentPage).toHaveBeenCalledWith(
        'api/rest/oauth2/auth?response_type=token&' +
          'state=unique&redirect_uri=http%3A%2F%2Flocalhost%3A8080%2Fhub&' +
          'request_credentials=required&client_id=1-1-1-1-1&scope=0-0-0-0-0%20youtrack',
      );

      const storedToken = await auth._storage?.getToken();
      expect(storedToken).to.not.exist;

      const state = await auth._storage?.getState('unique');
      expect(state).to.exist;
      expect(state).to.contain.all.keys({
        restoreLocation: window.location.href,
        scopes: ['0-0-0-0-0', 'youtrack'],
      });
    });

    it('should pass error message to server', async () => {
      await auth.logout({
        message: 'access denied',
      });
      expect(Auth.prototype._redirectCurrentPage).toHaveBeenCalledWith(
        'api/rest/oauth2/auth?response_type=token&' +
          'state=unique&redirect_uri=http%3A%2F%2Flocalhost%3A8080%2Fhub&' +
          'request_credentials=required&client_id=1-1-1-1-1&scope=0-0-0-0-0%20youtrack&' +
          'message=access%20denied',
      );
    });

    it('should logout when no onLogout passed', () => expect(auth.logout()).to.be.fulfilled);

    it('should fail pass when onLogout mockReturnValue rejected promise', async () => {
      const onLogout = vi.fn();
      const logoutAuth = new Auth({
        serverUri: '',
        onLogout,
      });

      await logoutAuth.logout();
      expect(onLogout).toHaveBeenCalledOnce;
    });

    it('should fail pass when onLogout mockReturnValue rejected promise', () => {
      const logoutAuth = new Auth({
        serverUri: '',
        onLogout: () => Promise.reject(),
      });

      return expect(logoutAuth.logout()).to.be.rejected;
    });

    it('should logout when no onLogout passed', () => expect(auth.logout()).to.be.fulfilled);

    it('should fail pass when onLogout mockReturnValue rejected promise', async () => {
      const onLogout = vi.fn();
      const logoutAuth = new Auth({
        serverUri: '',
        onLogout,
      });

      await logoutAuth.logout();
      expect(onLogout).toHaveBeenCalledOnce;
    });

    it('should fail pass when onLogout mockReturnValue rejected promise', () => {
      const logoutAuth = new Auth({
        serverUri: '',
        onLogout: () => Promise.reject(),
      });

      return expect(logoutAuth.logout()).to.be.rejected;
    });
  });
});
