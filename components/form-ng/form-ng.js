import angular from 'angular';

import AngularElastic from '@jetbrains/angular-elastic';

import MessageBundle from '../message-bundle-ng/message-bundle-ng';
import '../input/input.scss';
import '../error-bubble/error-bubble.scss';

/**
 * @name Form Ng
 */

const angularModule = angular.module('Ring.form', [MessageBundle, AngularElastic]);

angularModule.factory('getFormErrorMessages',
  function getFormErrorMessagesDirective(RingMessageBundle) {
    function msg(id, formError) {
      const messageBundleId = `form_${id}`;
      if (RingMessageBundle.hasOwnProperty(messageBundleId)) {
        return RingMessageBundle[messageBundleId]();
      }

      const formErrors = (formError && formError[id]) || [];
      for (let j = 0; j < formErrors.length; ++j) {
        if (formErrors[j] && formErrors[j].message) {
          return formErrors[j].message;
        }
      }

      return undefined;
    }

    return formErrors => {
      const errorMessages = [];
      for (const key in formErrors) {
        if (formErrors.hasOwnProperty(key) && formErrors[key]) {
          errorMessages.push(msg(key, formErrors));
        }
      }
      return errorMessages;
    };
  });

/**
 * <div rg-error-bubble="form.name"></div>
 * @param {object} error-bubble Ng-model for this control
 *
 * Where form.name is a reference to angularJS form input
 */
angularModule.directive('rgErrorBubble', function rgErrorBubbleDirective(getFormErrorMessages) {
  return {
    scope: {
      errorBubble: '&rgErrorBubble'
    },

    replace: true,
    template: require('./form-ng__error-bubble.html'),

    link: function link(scope, iElement, iAttrs) {
      scope.style = {};

      const siblings = Array.from(iElement[0].parentNode.children);
      let element;
      let tagName;

      for (let i = 0; i < siblings.length; i++) {
        tagName = siblings[i].tagName.toLowerCase();

        if (tagName === 'input' || tagName === 'textarea') {
          element = siblings[i];
          break;
        }
      }

      scope.material = iAttrs.material !== undefined;

      scope.$watch(() => {
        const result = scope.errorBubble();

        return result.$invalid && result.$dirty;
      }, active => {
        scope.active = active;

        if (active && element) {
          scope.style.left = element.offsetWidth + 2;
        }
      });

      scope.getFormErrorMessages = getFormErrorMessages;
    }
  };
});
/**
 * <input name="confirm" type="password" rg-equal-value="data.password" ng-model="data.confirm">
 * Constraint to be user for confirm password fields.
 */
angularModule.directive('rgEqualValue', function rgEqualValueDirective() {
  return {
    require: 'ngModel',

    link: function link(scope, iElement, iAttrs, ngModelCtrl) {
      const element = iElement[0];

      function assertEqual(thisValue, thatValue) {
        ngModelCtrl.$setValidity('equalvalue', thisValue === thatValue);
      }

      scope.$watch(iAttrs.rgEqualValue, value => {
        assertEqual(element.value, value);
      });

      element.addEventListener('keyup', () => {
        const thatValue = scope.$eval(iAttrs.rgEqualValue);
        scope.$apply(() => {
          assertEqual(element.value, thatValue);
        });
      });
    }
  };
});
/**
 * <input name="name" required type="text" ng-class="form.name | rgInputClass:submitted" ng-model="name">
 *
 * Is intended to be used for the value of ng-class. Accepts a reference to an angularJS form input
 */
angularModule.filter('rgInputClass', () => (input, submitted) => ({
  'ring-input': true,
  'ring-input_error': input.$invalid && (input.$dirty || submitted),
  'ring-input_correct': !input.$invalid && (input.$dirty || submitted)
}));
/**
 * <form rg-form-autofill-fix ...>
 *
 * Fixes Chrome bug: https://github.com/angular/angular.js/issues/1460
 */
angularModule.directive('rgFormAutofillFix', $timeout => ({
  require: '?form',
  priority: 10,

  link: function link($scope, element, attrs, form) {
    if (form) {
      const POLL_INTERVAL = 150;
      const MAX_COUNT = 5;
      let promise;
      let count = 0;

      (function poll() {
        let filled;

        angular.forEach(element.find('input'), elem => {
          const $elem = angular.element(elem);
          const controller = $elem.controller('ngModel');
          const val = $elem.val();
          const type = $elem.attr('type');

          if (controller && val && type !== 'checkbox' && type !== 'radio') {
            controller.$setViewValue(val);
            filled = true;
          }
        });

        if (!filled || count < MAX_COUNT) {
          promise = $timeout(poll, POLL_INTERVAL);
          count++;
        }
      }());

      element.on('$destroy', () => {
        $timeout.cancel(promise);
      });

    }
  }
}));

export default angularModule.name;
