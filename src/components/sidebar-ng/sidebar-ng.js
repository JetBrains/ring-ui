require('../sidebar/sidebar.scss');
var debounce = require('mout/function/debounce');
var $ = require('jquery');
require('../react-ng/react-ng')({
  Icon: require('../icon/icon.jsx')
});

/**
 * A sidebar directive.
 <example>
    <rg-sidebar show="true" place-under-sibling=".some-toolbar" top-offset="1">
     <div class="sidebar__empty">Nothing to show</div>
    </rg-sidebar>
    <div class="some-toolbar">Toolbar to place before sidebar</div>
 </example>
 */


/*global angular*/
angular.module('Ring.sidebar', [])
  .directive('rgSidebar', ['$window', function ($window) {
    var DEBOUNCE_INTERVAL = 10;

    return {
      restrict: 'E',
      transclude: true,
      replace: true,
      template: '<div class="sidebar" ng-class="{\'sidebar_active\': show}" ng-transclude></div>',
      /**
      * @param {{
      *   show: boolean,
      *   redireplaceUnderSiblingct_uri: string?, an selector to stick sidebar
      *   topOffset: integer?, an offset from top for sidebar
      * }} scope
      */
      scope: {
        show: '=',
        placeUnderSibling: '@',
        topOffset: '=?'
      },
      link: function (scope, element) {
        var $wrappedWindow = $($window);
        var $element = $(element);

        scope.topOffset = scope.topOffset || 0;

        var syncPositionWith = function (syncWithElement) {

          var sidebarScrollListener = debounce(function () {
            var syncedElementHeight = syncWithElement.height();
            var bottom = syncWithElement.offset().top + syncedElementHeight;

            var margin = Math.max(bottom - $wrappedWindow.scrollTop(), syncedElementHeight);

            $element.css('margin-top', margin + scope.topOffset);

          }, DEBOUNCE_INTERVAL);

          sidebarScrollListener();

          $wrappedWindow.on('scroll', sidebarScrollListener);

          scope.$on('$destroy', function () {
            $wrappedWindow.off('scroll', sidebarScrollListener);
          });
        };


        if (scope.placeUnderSibling) {
          var syncWith = $element.next(scope.placeUnderSibling);
          if (syncWith && syncWith.length > 0) {
            syncPositionWith(syncWith);
          } else {
            throw 'Sidebar can\'t find element to sync with.';
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
                  '<span class="sidebar__toggle-icon" react="Icon" size="14" glyph="model ? \'chevron-right\' : \'chevron-left\'" color="light-gray"></span>' +
                  '<span ng-transclude></span>' +
                '</button>'
    };
  }]);
