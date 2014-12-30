'use strict';

var PopupMenu = require('popup-menu/popup-menu');

/**
 * @name dropdown-ng
 * @constructor
 * @description Directive for dropdowns in angular apps
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
        labelField: '@',
        onItemSelect: '='
      },
      controller: ['$scope', '$element', '$q', function($scope, $element, $q) {
        $scope.popupMenuInstance = null;

        /**
         * @return {Object} The popup menu instance
         */
        $scope.getPopupMenu = function() {
          if (!$scope.popupMenuInstance) {
            $scope.popupMenuInstance = PopupMenu.renderComponent(new PopupMenu({
              corner: PopupMenu.PopupProps.Corner.BOTTOM_LEFT,
              direction: PopupMenu.PopupProps.Directions.BOTTOM,
              anchorElement: $element[0],
              data: [],
              autoRemove: false,
              cutEdge: false,
              hidden: true,
              top: 2
            }));
          }

          return $scope.popupMenuInstance;
        };

        /**
         * @return {q.promise} The deferred object which represent popup items
         */
        var getItems = function() {
          if ($scope.items && $scope.items.then) {
            return $scope.items;
          }

          var defer = $q.defer();
          defer.resolve($scope.items);
          return defer.promise;
        };

        var convertItemsForPopup = function(items) {
          return items.map(function(item) {
            return {
              label: item[$scope.labelField] || item,
              onClick: function() {
                $scope.$apply(function() {
                  $scope.onItemSelect(item);
                });
                $scope.getPopupMenu().hide();
              }
            };
          });
        };

        $scope.$watch('items', function() {
          getItems().then(function(items) {
            if (angular.isArray(items)) {
              $scope.getPopupMenu().setProps({
                data: convertItemsForPopup(items)
              });
            }
          });
        });

        $scope.onClick = function() {
          getItems().then(function() {
            $scope.getPopupMenu().show();
          });
        };

        $element.on('click', $scope.onClick);
      }]
    };
  });
