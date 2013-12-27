(function () {
  'use strict';

  /**
   * Configure:
   * <pre>
   * angular.config(["authProvider", function (authProvider) {
   *   authProvider.config({
   *     clientId: '0-0-0-0-0',
   *     serverUri: "***REMOVED***",
   *     scope: ["0-0-0-0-0"],
   *     refresh: true
   *   });
   * }]);
   * </pre>
   *
   * Use:
   * <pre>
   * angular.run(['auth', function (auth) {
   *   auth.installAuthHeader();
   * }]);
   * </pre>
   */
  angular.module('Ring.auth', []).
    provider('auth', [function () {
      var authConfig;
      var authFuture;
      this.config = function (config) {
        authConfig = config;

        // Authorize
        //   redirects to /oauth if it's required,
        //   parses oauth response if any
        authFuture = ring('auth', 'init')(authConfig);
      };

      this.$get = ['$injector', function ($injector) {
        return $injector.instantiate(['$location', '$http', function ($location, $http) {
          authFuture.done(function (absUrl) {
            if (absUrl && authConfig.redirectUri) {
              // Extracting relative path from absolute
              var path = absUrl.split(authConfig.redirectUri);

              if (path[1]) {
                $location.path(path[1]);
              }
            }
          });

          return {
            'installAuthHeader': function () {
              // Install Authorization header getter
              $http.defaults.headers.common['Authorization'] = function () {
                return 'Bearer ' + ring('auth', 'getToken')();
              };
            },
            'getUser': function () {
              return ring('auth', 'getUser')();
            }
          };
        }]);
      }];
    }]);
}());
