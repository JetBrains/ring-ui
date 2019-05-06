import angular from 'angular';

import chevronRight from '@jetbrains/icons/chevron-right.svg';

import '../breadcrumb/breadcrumb.scss';
import LinkModule from '../link-ng/link-ng';
import IconModule from '../icon-ng/icon-ng';

/**
 * @name Breadcrumb Ng
 */


const angularModule = angular.module('Ring.breadcrumb', [LinkModule, IconModule]);

angularModule.filter('breadcrumbNgChevronIcon', () => () => chevronRight);

angularModule.directive('rgBreadcrumb', function rgBreadcrumbDirective() {
  return {
    template: require('./breadcrumb-ng.html'),
    replace: true,
    transclude: true,
    restrict: 'E',

    scope: {
      label: '@',
      link: '@',
      onClick: '&'
    }
  };
});

export default angularModule.name;
