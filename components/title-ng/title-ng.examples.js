import angular from 'angular';

import {storiesOf} from '@storybook/html';

import angularDecorator, {APP_NAME} from '../../.storybook/angular-decorator';

import TitleNG from './title-ng';

storiesOf('Legacy Angular|Title Ng', module).
  addParameters({hermione: {skip: true}}).
  addDecorator(angularDecorator()).
  add('basic', () => {
    angular.module(APP_NAME, [TitleNG]).
      run(pageTitle => {
        pageTitle.addElement('Some page');
      });

    return `
        <h4>Open the example in a separate tab to see how tab title changes.</h4>

        <!--It is better to use this directive with <title> tag in your <head> section.-->
        <div rg-page-title="App name">Title should be "Some page | App name"</div>
    `;
  });
