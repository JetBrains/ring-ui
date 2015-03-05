/*global angular*/
var debounce = require('mout/function/debounce');
var FIXED_ATTR = 'element-fixed';

/**
 * @name Table toolbar
 * @description Stickable toolbar, usable for tables, but can be used elsewhere.
 * Supports exposing fixing interface for sidebar-ng - sets attribute
 * element-fixed="true" when becomes fixed;
 * @example
 * <example>
     <rg-table-toolbar stick>
        <ng-include src="'project-list/project-list__toolbar.tpl.html'"></ng-include>
     </rg-table-toolbar>
   </example>
 */

angular.module('Ring.table.toolbar', [])
  .directive('rgTableToolbar', ['$window', '$document', function ($window, $document) {
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
        var controlsContainer = element.querySelector('.ring-table__toolbar-controls');

        /**
         * Makes toolbar sticky
         * @param toolbarControls - controls DOM node
         */
        var makeToolbarFixed = function (toolbarControls) {
          if (toolbarControls.classList) {
            toolbarControls.classList.add('ring-table__toolbar-controls_fixed');
          } else {
            toolbarControls.className += ' ' + 'ring-table__toolbar-controls_fixed';
          }

          /**
           * Expose specified attribute for sidebar to make it fixed and placed under toolbar
           */
          element.setAttribute(FIXED_ATTR, 'true');
        };

        /**
         * Makes toolbar free (not sticky)
         * @param toolbarControls - controls DOM node
         */
        var freeToolbar = function (toolbarControls) {
          if (toolbarControls.classList) {
            toolbarControls.classList.remove('ring-table__toolbar-controls_fixed');
          } else {
            toolbarControls.className = controlsContainer.className.replace('ring-table__toolbar-controls_fixed', '');
          }

          /**
           * Remove specified attribute to make sidebar stop being fixed
           */
          element.removeAttribute(FIXED_ATTR);
        };

        var savedToolbarTop;

        var toolbarScrollListener = debounce(function () {

          var elementTop = element.getBoundingClientRect().top + $document[0].body.scrollTop;

          var toolbarTop = savedToolbarTop || elementTop;
          var scrolledTop = $window.scrollY;

          if (scrolledTop > toolbarTop && !savedToolbarTop) {
            //save height to style to prevent collapsing after fixing controls
            element.style.height = element.offsetHeight + 'px';
            savedToolbarTop = toolbarTop;

            makeToolbarFixed(controlsContainer);
          } else if (scrolledTop <= toolbarTop && savedToolbarTop >= 0) {
            savedToolbarTop = null;
            element.style.height = null;

            freeToolbar(controlsContainer);
          }
        }, DEBOUNCE_INTERVAL);

        //Stick toolbar if sticking is enabled
        if (attrs.stick !== undefined) {
          $window.addEventListener('scroll', toolbarScrollListener);

          scope.$on('$destroy', function () {
            $window.removeEventListener('scroll', toolbarScrollListener);
          });
        }
      }
    };
  }]);
