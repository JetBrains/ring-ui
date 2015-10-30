import {createElement} from 'react';
import PopupMenu from '../popup-menu/popup-menu';

/**
 * @name Dropdown Ng
 * @constructor
 * @description Directive for dropdowns in angular apps
 * @example
<example name="Dropdown Ng">
  <file name="index.html">
    <div ng-app='dropTest' ng-controller='testController as ctrl'>
      <button class="ring-btn"
              rg-dropdown
              items="ctrl.items"
              label-field="displayName"
              on-item-select="ctrl.onSelect"
              config="{corner: 2, direction: 8}">
        Do something
      </button>
      <button class="ring-btn"
              rg-dropdown
              items-src="ctrl.promiseSrc"
              on-item-select="ctrl.onSelect"
              config="{corner: 2, direction: 8}">
        Do something
      </button>
    </div>
  </file>
  <file name="index.js" webpack="true">
    require('ring-ui/components/button/button.scss');
    require('angular');
    require('ring-ui/components/dropdown-ng/dropdown-ng');

    angular.module('dropTest', ['Ring.dropdown'])
      .controller('testController', function($q, $scope){
        var ctrl = this;

        ctrl.items = [
          {displayName: 'Value is 1', key: 1, className: 'customClass'},
          {displayName: 'Value is 2', key: 2, icon: 'http://icon.com/icon.png'}
        ];

        ctrl.promiseSrc = function(){
          var defer = $q.defer();
          defer.resolve(['HELLO from promise', 'HELLO2']);
          return defer.promise;
        };

        ctrl.onSelect = function(item){
           alert('Selected ' + JSON.stringify(item));
        }
      });
  </file>
</example>
*/

/* globals angular */
let ringDropdownModule = angular.module('Ring.dropdown', []);

ringDropdownModule.directive('rgDropdown', function () {
  const OPEN_POPUP_CLASS_NAME = 'dropdown-ng_open';

  return {
    restrict: 'A',
    scope: {
      items: '=',
      itemsSrc: '&',
      config: '&',
      labelField: '@',
      onItemSelect: '='
    },
    controller: function ($scope, $element) {
      let element = $element[0];
      let popupMenuInstance = null;
      let ITEM_TYPES = {
        LINK: 1,
        ITEM: 2
      };

      let config = angular.extend({}, {
        anchorElement: element,
        autoRemove: false,
        cutEdge: false,
        hidden: true,
        top: 2,
        onClose: () => {
          element.classList.remove(OPEN_POPUP_CLASS_NAME);
        }
      }, $scope.config() || {});

      function getItemType(item) {
        let type = angular.isDefined(item.type) ? item.type : ITEM_TYPES.ITEM;
        if (item.url || item.type === 'link') {
          type = ITEM_TYPES.LINK;
        }
        return type;
      }

      function convertItemsForPopup(items) {
        items = items || [];
        if (element.getAttribute('items-passthru')) {
          return items;
        }

        return items.map(item => {
          return {
            label: item[$scope.labelField] || item.label || item,
            description: item.description,
            type: getItemType(item),
            href: item.url ? item.url : null,
            className: item.className || '',
            icon: item.icon,
            onClick: () => {
              $scope.$apply(() => {
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
            popupMenuInstance = PopupMenu.renderPopup(createElement(PopupMenu, config));
          } else {
            popupMenuInstance.rerender(config);
          }
        }
      }

      let itemsSrc = $scope.itemsSrc();
      if (typeof itemsSrc !== 'function') {
        $scope.$watch('items', items => {
          setItems(items);
        }, true);
      }

      element.addEventListener('click', () => {
        if (!popupMenuInstance && typeof itemsSrc === 'function') {
          let promise = itemsSrc();
          if (promise.then) {
            promise.then(items => {
              setItems(items);
              if (popupMenuInstance) {
                popupMenuInstance.show();
              }
            });
          }
        } else if (popupMenuInstance) {
          popupMenuInstance.show();
        }

        element.classList.add(OPEN_POPUP_CLASS_NAME);
      });

      /**
       * Export popupMenuInstance to check its state in tests
       * @returns {PopupMenu}
       */
      $scope.getPopupMenuInstance = () => {
        return popupMenuInstance;
      };
    }
  };
});
