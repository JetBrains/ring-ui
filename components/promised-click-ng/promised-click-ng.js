import 'dom4';
import RingAngularComponent from '../global/ring-angular-component';

/**
 * @name Promised Click Ng
 * @category Angular Components
 * @description Controls the active state of a button.
 * @example
    <example name="Promised Click Ng">
      <file name="index.html">
        <div class="button-example" ng-app="button-test" ng-strict-di ng-controller="testController as ctrl">
          <rg-button class="ring-button" rg-promised-click="ctrl.onClick()">Simple use</rg-button>
          <rg-button class="ring-button" rg-promised-click="ctrl.onClick()" promised-mode="loader">Simple use loader mode</rg-button>
          <rg-button class="ring-button" rg-promised-click test-directive>Via the controller</rg-button>
          <rg-button rg-promised-click="ctrl.onClick()">Ring button</rg-button>
        </div>
      </file>
      <file name="index.js" webpack="true">
        import 'ring-ui/components/button/button.scss';
        import 'angular';
        import 'ring-ui/components/promised-click-ng/promised-click-ng';
        import 'ring-ui/components/button-ng/button-ng';

        var buttonTestModule = angular.module('button-test', ['Ring.promised-click', 'Ring.button']);

        buttonTestModule.controller('testController', function($scope, $timeout) {
          this.onClick = function () {
            return $timeout(angular.noop, 5000);
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

class PromisedClickController extends RingAngularComponent {
  static $inject = ['$scope', '$element', '$attrs', '$parse'];
  constructor(...args) {
    super(...args);

    const {$scope, $element, $attrs, $parse} = this.$inject;
    this.element = $element[0];
    this.active = false;

    if ($attrs.rgPromisedClick) {
      this.onClick(e => $parse($attrs.rgPromisedClick)($scope, {event: e}));
    }

    let currentMode = null;

    const setModeParams = mode => {
      currentMode = mode;
      switch (mode) {
        case 'loader':
          this.activeClass = 'ring-button_loader';
          break;
        default:
        case 'active':
          this.activeClass = 'ring-button_active';
          break;
      }
    };

    setModeParams($attrs.promisedMode);

    if ($attrs.promisedMode && $attrs.promisedMode.indexOf('{{') !== -1) {
      $attrs.$observe('promisedMode', newMode => {
        if (newMode !== currentMode) {
          this.active && this.element.classList.remove(this.activeClass);
          setModeParams(newMode);
          this.active && this.element.classList.add(this.activeClass);
        }
      });
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
    const {$scope} = this.$inject;

    this.promise = callback(e);

    if (this.promise) {
      this.activate();
    }

    // Do not use $evalAsync here. This code should be invoked in the same animation frame
    // otherwise a button may be "pressed" twice – by click and with class change.
    if (!$scope.$root.$$phase) { // eslint-disable-line angular/no-private-call
      $scope.$apply();
    }
  }

  activate() {
    this.active = true;

    this.element.classList.add(this.activeClass);

    const done = () => {
      this.active = false;
      this.element.classList.remove(this.activeClass);
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
