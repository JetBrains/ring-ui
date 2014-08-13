'use strict';

var Auth = require('auth/auth');

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

    $httpProvider.interceptors.push([function () {
      var urlEndsWith = function(config, suffix) {
        return config && config.url && config.url.indexOf(suffix) === config.url.length - suffix.length;
      };

      return {
        'request': function (config) {
          if (urlEndsWith(config, '.ng.html') || urlEndsWith(config, '.tpl.html')) {
            // Don't intercept angular template requests
            return config;
          }
          return authInitPromise.
            then(function () {
              return auth.requestToken();
            }).
            then(function (accessToken) {
              config.headers['Authorization'] = 'Bearer ' + accessToken;
              return config;
            });
        }
      };
    }]);
  };

  this.$get = ['$location', function ($location) {
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
      logout: auth.logout.bind(auth)
    };
  }];
}]);

module.exports = authModule;