require('../sidebar/sidebar.scss');
var debounce = require('mout/function/debounce');

require('../react-ng/react-ng')({
  Icon: require('../icon/icon.jsx')
});

/**
 * @name A sidebar directive.
 * @description Sidebar trying to fill all right half of container.
 * To make sidebar fixed positioned under some other element (e.g. toolbar)
 * that element selector should be passed as placeUnderSibling param.
 * @example
  <example name="Sidebar-ng">
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
 */


/*global angular*/
angular.module('Ring.sidebar', [])
  .directive('rgSidebar', ['$window', '$document', function ($window, $document) {
    var DEBOUNCE_INTERVAL = 10;

    return {
      restrict: 'E',
      transclude: true,
      replace: true,
      template: '<div class="ring-sidebar" ng-class="{\'ring-sidebar_active\': show}" ng-transclude></div>',
      /**
      * {{
      *   show: boolean,
      *   placeUnderSibling: ?string, an selector to stick sidebar
      *   topOffset: ?number, an offset from top for sidebar
      * }}
      */
      scope: {
        show: '=',
        placeUnderSibling: '@',
        topOffset: '=?'
      },
      link: function (scope, iElement) {
        /**
         * Use plain JS to make sidebar stickable
         */
        var element = iElement[0];

        scope.topOffset = scope.topOffset || 0;

        /**
         * Syncing sidebar position with other element bottom
         * @param syncWithElement - DOM node to sync with
         */
        var syncPositionWith = function (syncWithElement) {

          var sidebarScrollListener = debounce(function () {
            var scrolledTop = ($document[0].documentElement && $document[0].documentElement.scrollTop) || $document[0].body.scrollTop;

            var syncedElementHeight = syncWithElement.offsetHeight;
            var syncedElementOffsetTop = syncWithElement.getBoundingClientRect().top + scrolledTop;

            var bottom = syncedElementOffsetTop + syncedElementHeight;

            var margin = Math.max(bottom - scrolledTop, syncedElementHeight);

            element.style.marginTop = margin + scope.topOffset + 'px';

          }, DEBOUNCE_INTERVAL);

          sidebarScrollListener();

          $window.addEventListener('scroll', sidebarScrollListener);

          scope.$on('$destroy', function () {
            $window.removeEventListener('scroll', sidebarScrollListener);
          });
        };


        if (scope.placeUnderSibling) {
          scope.$evalAsync(function sync() {
            var syncWith = element.parentNode.querySelector(scope.placeUnderSibling);
            if (syncWith) {
              syncPositionWith(syncWith);
            } else {
              throw new Error('Sidebar can\'t find element to sync with.');
            }
          });
        }
      }
    };
  }])
  .directive('rgSidebarToggleButton', [function () {
    return {
      replace: true,
      restrict: 'E',
      transclude: true,
      scope: {
        model: '='
      },
      template: require('./sidebar-ng__button.html')
    };
  }]);
