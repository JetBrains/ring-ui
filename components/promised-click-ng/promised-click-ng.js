/**
 * @name Promised Click Ng
 * @description Directive for a button active state control
 * @example
<example name="promised-click-ng">
  <file name="index.html">
    <div class="button-example" ng-app="button-test">
      <button class="ring-btn" rg-promised-click="onClick()" ng-controller="testController">Simple use</button>
      <button class="ring-btn" rg-promised-click test-directive>Via the controller</button>
    </div>
  </file>
  <file name="index.js" webpack="true">
    require('button/button.scss');
    require('angular/angular.min.js');
    require('promised-click-ng/promised-click-ng');

    var buttonTestModule = angular.module('button-test', ['Ring.promised-click']);

    buttonTestModule.controller('testController', function($scope, $timeout) {
      $scope.onClick = function () {
        return $timeout(angular.noop, 1000);
      }
    });

    buttonTestModule.directive('testDirective', ['$timeout', function($timeout) {
      return {
        require: 'rgPromisedClick',
        link: function (scope, iElement, iAttrs, rgPromisedClick) {
          iElement.on('click', function ($event) {
            rgPromisedClick.onPromisedClick(function ($event) {
              return $timeout(angular.noop, 1000);
            }, $event);
          });
        }
      }
    }]);
  </file>
</example>
*/

/* global angular: false */
var promisedClickModule = angular.module('Ring.promised-click', []);

promisedClickModule.directive('rgPromisedClick', function ($parse) {
  return {
    restrict: 'A',
    controller: function ($scope, $element) {
      var active = false;
      var promise;

      function doIt() {
        active = true;
        $element.addClass('ring-btn_active');
        promise.finally(function () {
          active = false;
          $element.removeClass('ring-btn_active');
        });
      }

      this.onPromisedClick = function (callback, $event) {
        if (active) {
          if ($event) {
            $event.preventDefault();
          }
        } else {
          promise = callback($event);
          if (promise) {
            if (!$scope.$root.$$phase) {
              $scope.$apply(doIt);
            } else {
              doIt();
            }
          }
        }
      };
    },
    link: function (scope, iElement, iAttrs, controller) {
      if (iAttrs.rgPromisedClick) {
        var onClick = $parse(iAttrs.rgPromisedClick);
        iElement.on('click', controller.onPromisedClick.bind(controller, function ($event) {
          return onClick(scope, { '$event': $event });
        }));
      }
    }
  };
});
