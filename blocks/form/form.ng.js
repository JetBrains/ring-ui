(function () {
  'use strict';

  angular.module('Ring.form', []).
  /**
   * <div error-bubble="form.name"></div>
   * @param {object} error-bubble Ng-model for this control
   *
   * Where form.name is a reference to angularJS form input
   */
    directive('errorBubble', [function () {
      return {
        scope: {
          'errorBubble': '&errorBubble'
        },
        replace: true,
        templateUrl: 'form/ring-input__error-bubble.ng.html'
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
    .directive('formAutofillFix', function () {
      return {
        require: '?form',
        priority: 10,
        link: function ($scope, element, attrs, form) {
          var stop = {};

          if (form) {
            element.on('submit', function (e, data) {
              if (data === stop) {
                return !e.isDefaultPrevented();
              }

              angular.forEach(element.find('input'), function (elem) {
                var $elem = angular.element(elem);
                var controller = $elem.controller('ngModel');

                if (controller && $elem.attr('type') !== 'checkbox' && $elem.attr('type') !== 'radio') {
                  controller.$setViewValue($elem.val());
                }
              });

              // Really hack-ish, jqLite + native form submit mix is unbeatable
              if (element.triggerHandler('submit', stop)) {
                element[0].submit();
              }
            });
          }
        }
      };
    });
})();