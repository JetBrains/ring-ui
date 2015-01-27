/*global angular*/
var debounce = require('mout/function/debounce');
var $ = require('jquery');

angular.module('Ring.table.toolbar', [])
  .directive('rgTableToolbar', ['$window', function ($window) {
    var DEBOUNCE_INTERVAL = 10;

    return {
      restrict: 'E',
      replace: true,
      transclude: true,
      template: '<div class="table__toolbar__controls" ng-transclude></div>',
      link: function (scope, element, attrs) {
        var $wrappedWindow = $($window);
        var $element = $(element);
        var savedToolbarTop;

        var toolbarScrollListener = debounce(function () {
          var toolbarTop = savedToolbarTop || $element.offset().top;
          var scrolledTop = $window.scrollY;

          if (scrolledTop > toolbarTop) {
            savedToolbarTop = toolbarTop;
            $element.addClass('table__toolbar__controls_fixed');
          } else {
            savedToolbarTop = null;
            $element.removeClass('table__toolbar__controls_fixed');
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
