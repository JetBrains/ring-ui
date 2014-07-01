(function () {
  'use strict';

  /**
   * Loader service
   *
   * Use following code in body:
   *   <div class="ring-loader-screen" ng-show="isLoaderVisible()"><div class="ring-loader" translate>Loading</div></div>
   */

  angular.module('Ring.loader-screen', []).
    service('loaderScreen', [
      '$timeout',
      '$rootScope',
      function ($timeout, $rootScope) {
        var self = this;
        var initialLoading;
        var loadingFailed = false;
        var showLoader;
        var showLoaderPromise;

        this.startInitialLoading = function () {
          initialLoading = true;
          var _this = this;
          showLoaderPromise = $timeout(function () {
            _this.setVisible(true);
          }, 1500);
        };

        $rootScope.isInitialLoading = function () {
          return initialLoading;
        };

        $rootScope.isLoaderVisible = function () {
          return showLoader;
        };

        $rootScope.isLoadingFailed = function () {
          return loadingFailed;
        };

        this.stopInitialLoading = function () {
          if (showLoaderPromise && !showLoaderPromise.$resolved) {
            $timeout.cancel(showLoaderPromise);
          }
          initialLoading = false;
          this.setVisible(false);
        };

        this.failInitialLoading = function (error) {
          this.stopInitialLoading();
          loadingFailed = true;
          $rootScope.error = error;
        };

        this.setVisible = function (visible) {
          showLoader = visible;
        };

        $rootScope.$on('$routeChangeSuccess', function () {
          self.stopInitialLoading();
        });

        $rootScope.$on('$routeChangeError', function (event, current, previous, rejection) {
          if (!rejection || !rejection.silent) {
            self.failInitialLoading(rejection);
          }
        });
      }
    ]);
})();