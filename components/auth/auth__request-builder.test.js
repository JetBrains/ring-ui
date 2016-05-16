/* eslint-disable camelcase */
import AuthRequestBuilder from './auth__request-builder';

describe('Auth', () => {
  describe('AuthRequestBuilder', () => {

    describe('encodeURL', () => {
      it('should build URL correctly', () => {
        AuthRequestBuilder.encodeURL('http://localhost:8080/hub', {
          a: 'a',
          b: 'b'
        }).
          should.be.equal('http://localhost:8080/hub?a=a&b=b');
      });

      it('should accept relative URI', () => {
        AuthRequestBuilder.encodeURL('hub', {a: 'a', b: 'b'}).
          should.be.equal('hub?a=a&b=b');
      });

      it('should not encode nulls and undefineds', () => {
        AuthRequestBuilder.encodeURL('hub', {a: 'a', b: null, c: undefined, d: '', e: false}).
          should.be.equal('hub?a=a&d=&e=false');
      });

      it('should handle already existing query parameters', () => {
        AuthRequestBuilder.encodeURL('hub?c=c', {a: 'a', b: 'b'}).
          should.be.equal('hub?c=c&a=a&b=b');
      });

      it('should encode query parameters', () => {
        AuthRequestBuilder.encodeURL('hub', {'i am naughty': 'with%23some+problems'}).
          should.be.equal('hub?i%20am%20naughty=with%2523some%2Bproblems');
      });
    });

    describe('prepareAuthRequest', () => {
      const config = {
        authorization: 'https://sso.jetbrains.com/auth',
        redirect_uri: 'http://localhost:8080',
        request_credentials: 'default',
        client_id: '0-0-0-0-0',
        scopes: ['youtrack', 'teamcity', 'vcs settings']
      };
      beforeEach(function () {
        this.sinon.stub(AuthRequestBuilder, '_uuid').returns('unique');
        this.sinon.stub(AuthRequestBuilder.prototype, '_saveState', () => Promise.resolve());
      });

      it('should return correct URL', () => {
        const builder = new AuthRequestBuilder(config);
        const expected = 'https://sso.jetbrains.com/auth?response_type=token&' +
          'state=unique&redirect_uri=http%3A%2F%2Flocalhost%3A8080&request_credentials=default&client_id=0-0-0-0-0&scope=youtrack%20teamcity%20vcs%2520settings';
        return builder.prepareAuthRequest().should.become({
          url: expected,
          stateId: 'unique'
        });

      });

      it('should save state', () => {
        const builder = new AuthRequestBuilder(config);
        return builder.prepareAuthRequest().
          then(() => {
            AuthRequestBuilder.prototype._saveState.should.have.been.calledWith('unique', {
              restoreLocation: window.location.href,
              scopes: ['youtrack', 'teamcity', 'vcs settings']
            });
          });
      });

      it('should save extra state', () => {
        const builder = new AuthRequestBuilder(config);
        return builder.prepareAuthRequest(null, {nonRedirect: true}).
          then(() => {
            AuthRequestBuilder.prototype._saveState.should.have.been.calledWith('unique', {
              restoreLocation: window.location.href,
              nonRedirect: true,
              scopes: ['youtrack', 'teamcity', 'vcs settings']
            });
          });
      });


      it('should return correct URL with extra parameters', () => {
        const builder = new AuthRequestBuilder(config);
        const expected = 'https://sso.jetbrains.com/auth?response_type=token&state=unique&' +
          'redirect_uri=http%3A%2F%2Flocalhost%3A8080&request_credentials=required&' +
          'client_id=0-0-0-0-0&scope=youtrack%20teamcity%20vcs%2520settings';
        return builder.prepareAuthRequest({request_credentials: 'required'}).should.become({
          url: expected,
          stateId: 'unique'
        });
      });
    });
  });
});
