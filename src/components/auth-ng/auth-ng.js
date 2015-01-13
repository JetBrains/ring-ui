'use strict';

var Auth = require('auth/auth');

/* global angular: false */
var authModule = angular.module('Ring.auth', []);

/**
 * Configure:
 * @example
 * <pre>
 * angular.config(["authProvider", function (authProvider) {
 *   authProvider.config({
 *     serverUri: "***REMOVED***",
 *     client_id: '0-0-0-0-0',
 *     scope: ["0-0-0-0-0"],
 *     cleanHash: false //prevents infinite redirecting on angular>1.2.26
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
   * @param {{
   *   serverUri: string,
   *   redirect_uri: string?,
   *   client_id: string?,
   *   scope: string[]?,
   *   cleanHash: boolean?
   * }} config
   */
  this.config = function (config) {
    auth = new Auth(config);
  };

  $httpProvider.interceptors.push(['auth', function (auth) {
    var urlEndsWith = function(config, suffix) {
      return config && config.url && config.url.indexOf(suffix) === config.url.length - suffix.length;
    };

    return {
      'request': function (config) {
        if (!auth || urlEndsWith(config, '.html')) {
          // Don't intercept angular template requests
          return config;
        }
        return auth.promise.
          then(function () {
            return auth.auth.requestToken();
          }).
          then(function (accessToken) {
            config.headers['Authorization'] = 'Bearer ' + accessToken;
            return config;
          });
      }
    };
  }]);

  this.$get = ['$injector', '$log', function ($injector, $log) {
    // Do not try to init anything without config
    if (!auth) {
      $log.warn('Auth wasn\'t initialized');
      return null;
    }

    /**
     * @type Promise.<string>
     */
    var authInitPromise = auth.init();

    /**
     * @param {string?} restoreLocationURL
     */
    var restoreLocation = function (restoreLocationURL) {
      if (restoreLocationURL) {
        var baseURI = auth.config.redirect_uri;

        var bases = document.getElementsByTagName('base');
        if (bases.length > 0) {
          baseURI = bases[0].href;
        }

        if (restoreLocationURL.indexOf(baseURI) === 0) {
          var relativeURI = restoreLocationURL.substr(baseURI.length);
          $injector.get('$location').url(relativeURI).replace();
        }
      }
    };
    authInitPromise.then(restoreLocation, function (e) {
      if (!e.authRedirect) {
        console.error(e);
      }
    });

    return {
      auth: auth,
      requestUser: auth.requestUser.bind(auth),
      clientId: auth.config.client_id,
      logout: auth.logout.bind(auth),
      promise: authInitPromise
    };
  }];
}]);

module.exports = authModule;
