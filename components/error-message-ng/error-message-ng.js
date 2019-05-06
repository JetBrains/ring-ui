import angular from 'angular';

import IconNG from '../icon-ng/icon-ng';
import LinkNG from '../link-ng/link-ng';

import '../error-message-ng/error-message-ng.scss';

/**
 * @name Error Message Ng
 */

const angularModule = angular.module('Ring.error-message', [IconNG, LinkNG]);

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
