import angular from 'angular';

import angularDecorator, {APP_NAME} from '../../.storybook/angular-decorator';

import hubConfig from '../../.storybook/hub-config';

import Auth from '@jetbrains/ring-ui/components/auth/auth';
import {createHubUserCardSource} from '@jetbrains/ring-ui/components/hub-source/hub-source__user';

import {avatarDataUri} from '@jetbrains/ring-ui/components/avatar/avatar-example-datauri';

import UserCardNG from '@jetbrains/ring-ui/components/user-card-ng/user-card-ng';

export default {
  title: 'Legacy Angular/User Card Ng',
  decorators: [angularDecorator()],

  parameters: {
    notes: 'Provides an Angular wrapper for User Card.',
    hermione: {skip: true}
  }
};

export const basic = () => {
  angular.module(APP_NAME, [UserCardNG]).controller('ExampleCtrl', function ctrl() {
    this.user = {
      login: 'testuser',
      name: 'Test User',
      email: 'testuser@mail.com',
      avatarUrl: avatarDataUri,
      href: `${hubConfig.serverUri}/users/0`
    };
  });

  return `
      <div ng-controller="ExampleCtrl as ctrl">
        <rg-user-card-tooltip user="ctrl.user">
          Hover me to see {{ctrl.user.name}}'s card
        </rg-user-card-tooltip>
      </div>
    `;
};

basic.story = {
  name: 'basic'
};

export const loadOnHover = () => {
  angular.module(APP_NAME, [UserCardNG]).controller('ExampleCtrl', function ctrl() {
    const auth = new Auth(hubConfig);

    this.userSource = async () => {
      await auth.init();
      const userSource = createHubUserCardSource(auth, auth.user.id);
      return userSource();
    };
  });

  return `
      <div ng-controller="ExampleCtrl as ctrl">
        <rg-smart-user-card-tooltip user-data-source="ctrl.userSource">
          Hover me to see current user's card
        </rg-smart-user-card-tooltip>
      </div>
    `;
};

loadOnHover.story = {
  name: 'load on hover'
};
