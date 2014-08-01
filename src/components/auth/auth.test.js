describe('auth', function () {
  var Auth = require('./auth');
  var $ = require('jquery');

  var callNew = function (fun) {
    var args = Array.prototype.slice.call(arguments, 1);
    return function () {
      function F() {
        return fun.apply(this, args);
      }

      F.prototype = fun.prototype;
      return new F();
    };
  };


  beforeEach(function () {
  });

  describe('init', function () {
    it('should provide config', function () {
      expect(callNew(Auth)).toThrow('Config is required');
      expect(callNew(Auth, {})).toThrow('Property serverUri is required');
      expect(callNew(Auth, {serverUri: ''})).toThrow('Property serverUri is required');
    });
    it('should fix serverUri', function () {
      expect(new Auth({serverUri: 'http://localhost'}).config.serverUri).toEqual('http://localhost/');
      expect(new Auth({serverUri: '.'}).config.serverUri).toEqual('./');
    });
    it('should add defaults', function () {
      var config = {
        serverUri: 'http://localhost/'
      };
      expect(new Auth(config).config).toEqual($.extend({}, Auth.DEFAULT_CONFIG, config));

      config.redirect_uri = 'http://redirect.to';
      config.client_id = '7-7-7-7-7';
      expect(new Auth(config).config).toEqual($.extend({}, Auth.DEFAULT_CONFIG, config));

      config.redirect_uri = 'http://redirect.to';
      config.client_id = '7-7-7-7-7';
      config.scope = ['test', 'test2'];
      expect(new Auth(config).config).toEqual($.extend({scope: ['test1', 'test2', '0-0-0-0-0']}, Auth.DEFAULT_CONFIG, config));
    });
  });

});