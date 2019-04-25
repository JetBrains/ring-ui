import angular from 'angular';

import AngularRoute from 'angular-route';
import {storiesOf} from '@storybook/html';

import angularDecorator, {APP_NAME} from '../../.storybook/angular-decorator';

import authMock from '../auth-ng/auth-ng.mock';

import ErrorPageNG from './error-page-ng';

storiesOf('Legacy Angular|Error Page Ng', module).
  addDecorator(angularDecorator()).
  add('basic', () => {
    angular.module(APP_NAME, [AngularRoute, ErrorPageNG]).
      provider('auth', authMock);

    return `
      <div class="app" rg-error-page-background>
        <div rg-error-page="{error: {status: 403}}"></div>
      </div>
    `;
  });
