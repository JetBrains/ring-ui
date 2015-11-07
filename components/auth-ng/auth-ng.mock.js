/**
 * TODO(maksimrv): Remove this code
 * It need now because permission does not work without auth.
 * But we can not stub correct auth component and should mock all provider
 */
export default function AuthProviderMock() {
  this.$get = function ($q) {
    const promise = $q.resolve([]);

    return {
      auth: {
        requestToken: function () {
          return promise;
        },
        /** @deprecated */
        getSecure: function () {
          return promise;
        },
        getApi: function () {
          return promise;
        }
      },
      promise: promise
    };
  };
}
