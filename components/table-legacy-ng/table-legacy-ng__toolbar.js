import angular from 'angular';
import 'dom4';

import {getDocumentScrollTop} from '../global/dom';
import '../table-legacy/table-legacy__toolbar.scss';
import scheduleRAF from '../global/schedule-raf';

const angularModule = angular.module('Ring.table-legacy.toolbar', []);
angularModule.directive('rgLegacyTableToolbar', function rgLegacyTableToolbarDirective() {
  const scheduleScrollListener = scheduleRAF();

  return {
    restrict: 'E',
    replace: true,
    transclude: true,
    template: '<div class="ring-table__toolbar"><div class="ring-table__toolbar-controls ring-popup-container-mark" ng-transclude></div></div>',
    scope: {
      toolbarIsReady: '=?'
    },
    link: function link(scope, iElement, attrs) {
      /**
       * Use plain DOM functions without any jquery. Should work with IE8+
       */
      const element = iElement[0];
      const controlsContainer = element.query('.ring-table__toolbar-controls');
      let savedToolbarTop;

      const toolbarScrollListener = () => scheduleScrollListener(() => {
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
      });

      //Stick toolbar if sticking is enabled
      if (attrs.stick !== undefined) {
        window.addEventListener('scroll', toolbarScrollListener);

        scope.$on('$destroy', () => {
          window.removeEventListener('scroll', toolbarScrollListener);
        });
      }

      scope.toolbarIsReady = true;
    }
  };
});

export default angularModule.name;
