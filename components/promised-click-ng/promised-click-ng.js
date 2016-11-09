import 'dom4';
import ttls from '../delayed/delayed';

/**
 * @name Promised Click Ng
 * @category Angular Components
 * @description Controls the active state of a button.
 * @example
    <example name="Promised Click Ng">
      <file name="index.html">
        <div class="button-example" ng-app="button-test" ng-controller="testController as ctrl">
          <button class="ring-button" rg-promised-click="ctrl.onClick()">Simple use</button>
          <button class="ring-button" rg-promised-click="ctrl.onClick()" promised-mode="loader">Simple use loader mode</button>
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
  constructor($scope, $element, $attrs, $parse, $timeout) {
    this.$scope = $scope;
    this.element = $element[0];
    this.timeout = $timeout;
    this.active = false;
    this.activePromise = null;
    this.activeTTL = 0;

    if ($attrs.rgPromisedClick) {
      this.onClick(e => $parse($attrs.rgPromisedClick)($scope, {event: e}));
    }

    const ttl = +$attrs.promisedTtl;

    switch ($attrs.promisedMode) {
      case 'loader':
        this.activeClass = 'ring-button_loader';
        this.activeTTL = ttl || ttls.buttonLoader;
        break;
      default:
      case 'active':
        this.activeClass = 'ring-button_active';
        this.activeTTL = ttl || 0;
        break;
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

    const setActive = () => this.element.classList.add(this.activeClass);

    if (this.activeTTL === 0) {
      setActive();
    } else if (!this.activePromise) {
      this.activePromise = this.timeout(setActive, this.activeTTL);
    }

    const done = () => {
      if (this.activePromise) {
        this.timeout.cancel(this.activePromise);
        this.activePromise = null;
      }

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
