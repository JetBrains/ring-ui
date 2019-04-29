import angular from 'angular';

import {storiesOf} from '@storybook/html';

import angularDecorator, {APP_NAME} from '../../.storybook/angular-decorator';
import AuthNG from '../auth-ng/auth-ng';
import hubConfig from '../../.storybook/hub-config';

import PermissionsNG from './permissions-ng';

storiesOf('Legacy Angular|Permissions Ng', module).
  addDecorator(angularDecorator()).
  add('rg-permission-if', () => {
    angular.module(APP_NAME, [PermissionsNG, AuthNG]).
      config(['authProvider', function provider(authProvider) {
        authProvider.config(hubConfig);
      }]).
      config(userPermissionsProvider => {
        userPermissionsProvider.config({
          serviceId: '0-0-0-0-0',
          prefix: 'jetbrains.jetpass.'
        });
      });

    return `
      <div rg-permission-if="project-read" in-project="0-0-0-0-0">
        Is transcluded if user has permission 'read-project' in project 0-0-0-0-0.
      </div>
      <div rg-permission-if="project-read">
        Is transcluded if user has permission 'read-project' at least in one project.
      </div>
      <div rg-permission-if="project-read" in-global>
        Is transcluded if user has permission 'read-project' at project "global".
      </div>
    `;
  });
