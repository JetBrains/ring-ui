/*global angular*/
import 'dom4';

import {getDocumentScrollTop} from '../dom/dom';

import debounce from 'mout/function/debounce';

/**
 * Sticky toolbar, mostly for tables, but can be used elsewhere too.
 * @example
 * <example>
     <rg-table-toolbar stick>
        <ng-include src="'ring-ui/components/project-list/project-list__toolbar.tpl.html'"></ng-include>
     </rg-table-toolbar>
   </example>
 */

const angularModule = angular.module('Ring.table.toolbar', []);
angularModule.directive('rgTableToolbar', () => {
  const DEBOUNCE_INTERVAL = 10;

  return {
    restrict: 'E',
    replace: true,
    transclude: true,
    template: '<div class="ring-table__toolbar"><div class="ring-table__toolbar-controls" ng-transclude></div></div>',
    link(scope, iElement, attrs) {
      /**
       * Use plain DOM functions without any jquery. Should work with IE8+
       */
      const element = iElement[0];
      const controlsContainer = element.query('.ring-table__toolbar-controls');
      let savedToolbarTop;

      const toolbarScrollListener = debounce(() => {
        const scrolledTop = getDocumentScrollTop();
        const elementTop = element.getBoundingClientRect().top + scrolledTop;
        const toolbarTop = savedToolbarTop || elementTop;

        if (scrolledTop > toolbarTop && !savedToolbarTop) {
          //save height to style to prevent collapsing after fixing controls
          element.style.height = `${element.offsetHeight}px`;
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

        scope.$on('$destroy', () => {
          window.removeEventListener('scroll', toolbarScrollListener);
        });
      }
    }
  };
});

export default angularModule.name;
