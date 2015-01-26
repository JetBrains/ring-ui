/*global angular*/

angular.module('Ring.table.toolbar', [])
  .directive('rgTableToolbar', [function () {
    return {
      restrict: 'E',
      replace: true,
      transclude: true,
      template: '<div class="table__toolbar" ng-transclude></div>'
    };
  }]);
