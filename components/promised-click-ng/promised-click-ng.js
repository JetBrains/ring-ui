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
const module = angular.module('Ring.promised-click', []);

class PromisedClickController {
  constructor($scope, $element, $attrs, $parse) {
    this.$scope = $scope;
    this.element = $element[0];
    this.active = false;

    if ($attrs.rgPromisedClick) {
      const onClick = $parse($attrs.rgPromisedClick);
      const onPromisedClick = this.onPromisedClick.bind(this, $event => onClick($scope, {$event}));
      this.element.addEventListener('click', onPromisedClick);
    }
  }

  onPromisedClick(callback, $event) {
    if (this.active) {
      if ($event) {
        $event.preventDefault();
      }
    } else {
      this.promise = callback($event);
      if (this.promise) {
        // Do not use $evalAsync here. This code should be invoked in the same animation frame
        // otherwise a button may be "pressed" twice – by click and with class change.
        if (!this.$scope.$root.$$phase) { // eslint-disable-line angular/no-private-call
          this.$scope.$apply(::this.doIt);
        } else {
          this.doIt();
        }
      }
    }
  }

  doIt() {
    this.active = true;
    this.element.classList.add('ring-btn_active');

    this.promise.finally(() => {
      this.active = false;
      this.element.classList.remove('ring-btn_active');
    });
  }
}

function rgPromisedClickDirective() {
  return {
    controller: PromisedClickController
  };
}

module.directive('rgPromisedClick', rgPromisedClickDirective);

export default module.name;
