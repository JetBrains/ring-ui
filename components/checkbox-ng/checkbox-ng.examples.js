/* eslint-disable angular/controller-as */
import angular from 'angular';

import angularDecorator, {APP_NAME} from '../../.storybook/angular-decorator';
import ButtonNG from '../button-ng/button-ng';

import CheckboxNG from './checkbox-ng';

export default {
  title: 'Legacy Angular|Checkbox Ng',
  decorators: [angularDecorator()],

  parameters: {
    notes: 'Provides an Angular wrapper for Checkbox.'
  }
};

export const basic = () => {
  angular.
    module(APP_NAME, [ButtonNG, CheckboxNG]).
    controller('MainCtrl', function controller($scope) {
      $scope.checked = false;
      $scope.disabled = false;

      $scope.changeText = 'text will be changed on ng-change of inverted checkbox';

      $scope.onNgChange = () => {
        $scope.changeText = `ngChange appear for the inverted checkbox at ${new Date()}`;
      };
    });

  return `
       <div ng-controller="MainCtrl">
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
    `;
};

basic.story = {
  name: 'basic'
};

export const withCustomTrueFalseValues = () => {
  angular.module(APP_NAME, [CheckboxNG]);

  return `
       <div>
         <div>Checked: {{checked}}</div>
         <p style="width: 300px;">
           <rg-checkbox ng-model="checked" ng-true-value="'The TRUE value'" ng-false-value="'The FALSE value'">Checkbox</rg-checkbox>
         </p>
       </div>
    `;
};

withCustomTrueFalseValues.story = {
  name: 'with custom true-false values',
  parameters: {hermione: {skip: true}}
};

export const disabled = () => {
  angular.module(APP_NAME, [CheckboxNG]);

  return `
      <p style="width: 300px;">
        <rg-checkbox ng-disabled="true">Checkbox</rg-checkbox>
      </p>
    `;
};

disabled.story = {
  name: 'disabled'
};
