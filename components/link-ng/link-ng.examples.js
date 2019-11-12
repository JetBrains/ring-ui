import angular from 'angular';

import angularDecorator, {APP_NAME} from '../../.storybook/angular-decorator';

import LinkNG from './link-ng';

export default {
  title: 'Legacy Angular|Link Ng',
  decorators: [angularDecorator()],

  parameters: {
    notes: 'Displays a link.'
  }
};

export const basic = () => {
  angular.module(APP_NAME, [LinkNG]);

  return '<rg-link href="http://example.com" class="test-class">Open example</rg-link>';
};

basic.story = {
  name: 'basic'
};
