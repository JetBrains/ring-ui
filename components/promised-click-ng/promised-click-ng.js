import 'dom4';
/**
 * @name Promised Click Ng
 * @description Directive for a button active state control
 * @example
<example name="promised-click-ng">
  <file name="index.html">
    <div class="button-example" ng-app="button-test" ng-controller="testController as ctrl">
      <button class="ring-button" rg-promised-click="ctrl.onClick()">Simple use</button>
      <button class="ring-button" rg-promised-click test-directive>Via the controller</button>
      <rg-button rg-promised-click="ctrl.onClick()">Ring button</rg-button>
    </div>
  </file>
  <file name="index.js" webpack="true">
    require('ring-ui/components/button/button.scss');
    require('angular');
    require('ring-ui/components/promised-click-ng/promised-click-ng');
    require('ring-ui/components/button-ng/button-ng');

    var buttonTestModule = angular.module('button-test', ['Ring.promised-click', 'Ring.button']);

    buttonTestModule.controller('testController', function($scope, $timeout) {
      this.onClick = function () {
        return $timeout(angular.noop, 1000);
      };
    });

    buttonTestModule.directive('testDirective', ['$timeout', function($timeout) {
      return {
        require: 'rgPromisedClick',
        link: function (scope, iElement, iAttrs, rgPromisedClick) {
          rgPromisedClick.onClick(function () {
            return $timeout(angular.noop, 1000);
          });
        }
      }
    }]);
  </file>
</example>
*/

/* global angular: false */
const angularModule = angular.module('Ring.promised-click', []);

class PromisedClickController {
  constructor($scope, $element, $attrs, $parse) {
    this.$scope = $scope;
    this.element = $element[0];
    this.active = false;

    if ($attrs.rgPromisedClick) {
      this.onClick(e => $parse($attrs.rgPromisedClick)($scope, e));
    }
  }

  onClick(callback) {
    this.element.addEventListener('click', e => {
      if (this.active) {
        e.preventDefault();
      } else {
        this.process(callback, e);
      }
    });
  }

  process(callback, e) {
    this.promise = callback(e);

    if (this.promise) {
      this.activate();
    }

    // Do not use $evalAsync here. This code should be invoked in the same animation frame
    // otherwise a button may be "pressed" twice – by click and with class change.
    if (!this.$scope.$root.$$phase) { // eslint-disable-line angular/no-private-call
      this.$scope.$apply();
    }
  }

  activate() {
    this.active = true;
    this.element.classList.add('ring-button_active');

    const done = () => {
      this.active = false;
      this.element.classList.remove('ring-button_active');
    };

    this.promise.then(done, done);
  }
}

function rgPromisedClickDirective() {
  return {
    controller: PromisedClickController
  };
}

angularModule.directive('rgPromisedClick', rgPromisedClickDirective);

export default angularModule.name;
