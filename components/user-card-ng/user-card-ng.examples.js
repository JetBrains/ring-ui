import angular from 'angular';

import {storiesOf} from '@storybook/html';

import angularDecorator, {APP_NAME} from '../../.storybook/angular-decorator';

import hubConfig from '../../.storybook/hub-config';
import UserCardNG from '../user-card-ng/user-card-ng';
import Auth from '../auth/auth';
import {createHubUserCardSource} from '../hub-source/hub-source__user';

storiesOf('Legacy Angular|User Card Ng', module).
  addParameters({hermione: {skip: true}}).
  addDecorator(angularDecorator()).
  add('basic', () => {
    angular.module(APP_NAME, [UserCardNG]).
      controller('ExampleCtrl', function ctrl() {
        this.user = {
          login: 'testuser',
          name: 'Test User',
          email: 'testuser@mail.com',
          avatarUrl: `${hubConfig.serverUri}/api/rest/avatar/default?username=Jet%20Brains`,
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
  }).
  add('load on hover', () => {
    angular.module(APP_NAME, [UserCardNG]).
      controller('ExampleCtrl', function ctrl() {
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
  });
