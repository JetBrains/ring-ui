import angular from 'angular';

import styles from '../link/link.css';

/**
 * @name Link Ng
 * @category Legacy Angular
 * @tags Ring UI Language
 * @framework Angular
 * @constructor
 * @description Displays a link.
 * @example
    <example name="Link Ng">
      <file name="index.html">
        <div id="link" ng-app="TestApp" ng-strict-di>
          <rg-link href="http://example.com" class="test-class">Open example</rg-link>
        </div>
      </file>
      <file name="index.js">
        import angular from 'angular';
        import Link from  '@jetbrains/ring-ui/components/link-ng/link-ng';

        angular.module('TestApp', [Link]);
      </file>
  </example>
 */


const angularModule = angular.module('Ring.link', []);

function rgLinkDirective() {
  return {
    restrict: 'E',
    transclude: true,
    replace: true,
    template: `
<a class="${styles.link} ${styles.compatibilityUnderlineMode}">
  <span class="${styles.inner}" ng-transclude></span>
</a>
    `
  };
}

angularModule.directive('rgLink', rgLinkDirective);

export default angularModule.name;
