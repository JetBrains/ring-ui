require('./docked-panel-ng.scss');
var debounce = require('mout/function/debounce');

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
    require('angular/angular.min.js');
    require('button/button.scss');
    require('panel/panel.scss');
    require('docked-panel-ng/docked-panel-ng');
    angular.module('DockedPanelExample', ['Ring.docked-panel']);
  </file>
  </example>
 */

/* global angular:false */
angular.module('Ring.docked-panel', [])

  .directive('rgDockedPanel', function() {
    return {
      link: function(scope, element, attrs) {
        var CSS_CLASS_NAME = 'ring-docked-panel';
        var customCssClassOnStick = attrs.rgDockedPanelClass;
        var panelInitialBottomPos;
        var isPinned;

        /**
         * Sticky container
         * @type {Element} panel
         */
        var panel = element[0];

        var isClassListSupported = angular.isDefined(panel.classList);

        /**
         * Save panel initial rects and left margin for further use
         */
        var savePanelInitialBottomPos = function() {
          panelInitialBottomPos = panel.getBoundingClientRect().bottom;
        };

        var getWindowHeight = function() {
          return window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
        };

        var getDocumentScrollTop = function() {
          return (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop;
        };

        /**
         * @param {String} className
         */
        var addCssClass = function(className) {
          if (className) {
            if (isClassListSupported) {
              panel.classList.add(className);
            } else {
              panel.className += ' ' + className;
            }
          }
        };

        /**
         * @param {String} className
         */
        var removeCssClass = function(className) {
          if (isClassListSupported) {
            panel.classList.remove(className);
          } else {
            panel.className = panel.className.replace(className, '');
          }
        };

        /**
         * Pin panel at the bottom of the page
         */
        var stick = function() {
          addCssClass(CSS_CLASS_NAME);
          addCssClass(customCssClassOnStick);
          isPinned = true;
        };

        var unstick = function() {
          removeCssClass(CSS_CLASS_NAME);
          removeCssClass(customCssClassOnStick);
          isPinned = false;
        };

        /**
         * Check panel position
         */
        var checkPanelPosition = function() {
          var currentPanelBottomPos = panel.getBoundingClientRect().bottom;

          if (currentPanelBottomPos > getWindowHeight() && !isPinned) {
            stick();

          } else if (isPinned && currentPanelBottomPos + getDocumentScrollTop() >= panelInitialBottomPos) {
            unstick();
          }
        };

        var init = function() {
          var scrollListener = debounce(checkPanelPosition, 10);

          /**
           * Wait until all content on the page is loaded
           */
          scope.$applyAsync(function() {
            window.addEventListener('scroll', scrollListener);
            window.addEventListener('resize', checkPanelPosition);

            scope.$on('$destroy', function() {
              window.removeEventListener('scroll', scrollListener);
              window.removeEventListener('resize', checkPanelPosition);
            });

            savePanelInitialBottomPos();
            checkPanelPosition();
          });
        };

        init();
      }
    };
  }
);
