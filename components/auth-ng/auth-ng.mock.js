import httpMock from '../http/http.mock';

/**
 * TODO(maksimrv): Remove this code
 * It is currently required because permissions do not work without auth,
 * but we can't stub the correct auth component and should mock all providers.
 */
export default function AuthProviderMock() {
  this.$get = $q => {
    const promise = $q.resolve([]);

    return {
      auth: {
        addListener() {},
        requestToken() {
          return promise;
        },
        http: httpMock
      },
      promise
    };
  };
}
