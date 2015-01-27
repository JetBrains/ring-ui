require('../table/table.scss');
require('./table-ng__selection');
require('./table-ng__toolbar');

require('../react-ng/react-ng')({
  Checkbox: require('../checkbox/checkbox.jsx')
});

var filter = require('mout/array/filter');

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
        load: '='
      },
      bindToController: true,
      controller: ['$scope', function ($scope) {
        var ctrl = this;

        //Though out table controller for custom usages
        $scope.$emit('table:inited', ctrl);

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
        scope.setActiveItem = function (item) {
          rgTableCtrl.selection.activateItem(item);
        };

        scope.hasCheckedItems = function () {
          var checkedItems = rgTableCtrl.selection.getCheckedItems();
          return checkedItems && checkedItems.length > 0;
        };
      }
    };
  }])
  .directive('rgTableCheckboxCell', [function () {
    return {
      restrict: 'E',
      transclude: true,
      replace: true,
      template: '<div class="table__column table__column_selector"><div react="Checkbox" ng-model="rowItem.checked"/></div>'
    };
  }]);
