'use strict';

var PopupMenu = require('popup-menu/popup-menu');

/**
 * @name dropdown-ng
 * @constructor
 * @description Directive for dropdowns in angular apps
 * @example
  <example name="dropdown-ng">
    <button class="ring-btn" rg-dropdown items="['test1', 'test2']" on-item-select="onSelect"">
      Do something
    </button>
  </example>
 */

/* globals angular */
angular.module('Ring.dropdown', [])
  .directive('rgDropdown', function() {
    return {
      restrict: 'A',
      scope: {
        items: '=',
        itemsSrc: '&',
        config: '&',
        labelField: '@',
        onItemSelect: '='
      },
      controller: ['$scope', '$element', '$location', function ($scope, $element, $location) {
        var popupMenuInstance = null;
        var ITEM_TYPES = {
          LINK: 1,
          ITEM: 2
        };

        var config = angular.extend({}, $scope.config() || {}, {
          anchorElement: $element[0],
          autoRemove: false,
          cutEdge: false,
          hidden: true,
          top: 2
        });

        function createPopup(items) {
          config.data = items;
          popupMenuInstance = PopupMenu.renderComponent(new PopupMenu(config));
        }

        function convertItemsForPopup(items) {
          if ($element.attr('items-passthru') !== undefined) {
            return items;
          }

          return items.map(function (item) {
            var type = ITEM_TYPES.ITEM;
            if(item.url || item.type === 'link') {
              type = ITEM_TYPES.LINK;
            }

            return {
              label: item[$scope.labelField] || item.label || item,
              type: type,
              onClick: function () {
                $scope.$apply(function () {
                  if ($scope.onItemSelect) {
                    $scope.onItemSelect(item);
                  }

                  if (item.onClick) {
                    item.onClick.apply(item);
                  }

                  if (item.url) {
                    $location.path(item.url);
                  }
                });
                popupMenuInstance.hide();
              }
            };
          });
        }

        function setItems(items) {
          if (angular.isArray(items)) {
            if (!popupMenuInstance) {
              createPopup(convertItemsForPopup(items));
            } else {
              popupMenuInstance.setProps({data: convertItemsForPopup(items)});
            }
          }
        }

        var itemsSrc = $scope.itemsSrc();
        if (typeof itemsSrc !== 'function') {
          $scope.$watch('items', function (items) {
            setItems(items);
          }, true);
        }

        $element.on('click', function ($event) {
          if (!popupMenuInstance && typeof itemsSrc === 'function') {
            var promise = itemsSrc();
            if (promise.then) {
              promise.then(function(items) {
                setItems(items);
                if (popupMenuInstance) {
                  popupMenuInstance.show();
                }
              });
            }
          } else if (popupMenuInstance) {
            popupMenuInstance.show();
          }
          $event.stopPropagation();
        });

        /**
         * Export popupMenuInstance to check its state in tests
         * @returns {PopupMenu}
         */
        $scope.getPopupMenuInstance = function() {
          return popupMenuInstance;
        };
      }]
    };
  });
