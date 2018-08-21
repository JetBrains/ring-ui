window.source = {
  "title": "Loader Screen Ng",
  "url": "loader-screen-ng.html",
  "type": "js",
  "content": "import angular from 'angular';\n\nimport loaderNg from '../loader-ng/loader-ng';\nimport styles from '../loader-screen/loader-screen.css';\n\n/**\n * @name Loader Screen Ng\n * @category Legacy Angular\n * @tags Ring UI Language\n * @description Provides an Angular wrapper for Loader Screen.\n * @example\n * <example name=\"Loader Screen Ng\">\n    <file name=\"index.html\" disable-auto-size>\n      <div ng-app=\"ExampleApp\" ng-strict-di>\n        <div rg-loader-screen=\"Loading...\"></div>\n      </div>\n    </file>\n    <file name=\"index.js\">\n      import angular from 'angular';\n      import loaderScreenNg from '@jetbrains/ring-ui/components/loader-screen-ng/loader-screen-ng';\n\n      angular.module('ExampleApp', [loaderScreenNg]).\n        run((loaderScreen) => {\n          loaderScreen.setVisible(true);\n          loaderScreen.startInitialLoading();\n        });\n     </file>\n  </example>\n */\n\nconst angularModule = angular.module('Ring.loader-screen', [loaderNg]);\n\nangularModule.service('loaderScreen', function service($timeout, $rootScope) {\n  // TODO in CSS Modules version put constant to global.css\n  const ordinaryLoadingTTL = 100;\n\n  let initialLoading = false;\n  let loadingFailed = false;\n  let showLoader;\n  let showLoaderPromise;\n\n  this.startLoading = (ttl = ordinaryLoadingTTL) => {\n    if (showLoaderPromise) {\n      return; // already scheduled to show\n    }\n\n    showLoaderPromise = $timeout(() => {\n      this.setVisible(true);\n    }, ttl);\n  };\n\n  this.stopLoading = () => {\n    if (showLoaderPromise) {\n      $timeout.cancel(showLoaderPromise);\n      showLoaderPromise = null;\n    }\n\n    this.setVisible(false);\n  };\n\n  this.startInitialLoading = () => {\n    initialLoading = true;\n    this.setVisible(true);\n  };\n\n  this.stopInitialLoading = () => {\n    initialLoading = false;\n    this.setVisible(false);\n  };\n\n  $rootScope.isInitialLoading = () => initialLoading;\n  $rootScope.isLoaderVisible = () => showLoader;\n\n  $rootScope.isLoadingFailed = () => loadingFailed;\n\n  this.failInitialLoading = error => {\n    this.stopInitialLoading();\n    loadingFailed = true;\n    $rootScope.error = error;\n  };\n\n  this.setVisible = visible => {\n    showLoader = visible;\n  };\n\n  /* eslint-disable angular/on-watch */\n  $rootScope.$on('$routeChangeSuccess', () => {\n    this.stopInitialLoading();\n  });\n\n  $rootScope.$on('$routeChangeError', (event, current, previous, rejection) => {\n    if (!rejection || !(rejection.silent || rejection.authRedirect)) {\n      this.failInitialLoading(rejection);\n    }\n  });\n  /* eslint-enable angular/on-watch */\n});\n\nangularModule.directive('rgLoaderScreen', function rgLoaderScreenDirective() {\n  return {\n    restrict: 'A',\n\n    scope: {\n      message: '@rgLoaderScreen'\n    },\n\n    template: `\n<div class=\"${styles.loaderScreen}\" ng-if=\"$root.isLoaderVisible()\">\n  <rg-loader class=\"${styles.loader}\"\n    message=\"{{$root.isInitialLoading() ? message : ''}}\"></rg-loader>\n</div>\n    `\n  };\n});\n\nexport default angularModule.name;\n",
  "examples": [
    {
      "name": "Loader Screen Ng",
      "url": "examples/loader-screen-ng/loader-screen-ng.html",
      "disableAutoSize": true,
      "files": [
        {
          "type": "html",
          "content": "\n<div ng-app=\"ExampleApp\" ng-strict-di>\n  <div rg-loader-screen=\"Loading...\"></div>\n</div>\n    ",
          "showCode": true
        },
        {
          "type": "js",
          "content": "\nimport angular from 'angular';\nimport loaderScreenNg from '@jetbrains/ring-ui/components/loader-screen-ng/loader-screen-ng';\n\nangular.module('ExampleApp', [loaderScreenNg]).\n  run((loaderScreen) => {\n    loaderScreen.setVisible(true);\n    loaderScreen.startInitialLoading();\n  });\n     ",
          "showCode": true
        }
      ]
    }
  ],
  "description": "Provides an Angular wrapper for Loader Screen.",
  "attrs": {
    "name": "Loader Screen Ng",
    "category": "Legacy Angular",
    "tags": "Ring UI Language",
    "description": "Provides an Angular wrapper for Loader Screen.",
    "example": "<example name=\"Loader Screen Ng\">\n    <file name=\"index.html\" disable-auto-size>\n      <div ng-app=\"ExampleApp\" ng-strict-di>\n        <div rg-loader-screen=\"Loading...\"></div>\n      </div>\n    </file>\n    <file name=\"index.js\">\n      import angular from 'angular';\n      import loaderScreenNg from '@jetbrains/ring-ui/components/loader-screen-ng/loader-screen-ng';\n\n      angular.module('ExampleApp', [loaderScreenNg]).\n        run((loaderScreen) => {\n          loaderScreen.setVisible(true);\n          loaderScreen.startInitialLoading();\n        });\n     </file>\n  </example>"
  }
};