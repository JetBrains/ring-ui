/**
 * @name Place Under Ng
 */

import angular from 'angular';

import 'dom4';
import debounce from 'just-debounce-it';
import createResizeDetector from 'element-resize-detector';

import {getDocumentScrollTop} from '../global/dom';

const resizeDetector = createResizeDetector();

const angularModule = angular.module('Ring.place-under', []);
angularModule.directive('rgPlaceUnder',
  function rgPlaceUnderDirective($window, getClosestElementWithCommonParent, rgPlaceUnderHelper) {
    return {
      restrict: 'A',
      link: function link(scope, iElement, iAttrs) {
        const element = iElement[0];
        const synchronizer = rgPlaceUnderHelper.createPositionSynchronizer(element, iAttrs, scope);

        function startSyncing(placeUnderSelector) {
          if (placeUnderSelector) {
            scope.$evalAsync(() => {
              const syncWith = getClosestElementWithCommonParent(element, placeUnderSelector);

              if (syncWith) {
                synchronizer.syncPositionWith(syncWith);
              } else {
                throw new Error('rgPlaceUnder cannot find element to sync with.');
              }
            });
          }
        }

        iAttrs.$observe('rgPlaceUnder', startSyncing);
      }
    };
  }
);


angularModule.factory('getClosestElementWithCommonParent',
  function getClosestElementWithCommonParentFactory() {
    return function getClosestElementWithCommonParent(currentElement, selector) {
      const parent = currentElement.parentNode;
      if (parent) {
        return parent.query(selector) || getClosestElementWithCommonParent(parent, selector);
      } else {
        return null;
      }
    };
  }
);


angularModule.factory('rgPlaceUnderHelper', $window => {
  const DEBOUNCE_INTERVAL = 10;
  const AFTER_SCROLL_RECHECK_INTERVAL = 50;
  const HEIGHT_CHECK_INTERVAL = 50;

  return {
    DEBOUNCE_INTERVAL,
    AFTER_SCROLL_RECHECK_INTERVAL,
    HEIGHT_CHECK_INTERVAL,
    createPositionSynchronizer: (element, iAttrs, scope) => {
      const topOffset = parseInt(iAttrs.placeTopOffset, 10) || 0;
      const syncHeight = iAttrs.syncHeight;

      let syncBottom = [];
      let removeScrollListener = [];

      if (iAttrs.syncBottom) {
        syncBottom = iAttrs.syncBottom.split(',');
      }

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

      function onScroll(syncElement) {
        const documentScrollTop = getDocumentScrollTop();
        const documentOffsetHeight =
          ($window.document.documentElement && $window.document.documentElement.offsetHeight) ||
          $window.document.body.offsetHeight;

        const syncedElementHeight = syncElement.offsetHeight;
        const syncedElementOffsetTop = syncElement.getBoundingClientRect().top + documentScrollTop;

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
              const syncBottomParams = syncBottom[i].split(';');
              const elem = $window.document.querySelector(syncBottomParams[0]);
              const extraMargin = syncBottomParams[1] ? parseInt(syncBottomParams[1], 10) : 0;

              if (elem) {
                const boundingRect = elem.getBoundingClientRect();

                if (boundingRect.top === 0) {
                  continue;
                }

                const marginTop = parseInt($window.getComputedStyle(elem).
                  getPropertyValue('margin-top'), 10);
                bottomOffset = documentOffsetHeight - boundingRect.top + marginTop + extraMargin;
                if (bottomOffset < 0) {
                  bottomOffset = 0;
                }

                break;
              }
            }
          }

          element.style.height = `calc(100% - ${parseInt(element.style.marginTop, 10) + bottomOffset}px)`;
        }
      }

      function removeScrollListeners() {
        removeScrollListener.map(cb => cb());
        removeScrollListener = [];
      }

      function syncPositionWith(syncElement) {
        removeScrollListeners();

        const afterScrollFinishRecheck =
          debounce(() => this.onScroll(syncElement), AFTER_SCROLL_RECHECK_INTERVAL);

        const sidebarScrollListener = debounce(() => {
          this.onScroll(syncElement);
          afterScrollFinishRecheck();
        }, DEBOUNCE_INTERVAL);

        this.waitForNonZeroHeight(syncElement).then(sidebarScrollListener);

        $window.addEventListener('scroll', sidebarScrollListener);
        removeScrollListener.push(() => {
          $window.removeEventListener('scroll', sidebarScrollListener);
        });


        removeScrollListener.push(scope.$watch('show', sidebarScrollListener));
        removeScrollListener.push(scope.$on('rgPlaceUnder:sync', sidebarScrollListener));


        const elementToHeightListening = iAttrs.listenToHeightChange
          ? $window.document.querySelector(iAttrs.listenToHeightChange)
          : $window.document.body;
        resizeDetector.listenTo(elementToHeightListening, sidebarScrollListener);
        removeScrollListener.
          push(() => resizeDetector.removeAllListeners(elementToHeightListening));
      }

      scope.$on('$destroy', removeScrollListeners);

      return {
        waitForNonZeroHeight,
        onScroll,
        syncPositionWith
      };
    }
  };
});

export default angularModule.name;
