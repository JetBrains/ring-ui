/**
 * This directive is a helper. Element with rg-place-under=".some-selector"
 * attribute will manually positioned under provided element. Target element
 * position should be 'absolute'
 */

import 'dom4';
import debounce from 'mout/function/debounce';
import ResizeSensor from 'css-element-queries/src/ResizeSensor';

import {getDocumentScrollTop} from '../dom/dom';

/**
 * @name Place Under Ng
 * @description Sidebar trying to fill the entire right half of its container.
 * To make sidebar have fixed positioning under some other element (e.g. toolbar),
 * a selector for that element should be passed as placeUnderSibling parameter.
 * @example
<example name="Place-under">
  <file name="index.html">
    <div ng-app="Ring.place-under">

      <div class="head">Scroll down to see the effect</div>
      <div rg-place-under=".target-element" class="place-under">
        Element to be positioned under test element
      </div>

      <div class="target-element">
        Test element to sync with.
      </div>

       <div class="scrollable">
         Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
         incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
         exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
         Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
         Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
       </div>
    </div>
  </file>
  <file name="index.js" webpack="true">
    require('./example.scss');
    require('angular');
    require('ring-ui/components/place-under-ng/place-under-ng');
    var dom = require('ring-ui/components/dom/dom');

    window.addEventListener('scroll', function(){
      var target = document.querySelector('.target-element');

      var scrolledTop = dom.getDocumentScrollTop();
      if (scrolledTop > 30) {
        target.style.position = 'fixed';
      } else {
        target.style.position = 'static';
      }
    });
  </file>
  <file name="example.scss">
    .place-under {
      position: fixed;
      top: 0;
      right: 0;
      width: 50%;
      background-color: #888;
    }

    .head {
      height: 30px;
    }

    .target-element {
      position: static;
      top: 0;
      width: 100%;
      background-color: #CCC;
    }

    .scrollable {
      height: 1000px;
      padding-top: 50px;
      background-color: #EEE;
    }
  </file>
</example>
*/


/* global angular: false */
const angularModule = angular.module('Ring.place-under', []);
/**
 * rg-place-under=".some-selector" = selector to point target element
 * place-top-offset="1" = offset in pixels
 * sync-bottom=".some-selector,.some-selector2" = selector to sunc bottom with
 * listen-to-height-change=".ring-table" = listen to element height change and update position
 */
angularModule.directive('rgPlaceUnder', ($window, getClosestElementWithCommonParent) => {
  const DEBOUNCE_INTERVAL = 10;
  const HEIGHT_CHECK_INTERVAL = 50;

  return {
    restrict: 'A',
    link(scope, iElement, iAttrs) {
      /**
       * Use plain JS to make sidebar stickable
       */
      const element = iElement[0];

      const topOffset = parseInt(iAttrs.placeTopOffset, 10) || 0;
      const syncHeight = iAttrs.syncHeight;
      let syncBottom = [];
      if (iAttrs.syncBottom) {
        syncBottom = iAttrs.syncBottom.split(',');
      }

      let documentResizeSensor;

      /**
       * Waits until passed element's height becomes non-zero and then resolves
       * @param elementToCheck
       * @returns {Promise}
       */
      function waitForNonZeroHeight(elementToCheck) {
        return new Promise(resolve => {
          function checkElementHeight() {
            if (elementToCheck.offsetHeight === 0) {
              $window.setTimeout(checkElementHeight, HEIGHT_CHECK_INTERVAL);
            } else {
              resolve();
            }
          }

          checkElementHeight();
        });
      }

      /**
       * Syncing sidebar position with other element bottom
       * @param syncWithElement - DOM node to sync with
       */
      function syncPositionWith(syncWithElement) {
        const sidebarScrollListener = debounce(() => {
          const documentScrollTop = getDocumentScrollTop();
          const dcoumentOffsetHeight = (document.documentElement && document.documentElement.offsetHeight) || document.body.offsetHeight;

          const syncedElementHeight = syncWithElement.offsetHeight;
          const syncedElementOffsetTop = syncWithElement.getBoundingClientRect().top + documentScrollTop;

          const bottom = syncedElementOffsetTop + syncedElementHeight;

          const margin = Math.max(bottom - documentScrollTop, syncedElementHeight);

          element.style.marginTop = `${margin + topOffset}px`;

          if (syncHeight) {
            /**
             * Decrease height by margin value to make scroll work properly
             */
            let bottomOffset = 0;
            if (syncBottom.length) {
              for (let i = 0; i < syncBottom.length; i++) {
                const elem = document.querySelector(syncBottom[i]);

                if (elem) {
                  const boundingRect = elem.getBoundingClientRect();

                  if (boundingRect.top === 0) {
                    continue;
                  }

                  const marginTop = parseInt(window.getComputedStyle(elem).getPropertyValue('margin-top'), 10);
                  bottomOffset = dcoumentOffsetHeight - boundingRect.top + marginTop;
                  if (bottomOffset < 0) {
                    bottomOffset = 0;
                  }

                  break;
                }
              }
            }

            element.style.height = `calc(100% - ${parseInt(element.style.marginTop, 10) + bottomOffset}px)`;
          }

        }, DEBOUNCE_INTERVAL);

        waitForNonZeroHeight(syncWithElement).then(sidebarScrollListener);

        window.addEventListener('scroll', sidebarScrollListener);
        scope.$watch('show', sidebarScrollListener);

        const elementToHeightListening = iAttrs.listenToHeightChange ? document.querySelector(iAttrs.listenToHeightChange) : document.body;
        documentResizeSensor = new ResizeSensor(elementToHeightListening, sidebarScrollListener);

        scope.$on('rgPlaceUnder:sync', sidebarScrollListener);

        scope.$on('$destroy', () => {
          window.removeEventListener('scroll', sidebarScrollListener);
          documentResizeSensor.detach();
          documentResizeSensor = null;
        });
      }

      function startSyncing(placeUnderSelector) {
        if (placeUnderSelector) {
          scope.$evalAsync(() => {
            const syncWith = getClosestElementWithCommonParent(element, placeUnderSelector);

            if (syncWith) {
              syncPositionWith(syncWith);
            } else {
              throw new Error('rgPlaceUnder cannot find element to sync with.');
            }
          });
        }
      }

      iAttrs.$observe('rgPlaceUnder', startSyncing);
    }
  };
});
/**
 * Recursive search for closest syncWith node with shared parent
 * @param currentElement - element to start search from
 * @param selector - selector to find
 * @returns {Node}
 */
angularModule.factory('getClosestElementWithCommonParent', () => function getClosestElementWithCommonParent(currentElement, selector) {
  const parent = currentElement.parentNode;
  if (parent) {
    return parent.query(selector) || getClosestElementWithCommonParent(parent, selector);
  } else {
    return null;
  }
});

export default angularModule.name;
