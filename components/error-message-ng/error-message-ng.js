/* global angular: false */

import {registerComponents, reactNg} from '../react-ng/react-ng';
import Icon from '../icon/icon';

import '../error-message-ng/error-message-ng.scss';

registerComponents({Icon});

/**
 * A block for displaying error messages
 * Usage:
 * <rg-error-message code="{{ 'Disconnected' | translate }}" message="{{ 'No, no one\'s there.' | translate }}" icon="frown" links="[{href:'.',text:'home'}]">
   {{ 'Service backend isn\'t available' | translate }}
   </rg-error-message>
 */

const module = angular.module('Ring.error-message', [reactNg]);

module.directive('rgErrorMessage', function () {
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

export default module.name;
