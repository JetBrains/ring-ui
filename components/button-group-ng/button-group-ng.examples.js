import angular from 'angular';

import angularDecorator, {APP_NAME} from '../../.storybook/angular-decorator';

import ButtonNG from '../button-ng/button-ng';

import ButtonGroupNG from './button-group-ng';

export default {
  title: 'Legacy Angular|Button Group Ng',
  decorators: [angularDecorator()],

  parameters: {
    notes: 'Provides an Angular wrapper for Button Group.'
  }
};

export const basic = () => {
  angular.module(APP_NAME, [ButtonNG, ButtonGroupNG]);

  return `
      <div rg-button-group>
        <span rg-button-group-caption>Side</span>
        <rg-button>Left</rg-button>
        <rg-button>Right</rg-button>
      </div>
    `;
};

basic.story = {
  name: 'basic'
};
