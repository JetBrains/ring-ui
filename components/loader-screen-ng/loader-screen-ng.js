import angular from 'angular';

import loaderNg from '../loader-ng/loader-ng';
import styles from '../loader-screen/loader-screen.css';

/**
 * @name Loader Screen Ng
 */

const angularModule = angular.module('Ring.loader-screen', [loaderNg]);

angularModule.service('loaderScreen', function service($timeout, $rootScope) {
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

    template: `
<div class="${styles.loaderScreen}" ng-if="$root.isLoaderVisible()">
  <rg-loader class="${styles.loader}"
    message="{{$root.isInitialLoading() ? message : ''}}"></rg-loader>
</div>
    `
  };
});

export default angularModule.name;
