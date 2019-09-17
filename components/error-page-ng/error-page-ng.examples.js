import angular from 'angular';

import AngularRoute from 'angular-route';

import angularDecorator, {APP_NAME} from '../../.storybook/angular-decorator';

import authMock from '../auth-ng/auth-ng.mock';

import ErrorPageNG from './error-page-ng';

export default {
  title: 'Legacy Angular|Error Page Ng',
  decorators: [angularDecorator()],

  parameters: {
    notes: 'Displays an error page, e.g. 404 Not Found.',
    hermione: {skip: true}
  }
};

export const basic = () => {
  angular.module(APP_NAME, [AngularRoute, ErrorPageNG]).provider('auth', authMock);

  return `
      <div class="app" rg-error-page-background>
        <div rg-error-page="{error: {status: 403}}"></div>
      </div>
    `;
};

basic.story = {
  name: 'basic'
};
