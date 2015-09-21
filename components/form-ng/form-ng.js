/* global angular: false */

require('message-bundle-ng/message-bundle-ng.js');
require('input/input.scss');

angular.module('Ring.form', ['Ring.message-bundle']).
/**
 * <div rg-error-bubble="form.name"></div>
 * @param {object} error-bubble Ng-model for this control
 *
 * Where form.name is a reference to angularJS form input
 */
  directive('rgErrorBubble', function (RingMessageBundle) {
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
        var siblings = Array.from(iElement[0].parentNode.children);

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
          id = 'form_' + id;
          return RingMessageBundle[id] && RingMessageBundle[id](viewValue);
        };
      }
    };
  }).
/**
 * <input name="confirm" type="password" rg-equal-value="data.password" ng-model="data.confirm">
 * Constraint to be user for confirm password fields.
 */
  directive('rgEqualValue', function () {
    return {
      require: 'ngModel',
      link: function (scope, iElement, iAttrs, ngModelCtrl) {
        let element = iElement[0];

        function assertEqual(thisValue, thatValue) {
          ngModelCtrl.$setValidity('equalvalue', thisValue === thatValue);
        }

        scope.$watch(iAttrs.rgEqualValue, function (value) {
          assertEqual(element.value, value);
        });

        element.addEventListener('keyup', function () {
          var thatValue = scope.$eval(iAttrs.rgEqualValue);
          scope.$apply(function () {
            assertEqual(element.value, thatValue);
          });
        });
      }
    };
  }).
/**
 * <input name="name" required type="text" ng-class="form.name | rgInputClass:submitted" ng-model="name">
 *
 * Is intended to be used for the value of ng-class. Accepts a reference to an angularJS form input
 */
  filter('rgInputClass', function () {
    return function (input, submitted) {
      return {
        'ring-input': true,
        'ring-input_error': input.$invalid && (input.$dirty || submitted),
        'ring-input_correct': !input.$invalid && (input.$dirty || submitted)
      };
    };
  })
/**
 * <form rg-form-autofill-fix ...>
 *
 * Fixes Chrome bug: https://github.com/angular/angular.js/issues/1460
 */
  .directive('rgFormAutofillFix', function ($timeout) {
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
  });
