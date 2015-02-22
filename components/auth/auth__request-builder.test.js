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
        scopes: ['youtrack', 'teamcity']
      };
      beforeEach(function () {
        sinon.stub(AuthRequestBuilder, '_uuid').returns('unique');
        sinon.stub(AuthRequestBuilder.prototype, '_saveState', function () {
          return when.resolve();
        });
      });
      afterEach(function () {
        AuthRequestBuilder._uuid.restore();
        AuthRequestBuilder.prototype._saveState.restore();
      });

      it('should return correct URL', function () {
        var builder = new AuthRequestBuilder(config);
        var expected = 'https://sso.jetbrains.com/auth?response_type=token&' +
          'state=unique&redirect_uri=http%3A%2F%2Flocalhost%3A8080&request_credentials=default&client_id=0-0-0-0-0&scope=youtrack%20teamcity';
        return builder.prepareAuthRequest().should.eventually.be.equal(expected);
      });

      it('should save state', function () {
        var builder = new AuthRequestBuilder(config);
        return builder.prepareAuthRequest().
          then(function () {
            AuthRequestBuilder.prototype._saveState.should.have.been.calledWith('unique', {
              restoreLocation: window.location.href,
              scopes: ['youtrack', 'teamcity']
            });
          });

      });

      it('should return correct URL with extra parameters', function () {
        var builder = new AuthRequestBuilder(config);
        var expected = 'https://sso.jetbrains.com/auth?response_type=token&state=unique&' +
          'redirect_uri=http%3A%2F%2Flocalhost%3A8080&request_credentials=required&' +
          'client_id=0-0-0-0-0&scope=youtrack%20teamcity';
        return builder.prepareAuthRequest({request_credentials: 'required'}).should.eventually.be.equal(expected);
      });
    });
  });
});
