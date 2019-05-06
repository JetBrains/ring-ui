import angular from 'angular';

import {storiesOf} from '@storybook/html';

import AuthNG from '../auth-ng/auth-ng';
import angularDecorator, {APP_NAME} from '../../.storybook/angular-decorator';
import hubConfig from '../../.storybook/hub-config';


storiesOf('Legacy Angular|Auth Ng', module).
  addParameters({
    notes: 'Provides an Angular wrapper for Auth.',
    hermione: {skip: true}
  }).
  addDecorator(angularDecorator()).
  add('authorization', () => {
    angular.module(APP_NAME, [AuthNG]).
      config(['authProvider', function provider(authProvider) {
        authProvider.config(hubConfig);
      }]).
      controller('testCtrl', function controller(auth, $q) {
        $q.resolve(auth.requestUser()).
          then(user => {
            this.user = user;
          });
      });

    return `
      <div ng-controller="testCtrl as ctrl">
        <h3>User info</h3>
        <pre>{{ ctrl.user | json }}</pre>
      </div>
    `;
  });
