'use strict';

var PopupMenu = require('popup-menu/popup-menu');

/**
 * @name dropdown-ng
 * @constructor
 * @description Directive for dropdowns in angular apps
 * @example
 <example name="dropdown-ng">
    <button class="ring-btn"
            rg-dropdown
            items="['test1', 'test2']"
            on-item-select="onSelect"
            config="{corner: 2, autoRemove: true, direction: 8}">
        Do something
    </button>
    <button class="ring-btn"
            rg-dropdown
            items-src="functionWhichReturnsPromiseForLazyLoad"
            on-item-select="onSelect"
            config="{corner: 2, autoRemove: true, direction: 8}">
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
      controller: ['$scope', '$element', '$location', function ($scope, $element) {
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

        function getItemType(item) {
          var type = angular.isDefined(item.type) ? item.type : ITEM_TYPES.ITEM;
          if(item.url || item.type === 'link') {
            type = ITEM_TYPES.LINK;
          }
          return type;
        }

        function convertItemsForPopup(items) {
          items = items || [];
          if ($element.attr('items-passthru') !== undefined) {
            return items;
          }

          return items.map(function (item) {
            return {
              label: item[$scope.labelField] || item.label || item,
              description: item.description,
              type: getItemType(item),
              href: item.url ? item.url : null,
              onClick: function () {
                $scope.$apply(function () {
                  if ($scope.onItemSelect) {
                    $scope.onItemSelect(item);
                  }

                  if (item.onSelect) {
                    item.onSelect.apply(item);
                  }
                });
                popupMenuInstance.hide();
              }
            };
          });
        }

        function setItems(items) {
          if (angular.isArray(items) && items.length) {
            config.data = convertItemsForPopup(items);
            if (!popupMenuInstance) {
              popupMenuInstance = PopupMenu.renderComponent(new PopupMenu(config));
            } else {
              popupMenuInstance.setProps(config);
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
