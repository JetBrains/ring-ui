import angular from 'angular';

import chevronRight from '@jetbrains/icons/chevron-right.svg';
import chevronLeft from '@jetbrains/icons/chevron-left.svg';

import PlaceUnder from '../place-under-ng/place-under-ng';
import IconNG from '../icon-ng/icon-ng';
import RingAngularComponent from '../global/ring-angular-component';
import ButtonNG from '../button-ng/button-ng';

import '../sidebar/sidebar.scss';

/**
 * @name Sidebar Ng
 */

const angularModule = angular.module('Ring.sidebar', [PlaceUnder, IconNG, ButtonNG]);

class SidebarController extends RingAngularComponent {
  static $inject = ['$scope'];

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
    controller() {
      this.chevronRight = chevronRight;
      this.chevronLeft = chevronLeft;
    },
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
