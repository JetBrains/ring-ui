import '../icon-ng/icon-ng';

import '../checkbox/checkbox.scss';

import '../proxy-attrs-ng/proxy-attrs-ng';

/**
 * @name Checkbox Ng
 * @category Angular Components
 * @description Provides an Angular wrapper for Checkbox.
 * @example
   <example name="Checkbox Ng">
     <file name="index.html">
       <div ng-app="TestApp" ng-controller="MainCtrl">
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
          $scope.checked = false;
          $scope.disabled = false;

          $scope.changeText = 'text will be changed on ng-change of inverted checkbox';

          $scope.onNgChange = function(newValue) {
            $scope.changeText = 'ngChange appear for the inverted checkbox at ' + new Date();
          }
        });
 </file>
   </example>

   <example name="Checkbox Ng with custom true and false value">
     <file name="index.html">
       <div ng-app="TestApp">
         <div>Checked: {{checked}}</div>
         <p style="width: 300px;">
           <rg-checkbox ng-model="checked" ng-true-value="'The TRUE value'" ng-false-value="'The FALSE value'">Checkbox</rg-checkbox>
         </p>
       </div>
     </file>
     <file name="index.js" webpack="true">
       require('angular');
       require('ring-ui/components/checkbox-ng/checkbox-ng');
       angular.module('TestApp', ['Ring.checkbox']);
 </file>
   </example>

    <example name="Checkbox Ng disabled">
     <file name="index.html">
       <div ng-app="TestApp">
         <p style="width: 300px;">
           <rg-checkbox ng-disabled="true">Checkbox</rg-checkbox>
         </p>
       </div>
     </file>
     <file name="index.js" webpack="true">
       require('angular');
       require('ring-ui/components/checkbox-ng/checkbox-ng');
       angular.module('TestApp', ['Ring.checkbox']);
 </file>
   </example>
 */
/* global angular: false */
const angularModule = angular.module('Ring.checkbox', ['Ring.icon', 'Ring.proxy-attrs']);

let idCounter = 0;
const CHECKBOX_ID_PREFIX = 'rg-checkbox-';

angularModule.directive('rgCheckbox', proxyAttrs => ({
  restrict: 'E',
  transclude: true,
  replace: true,
  template: proxyAttrs(require('./checkbox-ng.html')),
  link(scope, iElement) {
    const input = iElement[0].query('.ring-checkbox__input');

    const id = CHECKBOX_ID_PREFIX + idCounter++;
    iElement[0].setAttribute('for', id);
    input.setAttribute('id', id);
  }
}));

export default angularModule.name;
