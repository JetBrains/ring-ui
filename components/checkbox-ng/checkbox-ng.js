import angular from 'angular';

import checkmarkIcon from '@jetbrains/icons/checkmark.svg';

import IconNG from '../icon-ng/icon-ng';
import proxyAttrs from '../proxy-attrs/proxy-attrs';

import styles from '../checkbox/checkbox.css';

/**
 * @name Checkbox Ng
 * @category Legacy Angular
 * @tags Ring UI Language
 * @description Provides an Angular wrapper for Checkbox.
 * @example
   <example name="Checkbox Ng">
     <file name="index.html">
       <div ng-app="TestApp" ng-strict-di ng-controller="MainCtrl">
         <div>Checked: {{checked}}</div>
         <div>Disabled: {{disabled}}</div>
         <div>
           <rg-button id="checkButton" ng-click="checked = !checked">{{checked ? 'Uncheck' : 'Check'}} checkbox programmatically</rg-button>
           <rg-button id="disableButton" ng-click="disabled = !disabled">{{disabled ? 'Enable' : 'Disable'}} checkbox</rg-button>
         </div>
         <p style="width: 300px;">
           <rg-checkbox ng-disabled="disabled === true" ng-model="checked">Checkbox</rg-checkbox>
         </p>
         <p style="width: 300px;">
           <rg-checkbox ng-disabled="disabled === true" ng-model="checked" ng-change="onNgChange()">Inverted checkbox</rg-checkbox>
           <div>{{ changeText }}</div>
         </p>
       </div>
     </file>
     <file name="index.js" webpack="true">
       import angular from 'angular';
       import CheckboxNG from '@jetbrains/ring-ui/components/checkbox-ng/checkbox-ng';
       import ButtonNG from '@jetbrains/ring-ui/components/button-ng/button-ng';
       angular.module('TestApp', [ButtonNG, CheckboxNG])
        .controller('MainCtrl', function($scope) {
          $scope.checked = false;
          $scope.disabled = false;

          $scope.changeText = 'text will be changed on ng-change of inverted checkbox';

          $scope.onNgChange = function(newValue) {
            $scope.changeText = 'ngChange appear for the inverted checkbox at ' + new Date();
          }
        });
 </file>
   </example>

   <example name="Checkbox Ng with custom true/false values">
     <file name="index.html">
       <div ng-app="TestApp" ng-strict-di>
         <div>Checked: {{checked}}</div>
         <p style="width: 300px;">
           <rg-checkbox ng-model="checked" ng-true-value="'The TRUE value'" ng-false-value="'The FALSE value'">Checkbox</rg-checkbox>
         </p>
       </div>
     </file>
     <file name="index.js" webpack="true">
       import angular from 'angular';
       import CheckboxNG from '@jetbrains/ring-ui/components/checkbox-ng/checkbox-ng';
       angular.module('TestApp', [CheckboxNG]);
 </file>
   </example>

    <example name="Checkbox Ng (disabled)">
     <file name="index.html">
       <div ng-app="TestApp" ng-strict-di>
         <p style="width: 300px;">
           <rg-checkbox ng-disabled="true">Checkbox</rg-checkbox>
         </p>
       </div>
     </file>
     <file name="index.js" webpack="true">
       import angular from 'angular';
       import CheckboxNG from '@jetbrains/ring-ui/components/checkbox-ng/checkbox-ng';
       angular.module('TestApp', [CheckboxNG]);
 </file>
   </example>
 */

const angularModule = angular.module('Ring.checkbox', [IconNG]);

let idCounter = 0;
const CHECKBOX_ID_PREFIX = 'rg-checkbox-';

angularModule.directive('rgCheckbox', function rgCheckboxDirective() {
  return {
    restrict: 'E',
    transclude: true,
    replace: true,
    template: proxyAttrs(`
<label class="${styles.checkbox}">
  <input
    data-proxy-ng-disabled
    data-proxy-ng-model
    data-proxy-ng-change
    data-proxy-ng-true-value
    data-proxy-ng-false-value
    data-proxy-name
    data-test="ring-checkbox"
    type="checkbox"
    class="${styles.input}"
  />
  <span class="${styles.cell}">
    <rg-icon class="${styles.icon}" glyph="{{:: checkmarkIcon}}" />
  </span><span class="${styles.label}" ng-transclude></span>
</label>
    `),
    link: function link(scope, iElement) {
      scope.checkmarkIcon = checkmarkIcon;
      const input = iElement[0].query('input[type="checkbox"]');

      const id = CHECKBOX_ID_PREFIX + idCounter++;
      iElement[0].setAttribute('for', id);
      input.setAttribute('id', id);
    }
  };
});

export default angularModule.name;
