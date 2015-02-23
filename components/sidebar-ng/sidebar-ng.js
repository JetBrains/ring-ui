require('../sidebar/sidebar.scss');
var debounce = require('mout/function/debounce');

require('../react-ng/react-ng')({
  Icon: require('../icon/icon.jsx')
});

/**
 * A sidebar directive.
 * @example
   <example>
      <rg-sidebar show="true" place-under-sibling=".some-toolbar" top-offset="1">
       <div class="sidebar__empty">Nothing to show</div>
      </rg-sidebar>
      <div class="some-toolbar">Toolbar to place before sidebar</div>
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
      * @param {{
      *   show: boolean,
      *   placeUnderSibling: string?, an selector to stick sidebar
      *   topOffset: integer?, an offset from top for sidebar
      * }} scope
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
            var syncedElementHeight = syncWithElement.offsetHeight;
            var syncedElementOffsetTop = syncWithElement.getBoundingClientRect().top + $document[0].body.scrollTop;

            var bottom = syncedElementOffsetTop + syncedElementHeight;

            var margin = Math.max(bottom - $window.scrollY, syncedElementHeight);

            element.style.marginTop = margin + scope.topOffset + 'px';

          }, DEBOUNCE_INTERVAL);

          sidebarScrollListener();

          $window.addEventListener('scroll', sidebarScrollListener);

          scope.$on('$destroy', function () {
            $window.removeEventListener('scroll', sidebarScrollListener);
          });
        };


        if (scope.placeUnderSibling) {
          var syncWith = element.parentNode.querySelector(scope.placeUnderSibling);
          if (syncWith) {
            syncPositionWith(syncWith);
          } else {
            throw new Error('Sidebar can\'t find element to sync with.');
          }
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
      template: '<button class="ring-btn" ng-click="model = !model">' +
                  '<span class="ring-sidebar__toggle-icon" react="Icon" size="14" glyph="model ? \'chevron-right\' : \'chevron-left\'" color="light-gray"></span>' +
                  '<span ng-transclude></span>' +
                '</button>'
    };
  }]);
