import {registerComponents, reactNg} from '../react-ng/react-ng';
import Icon from '../icon/icon';

import '../error-message-ng/error-message-ng.scss';

registerComponents({Icon});

/**
 * @name Error Message Ng
 * @category Angular Components
 * @description Displays an error message.
 * @example
  <example name="Error Message Ng">
    <file name="index.html">
      <div ng-app="ExampleApp" ng-controller="DemoCtrl">
        <rg-error-message code="Disconnected" message="No, no one\'s there." icon="{{errorIcon}}" links="[{href:'.',text:'home'}]">
          Service backend isn't available
        </rg-error-message>
      </div>
    </file>
    <file name="index.js" webpack="true">
      import 'angular';
      import errorMessageNg from 'ring-ui/components/error-message-ng/error-message-ng';
      import FrownIcon from 'jetbrains-icons/frown.svg';

      angular.module('ExampleApp', [errorMessageNg]).
        controller('DemoCtrl', function($scope) {
          $scope.errorIcon = FrownIcon;
        });
     </file>
  </example>
 */
/* global angular: false */

const angularModule = angular.module('Ring.error-message', [reactNg]);

angularModule.directive('rgErrorMessage', () => ({
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
}));

export default angularModule.name;
