import angular from 'angular';

import styles from '../link/link.css';

/**
 * @name Link Ng
 */


const angularModule = angular.module('Ring.link', []);

function rgLinkDirective() {
  return {
    restrict: 'E',
    transclude: true,
    replace: true,
    template: `
<a class="${styles.link} ${styles.compatibilityUnderlineMode}"
><span class="${styles.inner}" ng-transclude></span></a>
    `
  };
}

angularModule.directive('rgLink', rgLinkDirective);

export default angularModule.name;
