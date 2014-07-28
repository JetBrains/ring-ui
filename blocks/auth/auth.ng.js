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
    provider('auth', ['$hhtpProvider', function ($httpProvider) {
      var authFuture;
      var authConfig = {};
      this.config = function (config, doNotInstallHeader) {
        authConfig = config;
        // Authorize
        //   redirects to /oauth if it's required,
        //   parses oauth response if any
        authFuture = auth('init', config);

        authFuture.done(function (absUrl) {
          authConfig = auth.get('config');

          if (absUrl) {
            // Skipping common prefix
            for (var i = 0, minLength = Math.min(absUrl.length, authConfig.redirect_uri.length) + 1; i < minLength; i++) {
              if (absUrl.charAt(i) !== authConfig.redirect_uri.charAt(i)) {
                $location.url(absUrl.substring(i - 1)).replace();
                break;
              }
            }
          }

          if (!doNotInstallHeader) {
            // Install Authorization header getter
            $httpProvider.defaults.headers.common['Authorization'] = function () {
              return 'Bearer ' + auth('getToken', true);
            };
          }
        });

        return $q.when(authFuture);
      };

      this.$get = ['$location', '$http', '$q', function ($location, $http, $q) {
        return {
          'installAuthHeader': function () {
            // TODO: Remove me (header is installed on provider config phase)
          },
          'getUser': function () {
            return auth('getUser');
          },
          'getClientId': function () {
            return authConfig['client_id'];
          },
          'initDone': function () {
            //@Deprecated (use promise from config method)
            //TODO: Remove!!!
            return $q.when(authFuture);
          }
        };
      }];
    }]);
}());
