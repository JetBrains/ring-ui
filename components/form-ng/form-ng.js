/* global angular: false */

var $ = require('jquery');
require('input/input.scss');
require('message-bundle-ng/message-bundle-ng.js');

angular.module('Ring.form', ['Ring.message-bundle']).
/**
 * <div error-bubble="form.name"></div>
 * @param {object} error-bubble Ng-model for this control
 *
 * Where form.name is a reference to angularJS form input
 */
  directive('errorBubble', ['RingMessageBundle', function (RingMessageBundle) {
    return {
      scope: {
        'errorBubble': '&errorBubble'
      },
      replace: true,
      template: require('./form-ng__error-bubble.html'),
      link: function (scope, iElement) {
        scope.style = {};
        var element = $(iElement[0]).siblings('input, textarea');

        scope.$watch(function() {
          var result = scope.errorBubble();

          return result.$invalid && result.$dirty;
        }, function(active) {
          scope.active = active;

          if (active && element.length) {
            scope.style.left = element.outerWidth() + 2;
          }
        });

        scope.msg = function (id) {
          id = 'form_' + id;
          return RingMessageBundle[id] && RingMessageBundle[id]();
        };
      }
    };
  }]).
/**
 * <input name="confirm" type="password" equal-value="data.password" ng-model="data.confirm">
 * Constraint to be user for confirm password fields.
 */
  directive('equalValue', [function () {
    return {
      require: 'ngModel',
      link: function (scope, iElement, iAttrs, ngModelCtrl) {

        function assertEqual(thisValue, thatValue) {
          ngModelCtrl.$setValidity('equalvalue', thisValue === thatValue);
        }

        scope.$watch(iAttrs.equalValue, function (value) {
          assertEqual(iElement.val(), value);
        });

        iElement.on('keyup', function () {
          var thatValue = scope.$eval(iAttrs.equalValue);
          scope.$apply(function () {
            assertEqual(iElement.val(), thatValue);
          });
        });
      }
    };
  }]).
/**
 * <input name="name" required type="text" ng-class="form.name | inputClass:submitted" ng-model="name">
 *
 * Is intended to be used for the value of ng-class. Accepts a reference to an angularJS form input
 */
  filter('inputClass', [function () {
    return function (input, submitted) {
      return {
        'ring-input': true,
        'ring-input_error': input.$invalid && (input.$dirty || submitted),
        'ring-input_correct': !input.$invalid && (input.$dirty || submitted)
      };
    };
  }])
/**
 * <form form-autofill-fix ...>
 *
 * Fixes Chrome bug: https://github.com/angular/angular.js/issues/1460
 */
  .directive('formAutofillFix', ['$timeout', function ($timeout) {
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

require('form-ng/form-ng__update-text.js');
