require('./panel-save.scss');
var debounce = require('mout/function/debounce');

/**
 * @name Sticky save panel
 * @description Should stick panel at the bottom of the page
 *              if it's out of the browser viewport
 * @example
 <file name="index.html">
   <div class="ring-form__group">
     <label class="ring-form__label">Description</label>
     <div class="ring-form__control">
       <textarea rows="150" class="ring-textarea ring-form__input ring-form__input_long" ></textarea>
     </div>
   </div>
   <rg-save-panel>
     <button class="ring-btn ring-btn_blue">Save</button>
     <button class="ring-btn"Revert</button>
   </rg-save-panel>
 </example>
 */

/* global angular:false */
angular.module('Ring.panel-save', [])

  .directive('rgPanelSave', function() {
    return {
      restrict: 'E',
      transclude: true,
      replace: true,
      template: '<div class="ring-panel ring-panel-save" ng-transclude></div>',
      link: function(scope, element) {
        var STICKY_CSS_CLASS_NAME = 'ring-panel-save_sticky';
        var panelInitialRect;
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
        var savePanelInitialRect = function() {
          panelInitialRect = panel.getBoundingClientRect();
        };

        var getWindowHeight = function() {
          return window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
        };

        var getDocumentScrollTop = function() {
          return (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop;
        };

        /**
         * Pin panel at the bottom of the page
         */
        var stick = function() {
          if (isClassListSupported) {
            panel.classList.add(STICKY_CSS_CLASS_NAME);
          } else {
            panel.className += ' ' + STICKY_CSS_CLASS_NAME;
          }
          isPinned = true;
        };

        var unstick = function() {
          if (isClassListSupported) {
            panel.classList.remove(STICKY_CSS_CLASS_NAME);
          } else {
            panel.className = panel.className.replace(STICKY_CSS_CLASS_NAME, '');
          }
          isPinned = false;
        };

        /**
         * Check panel position
         */
        var checkPanelPosition = function() {
          var currentPanelBottomPos = panel.getBoundingClientRect().bottom;

          if (currentPanelBottomPos > getWindowHeight() && !isPinned) {
            stick();

          } else if (isPinned && currentPanelBottomPos + getDocumentScrollTop() >= panelInitialRect.bottom) {
            unstick();
          }
        };

        /**
         * Set scroll listener
         * @type Function
         */
        var scrollListener = debounce(checkPanelPosition, 10);

        var init = function() {
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

            savePanelInitialRect();
            checkPanelPosition();
          });
        };

        init();
      }
    };
  }
);
