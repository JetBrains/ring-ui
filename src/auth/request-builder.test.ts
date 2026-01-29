import AuthRequestBuilder from './request-builder';

describe('Auth', () => {
  describe('AuthRequestBuilder', () => {
    describe('prepareAuthRequest', () => {
      const config = {
        authorization: 'https://sso.jetbrains.com/auth',
        redirectUri: 'http://localhost:8080',
        requestCredentials: 'default',
        clientId: '0-0-0-0-0',
        scopes: ['youtrack', 'teamcity', 'vcs settings'],
      };
      beforeEach(() => {
        vi.spyOn(AuthRequestBuilder, '_uuid').mockReturnValue('unique');
        vi.spyOn(AuthRequestBuilder.prototype, '_saveState').mockImplementation(() => Promise.resolve());
      });

      it('should return correct URL', () => {
        const builder = new AuthRequestBuilder(config);
        const expected =
          'https://sso.jetbrains.com/auth?response_type=token&' +
          'state=unique&redirect_uri=http%3A%2F%2Flocalhost%3A8080&request_credentials=default' +
          '&client_id=0-0-0-0-0&scope=youtrack%20teamcity%20vcs%2520settings';
        return expect(builder.prepareAuthRequest()).to.become({
          url: expected,
          stateId: 'unique',
        });
      });

      it('should save state', async () => {
        const builder = new AuthRequestBuilder(config);
        await builder.prepareAuthRequest();
        // eslint-disable-next-line no-underscore-dangle
        expect(AuthRequestBuilder.prototype._saveState).toHaveBeenCalledWith('unique', {
          restoreLocation: window.location.href,
          scopes: ['youtrack', 'teamcity', 'vcs settings'],
        });
      });

      it('should save extra state', async () => {
        const builder = new AuthRequestBuilder(config);
        await builder.prepareAuthRequest(null, {nonRedirect: true});
        // eslint-disable-next-line no-underscore-dangle
        expect(AuthRequestBuilder.prototype._saveState).toHaveBeenCalledWith('unique', {
          restoreLocation: window.location.href,
          nonRedirect: true,
          scopes: ['youtrack', 'teamcity', 'vcs settings'],
        });
      });

      it('should return correct URL with extra parameters', () => {
        const builder = new AuthRequestBuilder(config);
        const expected =
          'https://sso.jetbrains.com/auth?response_type=token&state=unique&' +
          'redirect_uri=http%3A%2F%2Flocalhost%3A8080&request_credentials=required&' +
          'client_id=0-0-0-0-0&scope=youtrack%20teamcity%20vcs%2520settings';

        return expect(builder.prepareAuthRequest({request_credentials: 'required'})).to.become({
          url: expected,
          stateId: 'unique',
        });
      });
    });

    describe('prepareLogoutRequest', () => {
      const config = {
        authorization: 'https://sso.jetbrains.com/auth',
        logout: 'https://sso.jetbrains.com/logout',
        redirectUri: 'http://localhost:8080',
        clientId: '0-0-0-0-0',
        scopes: ['youtrack', 'teamcity'],
      };

      beforeEach(() => {
        vi.spyOn(AuthRequestBuilder, '_uuid').mockReturnValue('unique');
      });

      it('should return correct logout URL', () => {
        const builder = new AuthRequestBuilder(config);
        const expected =
          'https://sso.jetbrains.com/logout?' +
          'post_logout_redirect_uri=http%3A%2F%2Flocalhost%3A8080&' +
          'client_id=0-0-0-0-0&' +
          'state=unique';

        const result = builder.prepareLogoutRequest();
        expect(result).to.deep.equal({
          url: expected,
          state: 'unique',
        });
      });

      it('should return correct logout URL with extra parameters', () => {
        const builder = new AuthRequestBuilder(config);
        const expected =
          'https://sso.jetbrains.com/logout?' +
          'post_logout_redirect_uri=http%3A%2F%2Flocalhost%3A8080&' +
          'client_id=0-0-0-0-0&' +
          'state=unique&' +
          'message=access%20denied';

        const result = builder.prepareLogoutRequest({message: 'access denied'});
        expect(result).to.deep.equal({
          url: expected,
          state: 'unique',
        });
      });

      it('should throw error when logout URL is not configured', () => {
        const configWithoutLogout = {
          authorization: 'https://sso.jetbrains.com/auth',
          redirectUri: 'http://localhost:8080',
          clientId: '0-0-0-0-0',
          scopes: ['youtrack'],
        };
        const builder = new AuthRequestBuilder(configWithoutLogout);
        expect(() => builder.prepareLogoutRequest()).to.throw('Logout URL is not configured');
      });
    });
  });
});
