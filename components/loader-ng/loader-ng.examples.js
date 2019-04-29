import angular from 'angular';

import {storiesOf} from '@storybook/html';

import angularDecorator, {APP_NAME} from '../../.storybook/angular-decorator';

import LoaderNg from './loader-ng';

storiesOf('Legacy Angular|Loader Ng', module).
  addDecorator(angularDecorator()).
  add('basic', () => {
    angular.module(APP_NAME, [LoaderNg]);

    return `
      <div>
        <rg-loader/>
      </div>
    `;
  });
