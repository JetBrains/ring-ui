import angular from 'angular';

import angularDecorator, {APP_NAME} from '../../.storybook/angular-decorator';

import LoaderInlineNg from './loader-inline-ng';

export default {
  title: 'Legacy Angular|Loader Inline Ng',
  decorators: [angularDecorator()],

  parameters: {
    notes: 'Wraps markup for loader-inline component.'
  }
};

export const simple = () => {
  angular.module(APP_NAME, [LoaderInlineNg]);

  return `
      <div>
        <span>some text on top</span>
        <div>before <rg-loader-inline/> Some text after</div>
        <div>some text under loader</div>
      </div>
    `;
};

simple.story = {
  name: 'simple'
};
