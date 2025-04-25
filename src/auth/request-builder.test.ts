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
        sandbox.stub(AuthRequestBuilder, '_uuid').returns('unique');
        sandbox.stub(AuthRequestBuilder.prototype, '_saveState').callsFake(() => Promise.resolve());
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
        expect(AuthRequestBuilder.prototype._saveState).to.have.been.calledWith('unique', {
          restoreLocation: window.location.href,
          scopes: ['youtrack', 'teamcity', 'vcs settings'],
        });
      });

      it('should save extra state', async () => {
        const builder = new AuthRequestBuilder(config);
        await builder.prepareAuthRequest(null, {nonRedirect: true});
        expect(AuthRequestBuilder.prototype._saveState).to.have.been.calledWith('unique', {
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
        // eslint-disable-next-line camelcase
        return expect(builder.prepareAuthRequest({request_credentials: 'required'})).to.become({
          url: expected,
          stateId: 'unique',
        });
      });
    });
  });
});
