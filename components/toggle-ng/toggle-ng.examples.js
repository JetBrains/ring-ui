import angular from 'angular';

import angularDecorator, {APP_NAME} from '../../.storybook/angular-decorator';

import ToggleNG from './toggle-ng';

export default {
  title: 'Legacy Angular|Toggle Ng',
  decorators: [angularDecorator()],

  parameters: {
    notes: 'Provides an Angular wrapper for Toggle.'
  }
};

export const basic = () => {
  angular.module(APP_NAME, [ToggleNG]);

  return '<rg-toggle></rg-toggle>';
};

basic.story = {
  name: 'basic'
};
