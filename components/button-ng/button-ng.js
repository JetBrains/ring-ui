/* global angular: false */

var ringButtonModule = angular.module('Ring.button', []);

ringButtonModule.directive('rgPromisedClick', ['$parse', 'rgPromisedClick', function ($parse, rgPromisedClick) {
  return {
    restrict: 'A',
    replace: true,
    transclude: true,
    template: '<button ng-class="{ \'ring-btn_active\': rgPromisedClickActive }" ng-transclude></button>',
    scope: true,
    controller: function ($scope) {
      $scope.rgPromisedClickActive = false;
    },
    link: function (scope, iElement, iAttrs) {
      if (iAttrs.rgPromisedClick) {
        var onClick = $parse(iAttrs.rgPromisedClick);
        iElement.on('click', rgPromisedClick.bind(this, scope, function ($event) {
          return onClick(scope, { '$event': $event });
        }));
      }
    }
  };
}]);

ringButtonModule.service('rgPromisedClick', function () {
  return function (scope, callback, $event) {
    if (scope.rgPromisedClickActive) {
      $event.preventDefault();
    } else {
      var promise = callback($event);
      if (promise) {
        scope.$apply(function () {
          scope.rgPromisedClickActive = true;
          promise.finally(function () {
            scope.rgPromisedClickActive = false;
          });
        });
      }
    }
  };
});
