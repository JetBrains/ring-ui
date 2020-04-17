import angular from 'angular';

import angularDecorator, {APP_NAME} from '../../.storybook/angular-decorator';

import hubConfig from '../../.storybook/hub-config';

import AuthNG from '@jetbrains/ring-ui/components/auth-ng/auth-ng';

import PermissionsNG from '@jetbrains/ring-ui/components/permissions-ng/permissions-ng';

export default {
  title: 'Legacy Angular/Permissions Ng',
  decorators: [angularDecorator()],

  parameters: {
    hermione: {skip: true}
  }
};

export const rgPermissionIf = () => {
  angular.
    module(APP_NAME, [PermissionsNG, AuthNG]).
    config([
      'authProvider',
      function provider(authProvider) {
        authProvider.config(hubConfig);
      }
    ]).
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
};

rgPermissionIf.story = {
  name: 'rg-permission-if'
};
