window.source = {
  "title": "Auth Ng",
  "url": "auth-ng.html",
  "type": "js",
  "content": "import angular from 'angular';\n\nimport Auth from '../auth/auth';\n\n/**\n * @name Auth Ng\n * @category Legacy Angular\n * @tags Ring UI Language\n * @description Provides an Angular wrapper for Auth.\n * @example-file ./auth-ng.examples.html\n */\nconst angularModule = angular.module('Ring.auth', []);\n\nangularModule.provider('auth', function provider($httpProvider) {\n  /**\n   * @type Auth\n   */\n  let auth;\n  /**\n   * @type {{cleanHash: boolean}} config\n   */\n  const defaultConfig = {\n    cleanHash: false //prevents infinite redirect on angular>1.2.26\n  };\n\n  this.init = authInstance => {\n    auth = authInstance;\n  };\n\n  /**\n   * @param {{\n   *   serverUri: string,\n   *   redirectUri: string?,\n   *   clientId: string?,\n   *   scope: string[]?,\n   *   cleanHash: boolean?\n   * }} config\n   */\n  this.config = config => {\n    const configCopy = angular.extend({}, defaultConfig, config);\n    auth = new Auth(configCopy);\n  };\n\n  $httpProvider.interceptors.push(['$q', '$injector', 'auth', ($q, $injector, authInstance) => {\n    function urlEndsWith(config, suffix) {\n      return config &&\n        config.url &&\n        config.url.indexOf(suffix) === config.url.length - suffix.length;\n    }\n\n    return {\n      request(config) {\n        if (!authInstance || urlEndsWith(config, '.html') || (config && config.noAuthorization)) {\n          // Don't intercept angular template requests\n          return config;\n        }\n        return authInstance.promise.\n          then(() => authInstance.auth.requestToken()).\n          then(accessToken => {\n            config.headers.Authorization = `Bearer ${accessToken}`;\n            return config;\n          });\n      },\n      responseError(rejection) {\n        if (authInstance && !urlEndsWith(rejection.config, '.html') &&\n          rejection.data != null && Auth.shouldRefreshToken(rejection.data.error)) {\n\n          // Use $injector to avoid circular dependency\n          const $http = $injector.get('$http');\n          const {data, method, params, url} = rejection.config;\n\n          return authInstance.auth.\n            forceTokenUpdate().\n            then(() => $http({data, method, params, url}));\n        }\n\n        return $q.reject(rejection);\n      }\n    };\n  }]);\n\n  this.$get = function get($injector, $log, $sniffer) {\n    // Do not try to init anything without config\n    if (!auth) {\n      $log.warn('Auth wasn\\'t initialized');\n      return null;\n    }\n\n    if (auth.config.reloadOnUserChange === false) {\n      auth.addListener('userChange', () => {\n        const $route = $injector.get('$route');\n        $route.reload();\n      });\n    }\n\n    /**\n     * @type {Promise.<string>}\n     */\n    const authInitPromise = auth.init();\n\n    /**\n     * @param {string?} restoreLocationURL\n     */\n    function restoreLocation(restoreLocationURL) {\n      if (restoreLocationURL) {\n        const bases = document.getElementsByTagName('base');\n        let baseURI = auth.config.redirectUri;\n\n        if (bases.length > 0) {\n          baseURI = bases[0].href;\n        }\n\n        if (restoreLocationURL.indexOf(baseURI) === 0) {\n          const $location = $injector.get('$location');\n          let relativeURI = restoreLocationURL.substr(baseURI.length);\n\n          // We have to turn url with hash to simple relative url in HashbangInHtml5 mode\n          // And there is no other and documented way to detect that mode\n          // @see http://stackoverflow.com/a/16678065\n          if ($location.$$html5 && !$sniffer.history) { // eslint-disable-line angular/no-private-call\n            relativeURI = relativeURI.replace(/^#\\//, '');\n          }\n\n          $location.url(relativeURI).replace();\n        }\n      }\n    }\n\n    authInitPromise.then(restoreLocation, e => {\n      if (!e.authRedirect) {\n        $log.error(e);\n      }\n    });\n\n    return {\n      auth,\n      requestUser: auth.requestUser.bind(auth),\n      clientId: auth.config.clientId,\n      logout: auth.logout.bind(auth),\n      promise: authInitPromise\n    };\n  };\n});\n\nexport default angularModule.name;\n",
  "examples": [
    {
      "name": "Auth Ng",
      "url": "examples/auth-ng/auth-ng.html",
      "disableAutoSize": false,
      "files": [
        {
          "type": "html",
          "content": "\n<div ng-app=\"test\" ng-strict-di ng-controller=\"testCtrl as ctrl\">\n   <h3>User info</h3>\n   <pre>{{ ctrl.user | json }}</pre>\n</div>\n ",
          "showCode": true
        },
        {
          "type": "js",
          "content": "\nimport hubConfig from '@ring-ui/docs/components/hub-config';\n\nimport angular from 'angular';\nimport AuthNG from '@jetbrains/ring-ui/components/auth-ng/auth-ng';\n\nangular.module('test', [AuthNG])\n  .config(['authProvider', function (authProvider) {\n    authProvider.config(hubConfig);\n  }])\n  .controller('testCtrl', ['auth', '$q', function(auth, $q) {\n    const ctrl = this;\n    $q.resolve(auth.requestUser()).then(function(user) {\n     ctrl.user = user;\n    });\n  }]);\n ",
          "showCode": true
        }
      ]
    }
  ],
  "description": "Provides an Angular wrapper for Auth.",
  "attrs": {
    "name": "Auth Ng",
    "category": "Legacy Angular",
    "tags": "Ring UI Language",
    "description": "Provides an Angular wrapper for Auth.",
    "example-file": "./auth-ng.examples.html"
  }
};