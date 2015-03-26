var PopupMenu = require('popup-menu/popup-menu');

/**
 * @name dropdown-ng
 * @constructor
 * @description Directive for dropdowns in angular apps
 * @example
<example name="dropdown-ng">
  <file name="index.html">
    <div ng-app='dropTest' ng-controller='testController as ctrl'>
      <button class="ring-btn"
              rg-dropdown
              items="ctrl.items"
              label-field="displayName"
              on-item-select="ctrl.onSelect"
              config="{corner: 2, autoRemove: true, direction: 8}">
        Do something
      </button>
      <button class="ring-btn"
              rg-dropdown
              items-src="ctrl.promiseSrc"
              on-item-select="ctrl.onSelect"
              config="{corner: 2, autoRemove: true, direction: 8}">
        Do something
      </button>
    </div>
  </file>
  <file name="index.js" webpack="true">
    require('button/button.scss');
    require('angular/angular.min.js');
    require('dropdown-ng/dropdown-ng');

    angular.module('dropTest', ['Ring.dropdown'])
      .controller('testController', function($q, $scope){
        var ctrl = this;

        ctrl.items = [
          {displayName: 'Value is 1', key: 1},
          {displayName: 'Value is 2', key: 2}
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
angular.module('Ring.dropdown', [])
  .directive('rgDropdown', function() {
    var OPEN_POPUP_CLASS_NAME = 'dropdown-ng_open';
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

        var config = angular.extend({}, {
          anchorElement: $element[0],
          autoRemove: false,
          cutEdge: false,
          hidden: true,
          top: 2,
          onClose: function () {
            $element.removeClass(OPEN_POPUP_CLASS_NAME);
          }
        }, $scope.config() || {});

        function getItemType(item) {
          var type = angular.isDefined(item.type) ? item.type : ITEM_TYPES.ITEM;
          if (item.url || item.type === 'link') {
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

          $element.addClass(OPEN_POPUP_CLASS_NAME);
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
