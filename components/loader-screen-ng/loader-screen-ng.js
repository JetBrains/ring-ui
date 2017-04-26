import loaderNg from '../loader-ng/loader-ng';
import '../loader-screen/loader-screen.scss';

/**
 * @name Loader Screen Ng
 * @category Angular Components
 * @description Provides an Angular wrapper for Loader Screen.
 * @example
 * <example name="Loader Screen Ng">
    <file name="index.html">
      <div ng-app="ExampleApp" ng-strict-di>
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
  // TODO in CSS Modules version put constant to global.css
  const ordinaryLoadingTTL = 100;

  let initialLoading = false;
  let loadingFailed = false;
  let showLoader;
  let showLoaderPromise;

  this.startLoading = (ttl = ordinaryLoadingTTL) => {
    if (showLoaderPromise) {
      return; // already scheduled to show
    }

    showLoaderPromise = $timeout(() => {
      this.setVisible(true);
    }, ttl);
  };

  this.stopLoading = () => {
    if (showLoaderPromise) {
      $timeout.cancel(showLoaderPromise);
      showLoaderPromise = null;
    }

    this.setVisible(false);
  };

  this.startInitialLoading = () => {
    initialLoading = true;
    this.setVisible(true);
  };

  this.stopInitialLoading = () => {
    initialLoading = false;
    this.setVisible(false);
  };

  $rootScope.isInitialLoading = () => initialLoading;
  $rootScope.isLoaderVisible = () => showLoader;

  $rootScope.isLoadingFailed = () => loadingFailed;

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

angularModule.directive('rgLoaderScreen', function rgLoaderScreenDirective() {
  return {
    restrict: 'A',

    scope: {
      message: '@rgLoaderScreen'
    },

    template: require('./loader-screen-ng.html')
  };
});

export default angularModule.name;
