import angular from 'angular';

import {storiesOf} from '@storybook/html';

import angularDecorator, {APP_NAME} from '../../.storybook/angular-decorator';

import LoaderScreen from './loader-screen-ng';

storiesOf('Legacy Angular|Loader Screen Ng', module).
  addParameters({
    notes: 'Provides an Angular wrapper for Loader Screen.',
    hermione: {skip: true}
  }).
  addDecorator(angularDecorator()).
  add('basic', () => {
    angular.module(APP_NAME, [LoaderScreen]).run(loaderScreen => {
      loaderScreen.setVisible(true);
      loaderScreen.startInitialLoading();
    });

    return `
      <div>
        <div rg-loader-screen="Loading..."></div>
      </div>
    `;
  });
