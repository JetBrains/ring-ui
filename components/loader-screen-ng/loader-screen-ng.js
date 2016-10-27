import loaderNg from '../loader-ng/loader-ng';
import '../loader-screen/loader-screen.scss';

/**
 * @name Loader Screen Ng
 * @category Angular Components
 * @description Provides an Angular wrapper for Loader Screen.
 * @example
 * <example name="Loader Screen Ng">
    <file name="index.html">
      <div ng-app="ExampleApp">
        <div rg-loader-screen="Loading..."></div>
      </div>
    </file>
    <file name="index.js">
      import angular from 'angular';
      import loaderScreenNg from 'ring-ui/components/loader-screen-ng/loader-screen-ng';

      angular.module('ExampleApp', [loaderScreenNg]).
        run((loaderScreen) => {
          loaderScreen.setVisible(true);
          loaderScreen.startInitialLoading();
        });
     </file>
  </example>
 */
/* global angular: false */

const angularModule = angular.module('Ring.loader-screen', [loaderNg]);

angularModule.service('loaderScreen', function ($timeout, $rootScope) {
  let initialLoading;
  let loadingFailed = false;
  let showLoader;
  let showLoaderPromise;

  this.startInitialLoading = () => {
    initialLoading = true;

    showLoaderPromise = $timeout(() => {
      this.setVisible(true);
    }, 1500);
  };

  $rootScope.isInitialLoading = () => initialLoading;
  $rootScope.isLoaderVisible = () => showLoader;
  $rootScope.isLoadingFailed = () => loadingFailed;

  this.stopInitialLoading = () => {
    if (showLoaderPromise && !showLoaderPromise.$resolved) {
      $timeout.cancel(showLoaderPromise);
    }
    initialLoading = false;
    this.setVisible(false);
  };

  this.failInitialLoading = error => {
    this.stopInitialLoading();
    loadingFailed = true;
    $rootScope.error = error;
  };

  this.setVisible = visible => {
    showLoader = visible;
  };

  /* eslint-disable angular/on-watch */
  $rootScope.$on('$routeChangeSuccess', () => {
    this.stopInitialLoading();
  });

  $rootScope.$on('$routeChangeError', (event, current, previous, rejection) => {
    if (!rejection || !(rejection.silent || rejection.authRedirect)) {
      this.failInitialLoading(rejection);
    }
  });
  /* eslint-enable angular/on-watch */
});

angularModule.directive('rgLoaderScreen', () => ({
  restrict: 'A',

  scope: {
    message: '@rgLoaderScreen'
  },

  template: require('./loader-screen-ng.html')
}));

export default angularModule.name;
