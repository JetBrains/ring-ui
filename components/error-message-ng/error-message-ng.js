/* global angular: false */

require('../error-message-ng/error-message-ng.scss');

require('react-ng/react-ng')({
  Icon: require('icon/icon')
});

/**
 * A block for displaying error messages
 * Usage:
 * <rg-error-message code="{{ 'Disconnected' | translate }}" message="{{ 'No, no one\'s there.' | translate }}" icon="frown" links="[{href:'.',text:'home'}]">
   {{ 'Service backend isn\'t available' | translate }}
   </rg-error-message>
 */

angular.module('Ring.error-message', ['Ring.react-ng']).
  directive('rgErrorMessage', [function () {
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
  }]);
