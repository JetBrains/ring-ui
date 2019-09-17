import angular from 'angular';

import angularDecorator, {APP_NAME} from '../../.storybook/angular-decorator';

import ButtonNG from '../button-ng/button-ng';

import ButtonSetNG from './button-set-ng';

export default {
  title: 'Legacy Angular|Button Set Ng',
  decorators: [angularDecorator()],

  parameters: {
    notes: 'Provides an Angular wrapper for Button Set.'
  }
};

export const basic = () => {
  angular.module(APP_NAME, [ButtonNG, ButtonSetNG]);

  return `
      <rg-button-set>
        <rg-button>Button 1</rg-button>
        <rg-button>Button 2</rg-button>
        <rg-button>Button 3</rg-button>
      </rg-button-set>
    `;
};

basic.story = {
  name: 'basic'
};
