/*global angular*/
var debounce = require('mout/function/debounce');
var $ = require('jquery');

/**
 * Stickable toolbar, usable for tables, but can be used elsewhere.
 * <example>
     <rg-table-toolbar stick>
      <ng-include src="'project-list/project-list__toolbar.tpl.html'"></ng-include>
     </rg-table-toolbar>
  </example>
 */

angular.module('Ring.table.toolbar', [])
  .directive('rgTableToolbar', ['$window', function ($window) {
    var DEBOUNCE_INTERVAL = 10;

    return {
      restrict: 'E',
      replace: true,
      transclude: true,
      template: '<div class="table__toolbar"><div class="table__toolbar__controls" ng-transclude></div></div>',
      link: function (scope, element, attrs) {
        var $wrappedWindow = $($window);
        var $element = $(element);
        var $controls = $element.find('.table__toolbar__controls');

        var savedToolbarTop;

        var toolbarScrollListener = debounce(function () {
          var toolbarTop = savedToolbarTop || $element.offset().top;
          var scrolledTop = $window.scrollY;

          if (scrolledTop > toolbarTop && !savedToolbarTop) {
              //save height to style to prevent collapsing after fixing controls
              $element.css('height', $element.height());
              savedToolbarTop = toolbarTop;
              $controls.addClass('table__toolbar__controls_fixed');
          } else if (scrolledTop <= toolbarTop && savedToolbarTop >= 0) {
            savedToolbarTop = null;
            $element.css('height', null);
            $controls.removeClass('table__toolbar__controls_fixed');
          }
        }, DEBOUNCE_INTERVAL);

        //Stick toolbar if sticking is enabled
        if (attrs.stick !== undefined) {
          $wrappedWindow.on('scroll', toolbarScrollListener);

          scope.$on('$destroy', function () {
            $wrappedWindow.off('scroll', toolbarScrollListener);
          });
        }
      }
    };
  }]);
