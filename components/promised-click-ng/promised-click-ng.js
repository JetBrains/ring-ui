import angular from 'angular';
import 'dom4';

import buttonStyles from '../button/button.css';

import RingAngularComponent from '../global/ring-angular-component';
import {LOADER_BACKGROUND_SELECTOR} from '../button-ng/button-ng';
/**
 * @name Promised Click Ng
 * @category Legacy Angular
 * @tags Ring UI Language
 * @description Controls the active state of a button.
 * @example
    <example name="Promised Click Ng">
      <file name="index.html">
        <div class="button-example" ng-app="button-test" ng-strict-di ng-controller="testController as ctrl">
          <rg-button rg-promised-click="ctrl.onClick()">Simple use</rg-button>
          <rg-button rg-promised-click="ctrl.onClick()" promised-mode="loader">Simple use loader mode</rg-button>
          <rg-button rg-promised-click test-directive>Via controller</rg-button>
          <rg-button rg-promised-click="ctrl.onClick()">Ring button</rg-button>
        </div>
      </file>
      <file name="index.js" webpack="true">
        import angular from 'angular';
        import PromisedClickNG from '@jetbrains/ring-ui/components/promised-click-ng/promised-click-ng';
        import ButtonNG from '@jetbrains/ring-ui/components/button-ng/button-ng';

        var buttonTestModule = angular.module('button-test', [PromisedClickNG, ButtonNG]);

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


const angularModule = angular.module('Ring.promised-click', []);

const DEFAULT_MODE = 'active';

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

    this.toggleActive = enable => {
      if (currentMode === 'loader') {
        this.element.classList[enable ? 'add' : 'remove'](buttonStyles.loader);
        const loaderNode = this.element.querySelector(LOADER_BACKGROUND_SELECTOR);
        if (loaderNode) {
          this.element.querySelector(LOADER_BACKGROUND_SELECTOR).
            classList[enable ? 'add' : 'remove'](buttonStyles.loaderBackground);
        }
      } else if (currentMode === 'active') {
        this.element.classList[enable ? 'add' : 'remove'](buttonStyles.active);
      }
    };

    const setModeParams = mode => {
      currentMode = mode;
    };

    setModeParams($attrs.promisedMode || DEFAULT_MODE);

    if ($attrs.promisedMode && $attrs.promisedMode.indexOf('{{') !== -1) {
      $attrs.$observe('promisedMode', newMode => {
        if (newMode !== currentMode) {
          this.toggleActive(false);
          setModeParams(newMode);
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

    this.toggleActive(true);

    const done = () => {
      this.active = false;
      this.toggleActive(false);
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
