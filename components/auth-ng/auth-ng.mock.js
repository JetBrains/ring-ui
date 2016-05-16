/**
 * TODO(maksimrv): Remove this code
 * It need now because permission does not work without auth.
 * But we can not stub correct auth component and should mock all provider
 */
export default function AuthProviderMock() {
  this.$get = $q => {
    const promise = $q.resolve([]);

    return {
      auth: {
        requestToken() {
          return promise;
        },
        /** @deprecated */
        getSecure() {
          return promise;
        },
        getApi() {
          return promise;
        }
      },
      promise
    };
  };
}
