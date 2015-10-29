/**
 * TODO(maksimrv): Remove this code
 * It need now because permission does not work without auth.
 * But we can not stub correct auth component and should mock all provider
 */
var AuthProviderMock = function () {
  this.$get = function ($q) {
    var defer = $q.defer();
    defer.resolve([]);

    return {
      auth: {
        requestToken: function () {
          return defer.promise;
        },
        /** @deprecated */
        getSecure: function () {
          return defer.promise;
        },
        getApi: function () {
          return defer.promise;
        }
      },
      promise: defer.promise
    };
  };
};

module.exports = AuthProviderMock;
