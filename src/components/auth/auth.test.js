describe('auth', function () {
  var Auth = require('./auth');

  describe('construction', function () {
    it('should require provide config', function () {
      expect(function() {
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
      var config = {
        serverUri: 'http://localhost/'
      };
      var auth = new Auth(config);

      auth.config.serverUri.should.equal(config.serverUri);
      auth.config.should.contain.keys(Object.keys(Auth.DEFAULT_CONFIG));
    });
  });

  describe('redirect', function () {
    var config = {'serverUri': 'http://localhost:1214'};
    var auth;

    beforeEach(function () {
      sinon.stub(Auth.prototype, '_defaultRedirectHandler');
      auth = new Auth(config);
    });

    afterEach(function () {
      Auth.prototype._defaultRedirectHandler.restore();
    });

    it('should not redirect on object construction', function() {
      auth._defaultRedirectHandler.should.not.have.been.called;
    });

    it('should redirect on init call', function() {
      auth.init();

      auth._defaultRedirectHandler.should.have.been.called;
      auth._defaultRedirectHandler.should.have.been.calledWithMatch(config.serverUri);
    });
  });

});