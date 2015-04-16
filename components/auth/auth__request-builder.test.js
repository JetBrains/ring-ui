/* eslint-disable google-camelcase/google-camelcase */
describe('Auth', function () {
  describe('AuthRequestBuilder', function () {
    var AuthRequestBuilder = require('./auth__request-builder');
    var when = require('when');

    describe('encodeURL', function () {
      it('should build URL correctly', function () {
        AuthRequestBuilder.encodeURL('http://localhost:8080/hub', {
          a: 'a',
          b: 'b'
        }).
          should.be.equal('http://localhost:8080/hub?a=a&b=b');
      });

      it('should accept relative URI', function () {
        AuthRequestBuilder.encodeURL('hub', {a: 'a', b: 'b'}).
          should.be.equal('hub?a=a&b=b');
      });

      it('should not encode nulls and undefineds', function () {
        AuthRequestBuilder.encodeURL('hub', {a: 'a', b: null, c: undefined, d: '', e: false}).
          should.be.equal('hub?a=a&d=&e=false');
      });

      it('should handle already existing query parameters', function () {
        AuthRequestBuilder.encodeURL('hub?c=c', {a: 'a', b: 'b'}).
          should.be.equal('hub?c=c&a=a&b=b');
      });

      it('should encode query parameters', function () {
        AuthRequestBuilder.encodeURL('hub', {'i am naughty': 'with%23some+problems'}).
          should.be.equal('hub?i%20am%20naughty=with%2523some%2Bproblems');
      });
    });

    describe('prepareAuthRequest', function () {
      var config = {
        authorization: 'https://sso.jetbrains.com/auth',
        redirect_uri: 'http://localhost:8080',
        request_credentials: 'default',
        client_id: '0-0-0-0-0',
        scopes: ['youtrack', 'teamcity', 'vcs settings']
      };
      beforeEach(function () {
        this.sinon.stub(AuthRequestBuilder, '_uuid').returns('unique');
        this.sinon.stub(AuthRequestBuilder.prototype, '_saveState', function () {
          return when.resolve();
        });
      });

      it('should return correct URL', function () {
        var builder = new AuthRequestBuilder(config);
        var expected = 'https://sso.jetbrains.com/auth?response_type=token&' +
          'state=unique&redirect_uri=http%3A%2F%2Flocalhost%3A8080&request_credentials=default&client_id=0-0-0-0-0&scope=youtrack%20teamcity%20vcs%2520settings';
        return builder.prepareAuthRequest().should.become({
          url: expected,
          stateId: 'unique'
        });

      });

      it('should save state', function () {
        var builder = new AuthRequestBuilder(config);
        return builder.prepareAuthRequest().
          then(function () {
            AuthRequestBuilder.prototype._saveState.should.have.been.calledWith('unique', {
              restoreLocation: window.location.href,
              scopes: ['youtrack', 'teamcity', 'vcs settings']
            });
          });
      });

      it('should save extra state', function () {
        var builder = new AuthRequestBuilder(config);
        return builder.prepareAuthRequest(null, {nonRedirect: true}).
          then(function () {
            AuthRequestBuilder.prototype._saveState.should.have.been.calledWith('unique', {
              restoreLocation: window.location.href,
              nonRedirect: true,
              scopes: ['youtrack', 'teamcity', 'vcs settings']
            });
          });
      });


      it('should return correct URL with extra parameters', function () {
        var builder = new AuthRequestBuilder(config);
        var expected = 'https://sso.jetbrains.com/auth?response_type=token&state=unique&' +
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
