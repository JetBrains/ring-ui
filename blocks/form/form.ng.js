(function () {
  'use strict';

  angular.module('Ring.form', []).
  /**
   * <div error-bubble="form.name"></div>
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
   * <input name="name" required type="text" ng-class="form.name | inputClass" ng-model="name">
   *
   * Is intended to be used for the value of ng-class. Accepts a reference to an angularJS form input
   */
    filter('inputClass', [function () {
      return function (input) {
        return {
          'ring-input': true,
          'ring-input_error': input.$invalid && input.$dirty,
          'ring-input_correct': !input.$invalid && input.$dirty
        };
      };
    }]);
})();