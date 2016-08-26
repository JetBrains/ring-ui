/* global angular: false */

import {registerComponents, reactNg} from '../react-ng/react-ng';
import Icon from '../icon/icon';

import '../error-message-ng/error-message-ng.scss';

registerComponents({Icon});

/**
 * @name Error Message Ng
 * @category Angular Components
 * @description Displays an error message.
 * Usage:
 * <rg-error-message code="{{ 'Disconnected' | translate }}" message="{{ 'No, no one\'s there.' | translate }}" icon="frown" links="[{href:'.',text:'home'}]">
 *  {{ 'Service backend isn\'t available' | translate }}
 * </rg-error-message>
 * @example
   <example name="Error Message Ng">
    <file name="index.html">
      TODO example
    </file>
   </example>
 */

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
