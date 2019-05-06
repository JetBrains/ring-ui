import angular from 'angular';
import 'dom4';

import scheduleRAF from '../global/schedule-raf';
import {getDocumentScrollTop, getWindowHeight} from '../global/dom';

import './docked-panel-ng.scss';

const scheduleScroll = scheduleRAF();

/**
 * @name Docked Panel Ng
 */

const angularModule = angular.module('Ring.docked-panel', []);

angularModule.directive('rgDockedPanel', function rgDockedPanelDirective($parse) {
  return {
    link: function link(scope, element, attrs) {
      const TOGGLE_GAP = 8;
      const CSS_CLASS_NAME = 'ring-docked-panel';
      const DOCKED_CSS_CLASS_NAME = 'ring-docked-panel_fixed';
      const dockedPanelClass = attrs.rgDockedPanelClass || '';
      const config = attrs.rgDockedPanelConfig ? $parse(attrs.rgDockedPanelConfig)(scope) : null;
      let initialPanelPos;
      let isDocked;

      /**
       * Container
       * @type {Element} panel
       */
      const panel = element[0];

      panel.classList.add(CSS_CLASS_NAME);

      function getYPosition(node) {
        const clientRect = node.getBoundingClientRect();
        return clientRect.top + clientRect.height + getScrollContainerScrollTop();
      }

      /**
       * Save panel initial rects and left margin and container-node for further use
       */
      function saveInitialPos() {
        initialPanelPos = getYPosition(panel);
      }

      function getInitialUndockedPosition() {
        return (config || {}).container ? getYPosition(config.container) : initialPanelPos;
      }

      function getScrollContainerScrollTop() {
        if (config && config.scrollContainer) {
          return config.scrollContainer.scrollTop;
        }
        return getDocumentScrollTop();
      }

      function getScrollContainerHeight() {
        if (config && config.scrollContainer) {
          return config.scrollContainer.getBoundingClientRect().height;
        }
        return getWindowHeight();
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

        panel.classList.add(DOCKED_CSS_CLASS_NAME);
        if (dockedPanelClass) {
          panel.classList.add(dockedPanelClass);
        }
        isDocked = true;
      }

      function undock() {
        onBeforeUndock();

        panel.classList.remove(DOCKED_CSS_CLASS_NAME);
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

        if (currentPanelRect.top + currentPanelRect.height > getScrollContainerHeight() &&
          !isDocked) {
          dock();
        } else if (
          isDocked &&
          currentPanelRect.top + currentPanelRect.height +
            getScrollContainerScrollTop() >= getInitialUndockedPosition() + TOGGLE_GAP
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
          const scrollContainer = (config || {}).scrollContainer || window;

          scrollContainer.addEventListener('scroll', scrollListener);
          window.addEventListener('resize', _onResize);

          scope.$on('$destroy', () => {
            scrollContainer.removeEventListener('scroll', scrollListener);
            window.removeEventListener('resize', _onResize);
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
