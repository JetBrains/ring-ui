import IconNG from '../icon-ng/icon-ng';

import '../error-message-ng/error-message-ng.scss';

/**
 * @name Error Message Ng
 * @category Angular Components
 * @description Displays an error message.
 * @example
  <example name="Error Message Ng">
    <file name="index.html" disable-auto-size>
      <div ng-app="ExampleApp" ng-strict-di ng-controller="DemoCtrl">
        <rg-error-message code="Disconnected" message="No, no one\'s there." icon="{{errorIcon}}" links="[{href:'.',text:'home'}]">
          Service backend isn't available
        </rg-error-message>
      </div>
    </file>
    <file name="index.js">
      import angular from 'angular';
      import errorMessageNg from '@jetbrains/ring-ui/components/error-message-ng/error-message-ng';
      import frownIcon from '@jetbrains/icons/frown.svg';

      angular.module('ExampleApp', [errorMessageNg]).
        controller('DemoCtrl', function($scope) {
          $scope.errorIcon = frownIcon;
        });
     </file>
  </example>
 */
/* global angular: false */

const angularModule = angular.module('Ring.error-message', [IconNG]);

angularModule.directive('rgErrorMessage', function rgErrorMessageDirective() {
  return {
    replace: true,
    transclude: true,
    template: require('./error-message-ng.html'),
    restrict: 'E',

    scope: {
      code: '@',
      message: '@',
      links: '=',
      icon: '@'
    }
  };
});

export default angularModule.name;
