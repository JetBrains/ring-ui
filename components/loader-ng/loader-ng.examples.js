import angular from 'angular';

import angularDecorator, {APP_NAME} from '../../.storybook/angular-decorator';

import LoaderNg from './loader-ng';

export default {
  title: 'Legacy Angular|Loader Ng',
  decorators: [angularDecorator()],

  parameters: {
    notes: 'Displays the loader.',
    hermione: {skip: true}
  }
};

export const basic = () => {
  angular.module(APP_NAME, [LoaderNg]);

  return `
      <div>
        <rg-loader/>
      </div>
    `;
};

basic.story = {
  name: 'basic'
};
