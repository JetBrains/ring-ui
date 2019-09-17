import angular from 'angular';

import angularDecorator, {APP_NAME} from '../../.storybook/angular-decorator';
import ButtonNG from '../button-ng/button-ng';

import GroupNG from './group-ng';

export default {
  title: 'Legacy Angular|Group Ng',
  decorators: [angularDecorator()],

  parameters: {
    notes: 'Provides an Angular wrapper for Group.'
  }
};

export const basic = () => {
  angular.module(APP_NAME, [ButtonNG, GroupNG]);

  return `
      <rg-group>
        <rg-button>First item</rg-button>
        <rg-button>Second item</rg-button>
      </rg-group>
    `;
};

basic.story = {
  name: 'basic'
};
