import angular from 'angular';

import angularDecorator, {APP_NAME} from '../../.storybook/angular-decorator';

import LoaderScreen from './loader-screen-ng';

export default {
  title: 'Legacy Angular|Loader Screen Ng',
  decorators: [angularDecorator()],

  parameters: {
    notes: 'Provides an Angular wrapper for Loader Screen.',
    hermione: {skip: true}
  }
};

export const basic = () => {
  angular.module(APP_NAME, [LoaderScreen]).run(loaderScreen => {
    loaderScreen.setVisible(true);
    loaderScreen.startInitialLoading();
  });

  return `
      <div>
        <div rg-loader-screen="Loading..."></div>
      </div>
    `;
};

basic.story = {
  name: 'basic'
};
