import angular from 'angular';

import chevronRight from '@jetbrains/icons/chevron-right';
import chevronLeft from '@jetbrains/icons/chevron-left';

import PlaceUnder from '../place-under-ng/place-under-ng';
import IconNG from '../icon-ng/icon-ng';
import RingAngularComponent from '../global/ring-angular-component';
import ButtonNG from '../button-ng/button-ng';

import '../sidebar/sidebar.css';

import template from './sidebar-ng__template';

import buttonTemplate from './sidebar-ng__button-template';

/**
 * @name Sidebar Ng
 */

const angularModule = angular.module('Ring.sidebar', [PlaceUnder, IconNG, ButtonNG]);

class SidebarController extends RingAngularComponent {
  constructor(...args) {
    super(...args);

    this.$onInit = () => {
      const {$scope} = this.$inject;

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
    };
  }
}
SidebarController.$inject = ['$scope'];

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
    template,
    controllerAs: 'sidebar'
  };
}

function rgSidebarToggleButtonDirective() {
  return {
    restrict: 'E',
    transclude: true,
    replace: true,
    scope: {},
    controller() {
      this.chevronRight = chevronRight;
      this.chevronLeft = chevronLeft;
    },
    bindToController: {
      model: '=',
      dialogIsActive: '=?'
    },
    template: buttonTemplate,
    controllerAs: 'button'
  };
}

angularModule.directive('rgSidebar', rgSidebarDirective);
angularModule.directive('rgSidebarToggleButton', rgSidebarToggleButtonDirective);

export default angularModule.name;
