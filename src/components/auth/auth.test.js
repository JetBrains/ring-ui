describe('auth', function () {
  var Auth = require('./auth');

  describe('construction', function () {
    it('should require provide config', function () {
      expect(function () {
        return new Auth();
      }).toThrow(new Error('Config is required'));
    });

    it('should require provide server uri', function () {
      expect(function () {
        return new Auth({
          serverUri: ''
        });
      }).toThrow(new Error('Property serverUri is required'));
    });

    it('should fix serverUri', function () {
      expect(new Auth({serverUri: 'http://localhost'}).config.serverUri).toEqual('http://localhost/');
      expect(new Auth({serverUri: '.'}).config.serverUri).toEqual('./');
    });

    it('should merge passed config with default config', function () {
      var config = {
        serverUri: 'http://localhost/'
      };
      var auth = new Auth(config);

      expect(auth.config.serverUri).toEqual(config.serverUri);
      expect(auth.config).toEqual(jasmine.objectContaining(Auth.DEFAULT_CONFIG));
    });
  });

  describe('redirect', function () {
    var config = {'serverUri': 'http://localhost:1214'};
    var auth;

    beforeEach(function () {
      spyOn(Auth.prototype, 'defaultRedirectHandler');
      auth = new Auth(config);
    });

    it('should not redirect on object construction', function() {
      expect(auth.defaultRedirectHandler).not.toHaveBeenCalled();
    });

    it('should redirect on init call', function() {
      auth.init();

      expect(auth.defaultRedirectHandler).toHaveBeenCalled();
      expect(auth.defaultRedirectHandler.calls.mostRecent().args[0]).toMatch(config.serverUri);
    });
  });

});