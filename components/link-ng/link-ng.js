import '../link/link.scss';

/**
 * @name Link Ng
 * @category Angular Components
 * @framework Angular
 * @constructor
 * @description Displays a link.
 * @example
    <example name="link-ng">
      <file name="index.html">
        <div id="link" ng-app="TestApp" ng-strict-di>
          <rg-link href="http://example.com" class="test-class">Open example</rg-link>
        </div>
      </file>
      <file name="index.js">
        import angular from 'angular';
        import Link from  'ring-ui/components/link-ng/link-ng';

        angular.module('TestApp', [Link]);
      </file>
  </example>
 */

/* global angular: false */
const angularModule = angular.module('Ring.link', []);

function rgLinkDirective() {
  return {
    restrict: 'E',
    transclude: true,
    replace: true,
    template: '<a class="ring-link" ng-transclude></a>'
  };
}

angularModule.directive('rgLink', rgLinkDirective);

export default angularModule.name;
