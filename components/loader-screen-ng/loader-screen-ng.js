/* global angular: false */

import Loader from '../loader/loader';
import {registerComponents, reactNg} from '../react-ng/react-ng';

import '../loader-screen/loader-screen.scss';
import '../loader/loader.scss';

registerComponents({Loader});

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

const angularModule = angular.module('Ring.loader-screen', [reactNg]);

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
