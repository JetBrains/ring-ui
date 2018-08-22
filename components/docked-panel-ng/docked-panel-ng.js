import angular from 'angular';
import 'dom4';

import scheduleRAF from '../global/schedule-raf';
import {getDocumentScrollTop, getWindowHeight} from '../global/dom';

import './docked-panel-ng.scss';

const scheduleScroll = scheduleRAF();

/**
 * @name Docked Panel Ng
 * @category Legacy Angular Components
 * @description Creates a panel docked at the bottom of the page.
 * @example
   <example name="Docked Panel Ng">
     <file name="index.html" disable-auto-size>
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
      import angular from 'angular';
      import '@jetbrains/ring-ui/components/button/button.scss';
      import '@jetbrains/ring-ui/components/panel/panel.scss';
      import DockedPanelNG from '@jetbrains/ring-ui/components/docked-panel-ng/docked-panel-ng';
      angular.module('DockedPanelExample', [DockedPanelNG]);
     </file>
   </example>
 */

const angularModule = angular.module('Ring.docked-panel', []);

angularModule.directive('rgDockedPanel', function rgDockedPanelDirective($parse, $timeout) {
  return {
    link: function link(scope, element, attrs) {
      const CSS_CLASS_NAME = 'ring-docked-panel';
      const dockedPanelClass = attrs.rgDockedPanelClass || '';
      const config = attrs.rgDockedPanelConfig ? $parse(attrs.rgDockedPanelConfig)(scope) : null;
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

      function onBeforeDock() {
        if (config) {
          if (config.beforeDock) {
            scope.$eval(config.beforeDock(element));
          }
          if (config.className) {
            panel.classList.add(config.className);
          }
        }
      }

      function onBeforeUndock() {
        if (config) {
          if (config.beforeUndock) {
            scope.$eval(config.beforeUndock(element));
          }
          if (config.className) {
            panel.classList.remove(config.className);
          }
        }
      }

      /**
       * Docks the panel to the bottom of the page
       */
      function dock() {
        onBeforeDock();

        panel.classList.add(CSS_CLASS_NAME);
        if (dockedPanelClass) {
          panel.classList.add(dockedPanelClass);
        }
        isDocked = true;
      }

      function undock() {
        onBeforeUndock();

        panel.classList.remove(CSS_CLASS_NAME);
        if (dockedPanelClass) {
          panel.classList.remove(dockedPanelClass);
        }
        isDocked = false;
      }

      function onResize() {
        if (config) {
          if (config && config.onResize) {
            scope.$eval(config.onResize(element, isDocked));
          }
        }
      }

      /**
       * Check panel position
       */
      function checkPanelPosition() {
        const currentPanelRect = panel.getBoundingClientRect();

        if (currentPanelRect.top + currentPanelRect.height > getWindowHeight() && !isDocked) {
          dock();
        } else if (
          isDocked &&
          currentPanelRect.top + currentPanelRect.height + getDocumentScrollTop() >= initialPos
        ) {
          undock();
        }
      }

      function init() {
        const _onResize = () => {
          checkPanelPosition();
          onResize();
        };
        const scrollListener = () => scheduleScroll(checkPanelPosition);

        /**
         * Wait until all content on the page is loaded
         */
        scope.$applyAsync(() => {
          window.addEventListener('scroll', scrollListener);
          window.addEventListener('resize', _onResize);

          scope.$on('$destroy', () => {
            window.removeEventListener('scroll', scrollListener);
            window.removeEventListener('resize', _onResize);
          });

          $timeout(() => {
            saveInitialPos();
            checkPanelPosition();
          });
        });
      }

      init();
    }
  };
});

export default angularModule.name;
