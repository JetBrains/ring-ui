require('./sticky-bottom-ng.scss');
var debounce = require('mout/function/debounce');

/**
 * @name Sticky bottom panel
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
   <div class="ring-panel" rg-sticky-bottom rg-sticky-bottom-class="customCssClass">
     <button class="ring-btn ring-btn_blue">Save</button>
     <button class="ring-btn"Revert</button>
   </div>
 </example>
 */

/* global angular:false */
angular.module('Ring.sticky-bottom', [])

  .directive('rgStickyBottom', function() {
    return {
      link: function(scope, element, attrs) {
        var STICKY_CSS_CLASS_NAME = 'ring-sticky-bottom';
        var customCssClassOnStick = attrs.rgStickyBottomClass;
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
          addCssClass(STICKY_CSS_CLASS_NAME);
          addCssClass(customCssClassOnStick);
          isPinned = true;
        };

        var unstick = function() {
          removeCssClass(STICKY_CSS_CLASS_NAME);
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
