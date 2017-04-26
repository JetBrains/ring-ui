import debounce from 'mout/function/debounce';
import 'dom4';

import {getDocumentScrollTop, getWindowHeight} from '../global/dom';

import './docked-panel-ng.scss';

/**
 * @name Docked Panel Ng
 * @category Angular Components
 * @description Creates a panel docked at the bottom of the page.
 * @example
   <example name="Docked Panel Ng">
     <file name="index.html">
      <div ng-app='DockedPanelExample'>
        <div>
          <textarea placeholder="Add description" rows="70" cols="100"></textarea>
        </div>
        <div class="ring-panel" rg-docked-panel rg-docked-panel-class="customCssClass">
          <button class="ring-button ring-button_blue">Save</button>
          <button class="ring-button"Revert>Cancel</button>
        </div>
        <br/>
        <div>
          <textarea placeholder="Add steps" rows="10" cols="50"></textarea>
        </div>
      </div>
     </file>
     <file name="index.js" webpack="true">
      import 'angular';
      import 'ring-ui/components/button/button.scss';
      import 'ring-ui/components/panel/panel.scss';
      import 'ring-ui/components/docked-panel-ng/docked-panel-ng';
      angular.module('DockedPanelExample', ['Ring.docked-panel']);
     </file>
   </example>
 */

/* global angular:false */
const angularModule = angular.module('Ring.docked-panel', []);

angularModule.directive('rgDockedPanel', function rgDockedPanelDirective() {
  return {
    link: function link(scope, element, attrs) {
      const CSS_CLASS_NAME = 'ring-docked-panel';
      const dockedPanelClass = attrs.rgDockedPanelClass || '';
      let initialPos;
      let isDocked;

      /**
       * Container
       * @type {Element} panel
       */
      const panel = element[0];

      /**
       * Save panel initial rects and left margin for further use
       */
      function saveInitialPos() {
        const panelClientRect = panel.getBoundingClientRect();
        initialPos = panelClientRect.top + panelClientRect.height + getDocumentScrollTop();
      }

      /**
       * Docks the panel to the bottom of the page
       */
      function dock() {
        panel.classList.add(CSS_CLASS_NAME);
        if (dockedPanelClass) {
          panel.classList.add(dockedPanelClass);
        }
        isDocked = true;
      }

      function undock() {
        panel.classList.remove(CSS_CLASS_NAME);
        if (dockedPanelClass) {
          panel.classList.remove(dockedPanelClass);
        }
        isDocked = false;
      }

      /**
       * Check panel position
       */
      function checkPanelPosition() {
        const currentPanelRect = panel.getBoundingClientRect();

        if (currentPanelRect.top + currentPanelRect.height > getWindowHeight() && !isDocked) {
          dock();
        } else if (isDocked && currentPanelRect.top + currentPanelRect.height + getDocumentScrollTop() >= initialPos) {
          undock();
        }
      }

      function init() {
        const scrollListener = debounce(checkPanelPosition, 10);

        /**
         * Wait until all content on the page is loaded
         */
        scope.$applyAsync(() => {
          window.addEventListener('scroll', scrollListener);
          window.addEventListener('resize', checkPanelPosition);

          scope.$on('$destroy', () => {
            window.removeEventListener('scroll', scrollListener);
            window.removeEventListener('resize', checkPanelPosition);
          });

          saveInitialPos();
          checkPanelPosition();
        });
      }

      init();
    }
  };
});

export default angularModule.name;
