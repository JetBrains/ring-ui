require('../sidebar/sidebar.scss');
require('../place-under-ng/place-under-ng');
require('../react-ng/react-ng')({
  Icon: require('../icon/icon.jsx')
});
require('icon/source/chevron-left.svg');
require('icon/source/chevron-right.svg');


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
         require('angular/angular.min.js');
         require('sidebar-ng/sidebar-ng');
       </file>
   </example>

   <example name="Sidebar Ng with big content">
    <file name="index.html">
      <div id="content-before">
        <div>Lorem</div><div>Ipsum</div><div>Lorem</div><div>Lorem</div><div>Lorem</div>
      </div>
      <div ng-app="Ring.sidebar" ng-init="isShowSideBar = true" style="position: relative;">
          <rg-sidebar show="isShowSideBar" place-under-sibling=".some-toolbar" top-offset="1">
            <div id="big-content">===== The start of sidebar =====<br/></div>
          </rg-sidebar>
          <div class="some-toolbar">
              Toolbar to place before sidebar
              <rg-sidebar-toggle-button model="isShowSideBar">Toggle sidebar</rg-sidebar-toggle-button>
          </div>
      </div>
      <div id="content-after"></div>

     </file>
       <file name="index.js" webpack="true">
         require('angular/angular.min.js');
         require('sidebar-ng/sidebar-ng');

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


/*global angular*/
angular.module('Ring.sidebar', ['Ring.react-ng', 'Ring.place-under'])
  .directive('rgSidebar', function () {
    return {
      restrict: 'E',
      transclude: true,
      replace: true,
      template: require('./sidebar-ng.html'),
      /**
      * {{
      *   show: boolean,
      *   placeUnderSibling: ?string, a selector for an element the sidebar should stick to
      *   topOffset: ?number, sidebar top offset
      * }}
      */
      scope: {
        show: '=',
        placeUnderSibling: '@',
        topOffset: '=?'
      }
    };
  })
  .directive('rgSidebarToggleButton', [function () {
    return {
      controller: function ($scope) {
        $scope.chevronLeftIcon = require('icon/source/chevron-left.svg');
        $scope.chevronRightIcon = require('icon/source/chevron-right.svg');
      },
      replace: true,
      restrict: 'E',
      transclude: true,
      scope: {
        model: '='
      },
      template: require('./sidebar-ng__button.html')
    };
  }]);
