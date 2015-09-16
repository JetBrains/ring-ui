/*global angular*/
require('dom4');
var debounce = require('mout/function/debounce');

/**
 * Sticky toolbar, mostly for tables, but can be used elsewhere too.
 * @example
 * <example>
     <rg-table-toolbar stick>
        <ng-include src="'project-list/project-list__toolbar.tpl.html'"></ng-include>
     </rg-table-toolbar>
   </example>
 */

angular.module('Ring.table.toolbar', [])
  .directive('rgTableToolbar', function () {
    var DEBOUNCE_INTERVAL = 10;

    return {
      restrict: 'E',
      replace: true,
      transclude: true,
      template: '<div class="ring-table__toolbar"><div class="ring-table__toolbar-controls" ng-transclude></div></div>',
      link: function (scope, iElement, attrs) {
        /**
         * Use plain DOM functions without any jquery. Should work with IE8+
         */
        var element = iElement[0];
        var controlsContainer = element.query('.ring-table__toolbar-controls');
        var savedToolbarTop;

        var toolbarScrollListener = debounce(function () {
          var scrolledTop = (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop;
          var elementTop = element.getBoundingClientRect().top + scrolledTop;
          var toolbarTop = savedToolbarTop || elementTop;

          if (scrolledTop > toolbarTop && !savedToolbarTop) {
            //save height to style to prevent collapsing after fixing controls
            element.style.height = element.offsetHeight + 'px';
            savedToolbarTop = toolbarTop;
            controlsContainer.classList.add('ring-table__toolbar-controls_fixed');
          } else if (scrolledTop <= toolbarTop && savedToolbarTop >= 0) {
            savedToolbarTop = null;
            element.style.height = null;
            controlsContainer.classList.remove('ring-table__toolbar-controls_fixed');
          }
        }, DEBOUNCE_INTERVAL);

        //Stick toolbar if sticking is enabled
        if (attrs.stick !== undefined) {
          window.addEventListener('scroll', toolbarScrollListener);

          scope.$on('$destroy', function () {
            window.removeEventListener('scroll', toolbarScrollListener);
          });
        }
      }
    };
  });
