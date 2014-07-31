describe('auth', function () {
  var Auth = require('./auth');

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
    });
    it('should fix serverUri', function () {
      expect(new Auth({serverUri: 'http://localhost'}).config).toEqual({serverUri: 'http://localhost/'});
    });
  });

});