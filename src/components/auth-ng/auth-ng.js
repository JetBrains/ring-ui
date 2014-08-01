'use strict';

var Auth = require('../auth/auth');

/* global angular: false */
var authModule = angular.module('Ring.auth', []);

/**
 * Configure:
 * <pre>
 * angular.config(["authProvider", function (authProvider) {
 *   authProvider.config({
 *     serverUri: "***REMOVED***",
 *     client_id: '0-0-0-0-0',
 *     scope: ["0-0-0-0-0"]
 *   });
 * }]);
 * </pre>
 */
authModule.provider('auth', ['$httpProvider', function ($httpProvider) {
  /**
   * @type Auth
   */
  var auth;

  /**
   * @type Promise.<string>
   */
  var authInitPromise;

  /**
   * @param {{
   *   serverUri: string,
   *   redirect_uri: string?,
   *   client_id: string?,
   *   scope: string[]?
   * }} config
   */
  this.config = function (config) {
    auth = new Auth(config);
    authInitPromise = auth.init();

    authInitPromise.done(function () {
      // TODO: add interceptor that would auth.requestToken()
      // Install Authorization header getter
      $httpProvider.defaults.headers.common['Authorization'] = function () {
        // TODO: it is nonsense
        return 'Bearer ' + auth.requestToken();
      };
    });
  };

  this.$get = ['$location', '$http', '$q', function ($location, $http, $q) {
    /**
     * @param {string?} restoreLocationURL
     */
    var restoreLocation = function (restoreLocationURL) {
      if (restoreLocationURL) {
        var redirectUri = auth.config.redirect_uri;
        var minLength = Math.min(restoreLocationURL.length, redirectUri.length) + 1;

        // Skipping common prefix
        for (var i = 0; i < minLength; i++) {
          if (restoreLocationURL.charAt(i) !== redirectUri.charAt(i)) {
            $location.url(restoreLocationURL.substring(i - 1)).replace();
            break;
          }
        }
      }
    };
    authInitPromise.done(restoreLocation);

    return {
      requestUser: auth.requestUser.bind(auth),
      clientId: auth.config.client_id,
      initPromise: $q.when(authInitPromise)
    };
  }];
}]);

module.exports = authModule;