(function () {
  'use strict';

  angular.module('Ring.breadcrumb', []).
    directive('ringBreadcrumb', [function() {
      return {
        templateUrl: 'breadcrumb/breadcrumb.ng.html',
        replace: true,
        transclude: true,
        restrict: 'E',
        scope: { path: '&' },
        link: function($scope) {
          $scope.calculatedPath = $scope.path();
        }
      };
    }]);
}());
