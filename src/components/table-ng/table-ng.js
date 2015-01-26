require('../table/table.scss');
require('./table-ng__selection');

require('../react-ng/react-ng')({
  Checkbox: require('../checkbox/checkbox.jsx')
});

var filter = require('mout/array/filter');

/*global angular*/

angular.module('Ring.table', ['Ring.table.selection'])
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

        $scope.$watch(function () {
          return ctrl.data;
        }, function (newData) {
          if (newData){
            ctrl.selection = new TableSelection(ctrl.data.items);
          }
        });

      }]
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
      }
    };
  }])
  .directive('rgTableCheckboxCell', [function () {
    return {
      restrict: 'E',
      transclude: true,
      replace: true,
      scope: {
        model: '='
      },
      template: '<div class="table__column table__column_selector"><div react="Checkbox" ng-model="model"/></div>'
    };
  }]);
