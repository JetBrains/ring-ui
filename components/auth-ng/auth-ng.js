var Auth = require('../auth/auth');
var pick = require('mout/object/pick');

/* global angular: false */
var authModule = angular.module('Ring.auth', []);

/**
 * @name Auth Ng
 * @description Angular wrapper for Auth
 * @example
 * <example name="Auth Ng">
    <file name="index.html">
      <div id="example"></div>
    </file>
    <file name="index.js" webpack="true">
      require('angular');
      require('ring-ui/components/analytics-ng/analytics-ng');

      angular.config(["authProvider", function (authProvider) {
        authProvider.config({
          serverUri: "***REMOVED***",
          client_id: '0-0-0-0-0',
          scope: ["0-0-0-0-0"],
        });
      }]);
    </file>
  </example>
 */
authModule.provider('auth', ['$httpProvider', function ($httpProvider) {
  /**
   * @type Auth
   */
  var auth;
  /**
   * @type {{cleanHash: boolean}} config
   */
  var defaultConfig = {
    cleanHash: false //prevents infinite redirect on angular>1.2.26
  };

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
    var configCopy = angular.extend({}, defaultConfig, config);
    auth = new Auth(configCopy);
  };

  $httpProvider.interceptors.push(['$q', '$injector', 'auth', function ($q, $injector, authInstance) {
    var urlEndsWith = function (config, suffix) {
      return config && config.url && config.url.indexOf(suffix) === config.url.length - suffix.length;
    };

    return {
      request: function (config) {
        if (!authInstance || urlEndsWith(config, '.html')) {
          // Don't intercept angular template requests
          return config;
        }
        return authInstance.promise.
          then(function () {
            return authInstance.auth.requestToken();
          }).
          then(function (accessToken) {
            config.headers.Authorization = 'Bearer ' + accessToken;
            return config;
          });
      },
      responseError: function (rejection) {
        if (authInstance && !urlEndsWith(rejection.config, '.html') &&
          rejection.data != null && Auth.shouldRefreshToken(rejection.data.error)) {

          // Use $injector to avoid circular dependency
          var $http = $injector.get('$http');

          return authInstance.auth.forceTokenUpdate().then(function () {
            return $http(pick(rejection.config, ['data', 'method', 'params', 'url']));
          });
        }

        return $q.reject(rejection);
      }
    };
  }]);

  /*@ngInject*/
  this.$get = function ($injector, $log, $sniffer) {
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
          var $location = $injector.get('$location');

          // We have to turn url with hash to simple relative url in HashbangInHtml5 mode
          // And there is no other and documented way to detect that mode
          // @see http://stackoverflow.com/a/16678065
          if ($location.$$html5 && !$sniffer.history) {
            relativeURI = relativeURI.replace(/^#\//, '');
          }

          $location.url(relativeURI).replace();
        }
      }
    };
    authInitPromise.then(restoreLocation, function (e) {
      if (!e.authRedirect) {
        $log.error(e);
      }
    });

    return {
      auth: auth,
      requestUser: auth.requestUser.bind(auth),
      clientId: auth.config.client_id,
      logout: auth.logout.bind(auth),
      promise: authInitPromise
    };
  };
}]);

module.exports = authModule;
