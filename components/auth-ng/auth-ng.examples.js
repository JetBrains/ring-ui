/* eslint-disable angular/no-controller */
import angular from 'angular';

import {storiesOf} from '@storybook/html';

import AuthNG from '../auth-ng/auth-ng';
import hubConfig from '../../packages/docs/components/hub-config';


storiesOf('Legacy Angular|Auth Ng', module).
  add('authorization', () => {
    angular.module('test', [AuthNG]).
      config(['authProvider', function provider(authProvider) {
        authProvider.config(hubConfig);
      }]).
      controller('testCtrl', function controller(auth, $q) {
        $q.resolve(auth.requestUser()).
          then(user => {
            this.user = user;
          });
      });

    const node = document.createElement('div');
    node.innerHTML = `
      <div ng-controller="testCtrl as ctrl">
        <h3>User info</h3>
        <pre>{{ ctrl.user | json }}</pre>
      </div>
    `;

    angular.bootstrap(node, ['test'], {strictDi: true});

    return node;
  });
