import debounce from 'mout/function/debounce';
import './docked-panel-ng.scss';

/**
 * @name Docked panel ng
 * @description Should stick panel at the bottom of the page
 *              if it's out of the browser viewport
 * @example
 * <example name="Docked panel ng">
  <file name="index.html">
  <div ng-app='DockedPanelExample'>
    <div>
      <textarea placeholder="Add description" rows="70" cols="100"></textarea>
    </div>
    <div class="ring-panel" rg-docked-panel rg-docked-panel-class="customCssClass">
      <button class="ring-btn ring-btn_blue">Save</button>
      <button class="ring-btn"Revert>Cancel</button>
    </div>
    <br/>
    <div>
      <textarea placeholder="Add steps" rows="10" cols="50"></textarea>
    </div>
  </div>
  </file>
  <file name="index.js" webpack="true">
    require('angular');
    require('ring-ui/components/button/button.scss');
    require('ring-ui/components/panel/panel.scss');
    require('ring-ui/components/docked-panel-ng/docked-panel-ng');
    angular.module('DockedPanelExample', ['Ring.docked-panel']);
  </file>
  </example>
 */

/* global angular:false */
angular.module('Ring.docked-panel', [])

  .directive('rgDockedPanel', function () {
    return {
      link: function (scope, element, attrs) {
        const CSS_CLASS_NAME = 'ring-docked-panel';
        const customCssClassOnStick = attrs.rgDockedPanelClass;
        let panelInitialBottomPos;
        let isPinned;

        /**
         * Sticky container
         * @type {Element} panel
         */
        const panel = element[0];

        const isClassListSupported = angular.isDefined(panel.classList);

        /**
         * Save panel initial rects and left margin for further use
         */
        function savePanelInitialBottomPos() {
          panelInitialBottomPos = panel.getBoundingClientRect().bottom;
        }

        function getWindowHeight() {
          return window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
        }

        function getDocumentScrollTop() {
          return (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop;
        }

        /**
         * @param {String} className
         */
        function addCssClass(className) {
          if (className) {
            if (isClassListSupported) {
              panel.classList.add(className);
            } else {
              panel.className += ' ' + className;
            }
          }
        }

        /**
         * @param {String} className
         */
        function removeCssClass(className) {
          if (isClassListSupported) {
            panel.classList.remove(className);
          } else {
            panel.className = panel.className.replace(className, '');
          }
        }

        /**
         * Pin panel at the bottom of the page
         */
        function stick() {
          addCssClass(CSS_CLASS_NAME);
          addCssClass(customCssClassOnStick);
          isPinned = true;
        }

        function unstick() {
          removeCssClass(CSS_CLASS_NAME);
          removeCssClass(customCssClassOnStick);
          isPinned = false;
        }

        /**
         * Check panel position
         */
        function checkPanelPosition() {
          const currentPanelBottomPos = panel.getBoundingClientRect().bottom;

          if (currentPanelBottomPos > getWindowHeight() && !isPinned) {
            stick();

          } else if (isPinned && currentPanelBottomPos + getDocumentScrollTop() >= panelInitialBottomPos) {
            unstick();
          }
        }

        function init() {
          const scrollListener = debounce(checkPanelPosition, 10);

          /**
           * Wait until all content on the page is loaded
           */
          scope.$applyAsync(function () {
            window.addEventListener('scroll', scrollListener);
            window.addEventListener('resize', checkPanelPosition);

            scope.$on('$destroy', function () {
              window.removeEventListener('scroll', scrollListener);
              window.removeEventListener('resize', checkPanelPosition);
            });

            savePanelInitialBottomPos();
            checkPanelPosition();
          });
        }

        init();
      }
    };
  }
);
