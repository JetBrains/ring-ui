import angular from 'angular';

import angularDecorator, {APP_NAME} from '../../.storybook/angular-decorator';

import TitleNG from './title-ng';

export default {
  title: 'Legacy Angular|Title Ng',
  decorators: [angularDecorator()],

  parameters: {
    notes: 'A component for manipulating page title.',
    hermione: {skip: true}
  }
};

export const basic = () => {
  angular.module(APP_NAME, [TitleNG]).run(pageTitle => {
    pageTitle.addElement('Some page');
  });

  return `
        <h4>Open the example in a separate tab to see how tab title changes.</h4>

        <!--It is better to use this directive with <title> tag in your <head> section.-->
        <div rg-page-title="App name">Title should be "Some page | App name"</div>
    `;
};

basic.story = {
  name: 'basic'
};
