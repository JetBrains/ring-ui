'use strict';

var PopupMenu = require('popup-menu/popup-menu');

/*
 <button class="ring-btn dashboard-buttons__add" dropdown items="widgetList" on-item-select="createWidget" label-field="label">
 <span translate>Add widget</span> <span class="" react="Icon" glyph="'caret-down'" size="16" color="'black'"></span>
 </button>
 */

/**
 * @name dropdown-ng
 * @constructor
 * @description Directive for dropdowns in angular apps
<example name="dropdown-ng">
  <button class="ring-btn" ring-dropdown items="['test1', 'test2']" on-item-select="onSelect"">
    Do something
  </button>
</example>
 */

/* globals angular */
angular.module('Ring.dropdown', [])
  .directive('ringDropdown', function() {
    return {
      restrict: 'A',
      scope: {
        items: '=',
        labelField: '@',
        onItemSelect: '='
      },
      controller: ['$scope', '$element', function ($scope, $element) {
        $scope.popupMenuInstance = null;

        $scope.renderPopup = function (items) {
          $scope.popupMenuInstance = PopupMenu.renderComponent(new PopupMenu({
            corner: PopupMenu.PopupProps.Corner.BOTTOM_LEFT,
            direction: PopupMenu.PopupProps.Directions.BOTTOM,
            anchorElement: $element[0],
            data: items,
            autoRemove: false,
            cutEdge: false,
            hidden: true,
            top: 2
          }));
        };

        var convertItemsForPopup = function (items) {
          return items.map(function (item) {
            return {
              label: item[$scope.labelField] || item,
              onClick: function () {
                $scope.$apply(function () {
                  $scope.onItemSelect(item);
                });
                $scope.popupMenuInstance.hide();
              }
            };
          });
        };

        $scope.$watch('items', function (items) {
          if (angular.isArray(items)){
            if (!$scope.popupMenuInstance) {
              $scope.renderPopup(convertItemsForPopup(items));
            } else {
              $scope.popupMenuInstance.setProps({data: convertItemsForPopup(items)});
            }
          }
        });

        $element.on('click', function ($event) {
          $scope.popupMenuInstance.show();
          $event.stopPropagation();
        });
      }]
    };
  });
