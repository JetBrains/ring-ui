(function () {
  'use strict';

  var auth = ring('auth');

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
      var authFuture;
      this.config = function (config) {
        // Authorize
        //   redirects to /oauth if it's required,
        //   parses oauth response if any
        authFuture = auth('init', config);
      };

      this.$get = ['$injector', function ($injector) {
        return $injector.instantiate(['$location', '$http', function ($location, $http) {
          authFuture.done(function (absUrl) {
            if (absUrl) {
              var authConfig = auth.get('config');
              // Extracting relative path from absolute
              var path = absUrl.split(authConfig.redirect_uri);

              if (path[1]) {
                $location.url(path[1]).replace();
              }
            }
          });

          return {
            'installAuthHeader': function () {
              // Install Authorization header getter
              $http.defaults.headers.common['Authorization'] = function () {
                return 'Bearer ' + auth('getToken');
              };
            },
            'getUser': function () {
              return auth('getUser');
            }
          };
        }]);
      }];
    }]);
}());
