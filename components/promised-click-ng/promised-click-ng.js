import angular from 'angular';
import 'dom4';

import buttonStyles from '../button/button.css';
import {applyMethodToClasses} from '../global/dom';

import RingAngularComponent from '../global/ring-angular-component';
import {LOADER_BACKGROUND_SELECTOR} from '../button-ng/button-ng';
/**
 * @name Promised Click Ng
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
        applyMethodToClasses(enable ? 'add' : 'remove')(
          this.element.classList,
          buttonStyles.loader
        );

        const loaderNode = this.element.querySelector(LOADER_BACKGROUND_SELECTOR);
        if (loaderNode) {
          applyMethodToClasses(enable ? 'add' : 'remove')(
            this.element.querySelector(LOADER_BACKGROUND_SELECTOR).classList,
            buttonStyles.loaderBackground
          );
        }
      } else if (currentMode === 'active') {
        applyMethodToClasses(enable ? 'add' : 'remove')(
          this.element.classList,
          buttonStyles.active
        );
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
