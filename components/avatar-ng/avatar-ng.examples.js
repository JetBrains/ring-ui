import angular from 'angular';

import {storiesOf} from '@storybook/html';

import angularDecorator, {APP_NAME} from '../../.storybook/angular-decorator';
import hubConfig from '../../.storybook/hub-config';
import {Size as AvatarSize} from '../avatar/avatar';
import AvatarNG from '../avatar-ng/avatar-ng';

storiesOf('Legacy Angular|Avatar Ng', module).
  addParameters({
    notes: 'Provides an Angular wrapper for Avatar.'
  }).
  addDecorator(angularDecorator()).
  add('basic', () => {
    angular.module(APP_NAME, [AvatarNG]).
      controller('testCtrl', function controller() {
        this.AvatarSize = AvatarSize;
        this.avatarUrl = `${hubConfig.serverUri}/api/rest/avatar/default?username=Jet%20Brains`;
      });

    return `
      <div ng-controller="testCtrl as $ctrl">
        <rg-avatar size="$ctrl.AvatarSize.Size32" url="$ctrl.avatarUrl"></rg-avatar>
      </div>
    `;
  });
