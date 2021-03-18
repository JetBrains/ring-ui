import angular from 'angular';

import chevronRight from '@jetbrains/icons/chevron-right';

import LinkModule from '../link-ng/link-ng';
import IconModule from '../icon-ng/icon-ng';

import styles from './breadcrumb.css';

/**
 * @name Breadcrumb Ng
 */


const angularModule = angular.module('Ring.breadcrumb', [LinkModule, IconModule]);

angularModule.filter('breadcrumbNgChevronIcon', () => () => chevronRight);

angularModule.directive('rgBreadcrumb', function rgBreadcrumbDirective() {
  return {
    template: `
<div class="${styles.breadcrumb}">
  <span class="${styles.breadcrumbElement}" data-test="ring-breadcrumb" ng-show="label">
    <rg-link
      ng-if="link"
      ng-href="{{link}}"
    >{{label}}</rg-link>

    <rg-link ng-if="!link && onClick"
          ng-class="onClick && 'ring-link'"
          data-test="ring-breadcrumb-link"
          ng-click="onClick({$event: $event})">{{label}}</rg-link>

    <span ng-if="!link && !onClick" ng-click="onClick({$event: $event})">{{label}}</span>
  </span>

  <span ng-show="label">
    <rg-icon
      class="${styles.separatorIcon}"
      glyph="{{'' | breadcrumbNgChevronIcon}}"
    ></rg-icon>
  </span>

  <span class="${styles.breadcrumbElement} ${styles.active}" data-test="ring-breadcrumb-element" ng-transclude></span>
</div>

    `,
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
