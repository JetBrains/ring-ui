/**
 * This directive is a helper. Element with rg-place-under=".some-selector"
 * attribute will manually positioned under provided element. Target element
 * position should be 'absolute'
 */
var debounce = require('mout/function/debounce');


/**
 * @name Place Under Ng
 * @description Sidebar trying to fill the entire right half of its container.
 * To make sidebar have fixed positioning under some other element (e.g. toolbar),
 * a selector for that element should be passed as placeUnderSibling parameter.
 * @example
<example name="Place-under">
  <file name="index.html">
    <div ng-app="Ring.place-under"
         style="position: relative;">
      <div rg-place-under=".some-element"
        style="position: absolute">Element to be positioned under test element</div>
      <div class="some-element">
        Test element to sync with.
      </div>
    </div>
  </file>
  <file name="index.js" webpack="true">
    require('angular/angular.min.js');
    require('place-under-ng/place-under-ng');
  </file>
</example>
*/


/* global angular: false */
angular.module('Ring.place-under', [])
/**
 * rg-place-under=".some-selector" = selector to point target element
 * place-top-offset="1" = offset in pixels
 */
  .directive('rgPlaceUnder', ['$window', '$document', function ($window, $document) {
    var DEBOUNCE_INTERVAL = 10;

    return {
      restrict: 'A',
      link: function (scope, iElement, iAttrs) {
        /**
         * Use plain JS to make sidebar stickable
         */
        var element = iElement[0];

        var topOffset = parseInt(iAttrs.placeTopOffset, 10) || 0;
        var placeUnderSelector = iAttrs.rgPlaceUnder;

        /**
         * Recursive search for closest syncWith node with shared parent
         * @param currentElement - element to start search from
         * @param selector - selector to find
         * @returns {Node}
         */
        var getElementToSyncWith = function getElementToSyncWith(currentElement, selector) {
          var parent = currentElement.parentNode;
          if (parent) {
            return parent.querySelector(placeUnderSelector) || getElementToSyncWith(parent, selector);
          } else {
            return null;
          }
        };

        /**
         * Syncing sidebar position with other element bottom
         * @param syncWithElement - DOM node to sync with
         */
        var syncPositionWith = function (syncWithElement) {

          var sidebarScrollListener = debounce(function () {
            var scrolledTop = ($document[0].documentElement && $document[0].documentElement.scrollTop) || $document[0].body.scrollTop;

            var syncedElementHeight = syncWithElement.offsetHeight;
            var syncedElementOffsetTop = syncWithElement.getBoundingClientRect().top + scrolledTop;

            var bottom = syncedElementOffsetTop + syncedElementHeight;

            var margin = Math.max(bottom - scrolledTop, syncedElementHeight);

            element.style.marginTop = margin + topOffset + 'px';

          }, DEBOUNCE_INTERVAL);

          sidebarScrollListener();

          $window.addEventListener('scroll', sidebarScrollListener);

          scope.$on('$destroy', function () {
            $window.removeEventListener('scroll', sidebarScrollListener);
          });

          scope.$watch('show', sidebarScrollListener);
        };

        if (placeUnderSelector) {
          scope.$evalAsync(function sync() {
            var syncWith = getElementToSyncWith(element, placeUnderSelector);

            if (syncWith) {
              syncPositionWith(syncWith);
            } else {
              throw new Error('rgPlaceUnder cannot find element to sync with.');
            }
          });
        }
      }
    };
  }]);
