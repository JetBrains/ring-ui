require('../table/table.scss');
var TableSelection = require('./table-ng__selection');
require('./table-ng__toolbar');

require('../react-ng/react-ng')({
  Checkbox: require('../checkbox/checkbox.jsx')
});

/*global angular*/

/**
 * A table component.
 * @example
  <example>

    <rg-table-toolbar stick>
      <div>Some toolbar content</div>
    </rg-table-toolbar>

    <rg-table items="itemsArray">

      <rg-table-header>
        <div class="table__title table__title_noborder">Avatar</div>
        <div class="table__title table__title_noborder">Check</div>
        <div class="table__title table__title_active">Name</div>
      </rg-table-header>

      <rg-table-row row-item="item" ng-repeat="item in itemsArray">
        <div class="table__avatar table__column">
          <img ng-if="::item.iconUrl" ng-src="{{ ::item.iconUrl }}" class="table__avatar__img">
        </div>
        <rg-table-checkbox-cell class="table__column"></rg-table-checkbox-cell>
        <div class="table__column">{{ ::item.name }}</div>
      </rg-table-row>

    </rg-table>

  </example>
 */

angular.module('Ring.table', ['Ring.table.toolbar'])
  .directive('rgTable', [function () {
    return {
      restrict: 'E',
      transclude: true,
      template: require('./table-ng.html'),
      controllerAs: 'ctrl',
      /**
       * @param {{
      *   items: array, items of table
      *   selection: {TableSelection}?, a selection object link can be provided to use it outside the table
      * }} scope
       */
      scope: {
        items: '=',
        selection: '=?'
      },
      bindToController: true,
      controller: ['$scope', function ($scope) {
        var ctrl = this;

        /**
         * Create Selection instance first to make sure it is always awailable
         * @type {TableSelection}
         */
        ctrl.selection = new TableSelection(ctrl.items, function emitEvent(name, item, index){
          $scope.$emit(name, item, index);
        });

        /**
         * Updating items when data is initiated or updated
         */
        $scope.$watch(function () {
          return ctrl.items;
        }, function (newItems) {
          if (newItems){
            ctrl.selection.setItems(newItems);
          }
        });

      }]
    };
  }])
  .directive('rgTableHeader', [function () {
    return {
      restrict: 'E',
      template: '<div class="table__header" ng-transclude></div>',
      transclude: true,
      replace: true
    };
  }])
  .directive('rgTableRow', [function () {
    return {
      template: require('./table-ng__row.html'),
      restrict: 'E',
      transclude: true,
      replace: true,
      require: ['^rgTable', 'rgTableRow'],
      scope: {
        rowItem: '='
      },
      link: function (scope, element, iAttrs, ctrls) {
        var rgTableCtrl = ctrls[0];
        var rgTableRowCtrl = ctrls[1];
        rgTableRowCtrl.setSelection(rgTableCtrl.selection);
      },
      controllerAs: 'rowCtrl',
      bindToController: true,
      controller: ['$scope', function ($scope) {
        var ctrl = this;

        ctrl.setSelection = function (selection) {
          ctrl.selection = selection;
        };

        ctrl.setActiveItem = function (item) {
          ctrl.selection.activateItem(item);
        };

        ctrl.hasCheckedItems = function () {
          //TODO: cache this operation if perfomance issue exists
          var checkedItems = ctrl.selection.getCheckedItems();
          return checkedItems && checkedItems.length > 0;
        };

        $scope.$watch('rowCtrl.rowItem.checked', function (newValue) {
          if (newValue !== undefined){
            ctrl.selection.triggerSelectionChanged(ctrl.rowItem);
          }
        });
      }]
    };
  }])
  /**
   * A checkbox cell for table. Uses rg-table-row parent directive as model hoster
   */
  .directive('rgTableCheckboxCell', [function () {
    return {
      restrict: 'E',
      transclude: true,
      require: '^rgTableRow',
      replace: true,
      template: '<div class="table__selector table__column_selector"><div react="Checkbox" ng-model="rowItem.checked"/></div>',
      link: function (scope, element, attrs, rowCtrl) {
        /**
         * Saving rowItem to use it as ng-model for checkbox
         */
        scope.rowItem = rowCtrl.rowItem;
      }
    };
  }]);
