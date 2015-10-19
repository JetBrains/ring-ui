/* global angular: false */

require('input/input.scss');
require('message-bundle-ng/message-bundle-ng.js');

angular.module('Ring.form', ['Ring.message-bundle']).
/**
 * <div rg-error-bubble="form.name"></div>
 * @param {object} error-bubble Ng-model for this control
 *
 * Where form.name is a reference to angularJS form input
 */
  directive('rgErrorBubble', ['RingMessageBundle', function (RingMessageBundle) {
    return {
      scope: {
        'errorBubble': '&rgErrorBubble'
      },
      replace: true,
      template: require('./form-ng__error-bubble.html'),
      link: function (scope, iElement) {
        scope.style = {};
        var element;
        var tagName;
        // Avoid using jQuery here to keep it away from Hub Auth Forms
        var siblings = Array.prototype.slice.call(iElement.parent().children());

        for (var i = 0; i < siblings.length; i++) {
          tagName = siblings[i].tagName.toLowerCase();

          if (tagName === 'input' || tagName === 'textarea') {
            element = siblings[i];
            break;
          }
        }

        scope.$watch(function() {
          var result = scope.errorBubble();

          return result.$invalid && result.$dirty;
        }, function(active) {
          scope.active = active;

          if (active && element && element.length) {
            scope.style.left = element.outerWidth() + 2;
          }
        });

        scope.msg = function (id, viewValue) {
          var messageBundleId = 'form_' + id;
          if (RingMessageBundle.hasOwnProperty(messageBundleId)) {
            return RingMessageBundle[messageBundleId](viewValue);
          }
          var formErrors = (scope.errorBubble().$error && scope.errorBubble().$error[id]) || [];
          for (var j = 0; j < formErrors.length; ++j) {
            if (formErrors[j] && formErrors[j].message) {
              return formErrors[j].message;
            }
          }
        };
      }
    };
  }]).
/**
 * <input name="confirm" type="password" rg-equal-value="data.password" ng-model="data.confirm">
 * Constraint to be user for confirm password fields.
 */
  directive('rgEqualValue', [function () {
    return {
      require: 'ngModel',
      link: function (scope, iElement, iAttrs, ngModelCtrl) {

        function assertEqual(thisValue, thatValue) {
          ngModelCtrl.$setValidity('equalvalue', thisValue === thatValue);
        }

        scope.$watch(iAttrs.rgEqualValue, function (value) {
          assertEqual(iElement.val(), value);
        });

        iElement.on('keyup', function () {
          var thatValue = scope.$eval(iAttrs.rgEqualValue);
          scope.$apply(function () {
            assertEqual(iElement.val(), thatValue);
          });
        });
      }
    };
  }]).
/**
 * <input name="name" required type="text" ng-class="form.name | rgInputClass:submitted" ng-model="name">
 *
 * Is intended to be used for the value of ng-class. Accepts a reference to an angularJS form input
 */
  filter('rgInputClass', [function () {
    return function (input, submitted) {
      return {
        'ring-input': true,
        'ring-input_error': input.$invalid && (input.$dirty || submitted),
        'ring-input_correct': !input.$invalid && (input.$dirty || submitted)
      };
    };
  }])
/**
 * <form rg-form-autofill-fix ...>
 *
 * Fixes Chrome bug: https://github.com/angular/angular.js/issues/1460
 */
  .directive('rgFormAutofillFix', ['$timeout', function ($timeout) {
    return {
      require: '?form',
      priority: 10,
      link: function ($scope, element, attrs, form) {
        if (form) {
          var promise;
          var count = 0;

          (function poll() {
            var filled;

            angular.forEach(element.find('input'), function (elem) {
              var $elem = angular.element(elem);
              var controller = $elem.controller('ngModel');
              var val = $elem.val();
              var type = $elem.attr('type');

              if (controller && val && type !== 'checkbox' && type !== 'radio') {
                controller.$setViewValue(val);
                filled = true;
              }
            });

            if (!filled || count < 5) {
              promise = $timeout(poll, 150);
              count++;
            }
          }());

          element.on('$destroy', function () {
            $timeout.cancel(promise);
          });

        }
      }
    };
  }]);
