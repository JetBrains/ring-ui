import '../icon-ng/icon-ng';

import '../checkbox/checkbox.scss';

/**
 * @name Checkbox Ng
 * @category Angular Components
 * @description Provides an Angular wrapper for Checkbox.
 * @example
   <example name="Checkbox Ng">
     <file name="index.html">
       <div ng-app="TestApp" ng-controller="MainCtrl">
         <div>Checked: {{checked}}</div>
         <div>
           <rg-button id="checkButton" ng-click="checked = !checked">{{checked ? 'Uncheck' : 'Check'}} checkbox programmatically</rg-button>
           <rg-button id="disableButton" ng-click="disabled = !disabled">{{disabled ? 'Enable' : 'Disable'}} checkbox</rg-button>
         </div>
         <p style="width: 300px;">
           <rg-checkbox ng-disabled="disabled === true" ng-model="checked">Checkbox</rg-checkbox>
           <br/>
           <rg-checkbox ng-disabled="disabled === true" ng-model="checked" ng-change="onNgChange()" invert-value>Inverted checkbox</rg-checkbox>
           <div>{{ changeText }}</div>
         </p>
       </div>
     </file>
     <file name="index.js" webpack="true">
       require('angular');
       require('ring-ui/components/checkbox-ng/checkbox-ng');
       require('ring-ui/components/button-ng/button-ng');
       angular.module('TestApp', ['Ring.button', 'Ring.checkbox'])
        .controller('MainCtrl', function($scope) {
          $scope.changeText = 'text will be changed on ng-change of inverted checkbox';

          $scope.onNgChange = function(newValue) {
            $scope.changeText = 'ngChange appear for the inverted checkbox at ' + new Date();
          }
        });
 </file>
   </example>
 */
/* global angular: false */
const angularModule = angular.module('Ring.checkbox', ['Ring.icon']);

let idCounter = 0;
const CHECKBOX_ID_PREFIX = 'rg-checkbox-';

angularModule.directive('rgCheckbox', () => ({
  restrict: 'E',
  transclude: true,
  replace: true,
  template: require('./checkbox-ng.html'),
  require: ['?ngModel'],

  link(scope, iElement, iAttrs, [ngModelCtrl]) {
    const input = iElement[0].query('.ring-checkbox__input');

    const id = CHECKBOX_ID_PREFIX + idCounter++;
    iElement[0].setAttribute('for', id);
    input.setAttribute('id', id);

    function modelValue(value) {
      if (iAttrs.invertValue !== undefined) {
        return !value;
      }
      return value;
    }

    iAttrs.$observe('disabled', newDisabledValue => {
      if (newDisabledValue) {
        input.setAttribute('disabled', 'disabled');
      } else {
        input.removeAttribute('disabled');
      }
    });

    if (ngModelCtrl) {
      angular.element(input).on('click', ev => {
        ngModelCtrl.$setViewValue(modelValue(input.checked), ev && ev.type);
      });

      ngModelCtrl.$render = () => {
        input.checked = modelValue(ngModelCtrl.$viewValue);
      };
    }
  }
}));

export default angularModule.name;
