'use strict';

var PopupMenu = require('popup-menu/popup-menu');

/*
 <button class="ring-btn dashboard-buttons__add" dropdown options="widgetList" on-item-select="createWidget" label-field="label">
 <span translate>Add widget</span> <span class="" react="Icon" glyph="'caret-down'" size="16" color="'black'"></span>
 </button>
 */

/**
 * @name dropdown-ng
 * @constructor
 * @description Directive for dropdowns in angular apps
<example name="dropdown-ng">
  <button class="ring-btn" ring-dropdown options="['test1', 'test2']" on-item-select="onSelect"">
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
        options: '=',
        labelField: '@',
        onItemSelect: '='
      },
      controller: ['$scope', '$element', function ($scope, $element) {
        var popupMenuInstance = null;

        $scope.renderPopup = function (items) {
          popupMenuInstance = PopupMenu.renderComponent(new PopupMenu({
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

        var convertOptionsForPopup = function (options) {
          return options.map(function (option) {
            return {
              label: option[$scope.labelField] || option,
              onClick: function () {
                $scope.$apply(function () {
                  $scope.onItemSelect(option);
                });
                popupMenuInstance.hide();
              }
            };
          });
        };

        $scope.$watch('options', function (options) {
          if (angular.isArray(options)){
            if (!popupMenuInstance) {
              $scope.renderPopup(convertOptionsForPopup(options));
            } else {
              popupMenuInstance.setProps({data: convertOptionsForPopup(options)});
            }
          }
        });

        $element.on('click', function ($event) {
          popupMenuInstance.show();
          $event.stopPropagation();
        });
      }]
    };
  });
