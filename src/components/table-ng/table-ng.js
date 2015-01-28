require('../table/table.scss');
require('./table-ng__selection');
require('./table-ng__toolbar');

require('../react-ng/react-ng')({
  Checkbox: require('../checkbox/checkbox.jsx')
});

/*global angular*/

angular.module('Ring.table', ['Ring.table.selection', 'Ring.table.toolbar'])
  .directive('rgTable', ['TableSelection', function (TableSelection) {
    return {
      restrict: 'E',
      transclude: true,
      template: require('./table-ng.html'),
      controllerAs: 'ctrl',
      scope: {
        data: '=',
        load: '=',
        selection: '=?'
      },
      bindToController: true,
      controller: ['$scope', function ($scope) {
        var ctrl = this;

        ctrl.selection = new TableSelection([], function emitEvent(name, item, index){
          $scope.$emit(name, item, index);
        });

        $scope.$watch(function () {
          return ctrl.data;
        }, function (newData) {
          if (newData){
            ctrl.selection.setItems(ctrl.data.items);
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
      require: '^rgTable',
      scope: {
        rowItem: '='
      },
      link: function (scope, element, iAttrs, rgTableCtrl) {
        scope.rgTableCtrl = rgTableCtrl;
      },
      controllerAs: 'rowCtrl',
      bindToController: true,
      controller: ['$scope', function ($scope) {
        var ctrl = this;

        ctrl.setActiveItem = function (item) {
          $scope.rgTableCtrl.selection.activateItem(item);
        };

        ctrl.hasCheckedItems = function () {
          //TODO: cache this operation if perfomance issue exists
          var checkedItems = $scope.rgTableCtrl.selection.getCheckedItems();
          return checkedItems && checkedItems.length > 0;
        };

        $scope.$watch('rowCtrl.rowItem.checked', function (newValue) {
          if (newValue !== undefined){
            $scope.rgTableCtrl.selection.triggerSelectionChanged(ctrl.rowItem);
          }
        });
      }]
    };
  }])
  .directive('rgTableCheckboxCell', [function () {
    return {
      restrict: 'E',
      transclude: true,
      require: '^rgTableRow',
      replace: true,
      template: '<div class="table__column table__column_selector" ng-click="test()"><div react="Checkbox" ng-model="rowCtrl.rowItem.checked"/></div>',
      link: function (scope, element, attrs, rowCtrl) {
        scope.rowCtrl = rowCtrl;
      }
    };
  }]);
