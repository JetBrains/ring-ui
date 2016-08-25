/* global angular: false */

import '../icon-ng/icon-ng';

import '../checkbox/checkbox.scss';

/**
 * @name Checkbox Ng
 * @category Angular Components
 * @example
 * <example name="Checkbox Ng">
     <file name="index.html">
       <div ng-app="TestApp">
         <div>Checked: {{checked}}</div>
         <div>
           <rg-button id="checkButton" ng-click="checked = !checked">{{checked ? 'Uncheck' : 'Check'}} checkbox programmatically</rg-button>
           <rg-button id="disableButton" ng-click="disabled = !disabled">{{disabled ? 'Enable' : 'Disable'}} checkbox</rg-button>
         </div>
         <p style="width: 300px;">
           <rg-checkbox x-disabled="disabled" ng-model="checked">Checkbox</rg-checkbox>
         </p>
       </div>
     </file>
     <file name="index.js" webpack="true">
       require('angular');
       require('ring-ui/components/checkbox-ng/checkbox-ng');
       require('ring-ui/components/button-ng/button-ng');
       angular.module('TestApp', ['Ring.button', 'Ring.checkbox'])
     </file>
 </example>
 */
const angularModule = angular.module('Ring.checkbox', ['Ring.icon']);

let idCounter = 0;
const CHECKBOX_ID_PREFIX = 'rg-checkbox-';

angularModule.directive('rgCheckbox', $parse => ({
  restrict: 'E',
  transclude: true,
  replace: true,
  template: require('./checkbox-ng.html'),
  require: ['?ngModel'],

  link(scope, iElement, iAttrs, [ctrl]) {
    const input = iElement[0].query('.ring-checkbox__input');

    const id = CHECKBOX_ID_PREFIX + idCounter++;
    iElement[0].setAttribute('for', id);
    input.setAttribute('id', id);

    if (iAttrs.disabled) {
      const disabledGetter = $parse(iAttrs.disabled);

      if (!disabledGetter.constant) {
        scope.$watch(disabledGetter, disabled => {
          input.disabled = disabled;
        });
      } else {
        input.disabled = disabledGetter(scope);
      }
    }


    if (ctrl) {
      angular.element(input).on('click', ev => {
        ctrl.$setViewValue(input.checked, ev && ev.type);
      });

      ctrl.$render = () => {
        input.checked = ctrl.$viewValue;
      };
    }
  }
}));

export default angularModule.name;
