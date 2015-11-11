/* global angular */

import '../place-under-ng/place-under-ng';

import reactNg from '../react-ng/react-ng';
import Icon from '../icon/icon';

import '../sidebar/sidebar.scss';
import '../button/button.scss';

reactNg({Icon});

/**
 * @name Sidebar Ng
 * @description Sidebar trying to fill the entire right half of its container.
 * To make sidebar have fixed positioning under some other element (e.g. toolbar),
 * a selector for that element should be passed as placeUnderSibling parameter.
 * @example
  <example name="Sidebar Ng">
    <file name="index.html">
      <div ng-app="Ring.sidebar" ng-init="isShowSideBar = true" style="position: relative;">
          <rg-sidebar show="isShowSideBar" place-under-sibling=".some-toolbar" top-offset="1">
            <div class="sidebar__empty">Nothing to show</div>
          </rg-sidebar>
          <div class="some-toolbar">
              Toolbar to place before sidebar
              <rg-sidebar-toggle-button model="isShowSideBar">Toggle sidebar</rg-sidebar-toggle-button>
          </div>
        </div>
     </file>
       <file name="index.js" webpack="true">
         require('angular');
         require('ring-ui/components/sidebar-ng/sidebar-ng');
       </file>
   </example>

   <example name="Sidebar Ng with big content">
    <file name="index.html">
      <div id="content-before">
        <div>Lorem</div><div>Ipsum</div><div>Lorem</div><div>Lorem</div><div>Lorem</div>
      </div>
      <div ng-app="foo" ng-init="isShowSideBar = true" style="position: relative;">
          <rg-sidebar show="isShowSideBar" place-under-sibling=".some-toolbar" top-offset="1">
            <div id="big-content">===== The start of sidebar ===== <rg-select options="item in []"></rg-select><br/></div>
          </rg-sidebar>
          <div class="some-toolbar">
              Toolbar to place before sidebar
              <rg-sidebar-toggle-button model="isShowSideBar">Toggle sidebar</rg-sidebar-toggle-button>
          </div>
      </div>
      <div id="content-after"></div>

    </file>
      <file name="index.js" webpack="true">
        require('angular');
        require('ring-ui/components/sidebar-ng/sidebar-ng');
        require('ring-ui/components/select-ng/select-ng');

        angular.module('foo', ['Ring.sidebar', 'Ring.select']);

        var bigContent = document.getElementById('big-content');
        var after = document.getElementById('content-after');

        for (var i=0; i< 100; i++) {
          bigContent.innerHTML += ' ' + Math.random() + '<br/>';
          after.innerHTML += ' ' + Math.random() + '<br/>';
        }

        bigContent.innerHTML += '===== The end of sidebar =====';
       </file>
   </example>
 */

const module = angular.module('Ring.sidebar', ['Ring.react-ng', 'Ring.place-under']);

class SidebarController {
  constructor($scope) {
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
    controller: function () {},
    bindToController: {
      model: '=',
      dialogIsActive: '=?'
    },
    template: require('./sidebar-ng__button.html'),
    controllerAs: 'button'
  };
}

module.directive('rgSidebar', rgSidebarDirective);
module.directive('rgSidebarToggleButton', rgSidebarToggleButtonDirective);

export default module.name;
