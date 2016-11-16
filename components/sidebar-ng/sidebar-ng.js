import PlaceUnder from '../place-under-ng/place-under-ng';
import iconNg from '../icon-ng/icon-ng';

import '../sidebar/sidebar.scss';
import '../button-legacy/button-legacy.scss';

/**
 * @name Sidebar Ng
 * @category Angular Components
 * @description Provides an Angular wrapper for Sidebar.
 * To make sidebar have fixed positioning under some other element (e.g. toolbar),
 * a selector for that element should be passed as placeUnderSibling parameter.
 * @example-file ./sidebar-ng.examples.html
 */
/* global angular */

const angularModule = angular.module('Ring.sidebar', [PlaceUnder, iconNg]);

class SidebarController {
  constructor($scope) {
    this.dialogIsActive = false;
    this.showed = this.show;

    // dialog has been opened — open sidebar
    $scope.$watch(() => this.dialogIsActive, () => {
      if (this.dialogIsActive) {
        this.show = true;
      } else if (!this.showed) {
        this.show = false;
      }
    });

    $scope.$watch(() => this.show, () => {
      if (!this.dialogIsActive) {
        this.showed = this.show;
      }
    });
  }
}

function rgSidebarDirective() {
  return {
    restrict: 'E',
    transclude: true,
    replace: true,
    scope: {},
    controller: SidebarController,
    /**
    * {{
    *   show: boolean,
    *   placeUnderSibling: ?string, a selector for an element the sidebar should stick to
    *   topOffset: ?number, sidebar top offset
    * }}
    */
    bindToController: {
      show: '=',
      placeUnderSibling: '@',
      topOffset: '=?',
      dialogIsActive: '=?'
    },
    template: require('./sidebar-ng.html'),
    controllerAs: 'sidebar'
  };
}

function rgSidebarToggleButtonDirective() {
  return {
    restrict: 'E',
    transclude: true,
    replace: true,
    scope: {},
    controller() {},
    bindToController: {
      model: '=',
      dialogIsActive: '=?'
    },
    template: require('./sidebar-ng__button.html'),
    controllerAs: 'button'
  };
}

angularModule.directive('rgSidebar', rgSidebarDirective);
angularModule.directive('rgSidebarToggleButton', rgSidebarToggleButtonDirective);

export default angularModule.name;
