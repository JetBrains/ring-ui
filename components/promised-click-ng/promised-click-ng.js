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
    require('ring-ui/components/button/button.scss');
    require('angular');
    require('ring-ui/components/promised-click-ng/promised-click-ng');

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
          iElement[0].addEventListener('click', function ($event) {
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
let module = angular.module('Ring.promised-click', []);

function rgPromisedClick($parse) {
  return {
    restrict: 'A',
    controller: function ($scope, $element) {
      let element = $element[0];
      let active = false;
      let promise;

      function doIt() {
        active = true;
        element.classList.add('ring-btn_active');
        promise.finally(() => {
          active = false;
          element.classList.remove('ring-btn_active');
        });
      }

      this.onPromisedClick = (callback, $event) => {
        if (active) {
          if ($event) {
            $event.preventDefault();
          }
        } else {
          promise = callback($event);
          if (promise) {
            // Do not use $evalAsync here. This code should be invoked in the same animation frame
            // otherwise a button may be "pressed" twice – by click and with class change.
            /* eslint-disable angular/ng_no_private_call */
            if (!$scope.$root.$$phase) {
            /* eslint-enable angular/ng_no_private_call */
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
        let onClick = $parse(iAttrs.rgPromisedClick);
        iElement[0].addEventListener('click', controller.onPromisedClick.bind(controller, $event => {
          return onClick(scope, {$event: $event});
        }));
      }
    }
  };
}

module.directive('rgPromisedClick', rgPromisedClick);

export default module.name;
