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
          angular.forEach($scope.calculatedPath, function (pe) {
            if (pe.params) {
              var result = pe.href;
              var first = true;
              angular.forEach(pe.params, function (pValue, pName) {
                if (pValue) {
                  if (first) {
                    result += '?';
                    first = false;
                  } else {
                    result += '&';
                  }
                  result += pName + '=' + pValue;
                }
              });
              pe.href = result;
            }
          });
        }
      };
    }]);
}());
