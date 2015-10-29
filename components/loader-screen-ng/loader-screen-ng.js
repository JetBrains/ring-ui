/* global angular: false */

require('loader-screen/loader-screen.scss');
require('loader/loader.scss');
require('react-ng/react-ng')({
  Loader: require('loader/loader')
});


/**
 * Loader service
 *
 * 1. Use directive in body:
 *   <div ring-loader-screen="{{ 'Loading' | translate}}"></div>
 *
 * 2. Add dependency for 'Ring.loader-screen' to your app
 *
 * 3. Add run section to your app:
 *  app.run(['loaderScreen', function (loaderScreen) {
 *    loaderScreen.setVisible(true);
 *    loaderScreen.startInitialLoading();
 *  }]);
 */

angular.module('Ring.loader-screen', []).
  service('loaderScreen', function ($timeout, $rootScope) {
      var self = this;
      var initialLoading;
      var loadingFailed = false;
      var showLoader;
      var showLoaderPromise;

      this.startInitialLoading = function () {
        initialLoading = true;

        showLoaderPromise = $timeout(function () {
          self.setVisible(true);
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
        if (!rejection || !(rejection.silent || rejection.authRedirect)) {
          self.failInitialLoading(rejection);
        }
      });
    }
  )
  .directive('rgLoaderScreen', function () {
    return {
      restrict: 'A',
      scope: {
        rgLoaderScreen: '@'
      },
      template: require('./loader-screen-ng.html')
    };
  });
