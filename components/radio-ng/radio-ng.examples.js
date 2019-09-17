import angular from 'angular';

import angularDecorator, {APP_NAME} from '../../.storybook/angular-decorator';

import RadioNG from '../radio-ng/radio-ng';

export default {
  title: 'Legacy Angular|Radio Ng',
  decorators: [angularDecorator()],

  parameters: {
    notes: 'Provides a Radio component.'
  }
};

export const basic = () => {
  angular.module(APP_NAME, [RadioNG]).controller('ExampleCtrl', function ctrl() {
    this.selected = 'two';
  });

  return `
      <div ng-controller="ExampleCtrl as ctrl">
        <rg-radio ng-model="ctrl.selected" value="one" name="first" id="one-option">One</rg-radio>
        <rg-radio ng-model="ctrl.selected" value="two" name="second">Two</rg-radio>
  
        <div>Selected value is "{{ctrl.selected}}"</div>
      </div>
    `;
};

basic.story = {
  name: 'basic'
};
