import angular from 'angular';

import angularDecorator, {APP_NAME} from '../../.storybook/angular-decorator';
import hubConfig from '../../.storybook/hub-config';
import {Size as AvatarSize} from '../avatar/avatar';

import AvatarNG from './avatar-ng';

export default {
  title: 'Legacy Angular|Avatar Ng',
  decorators: [angularDecorator()],

  parameters: {
    notes: 'Provides an Angular wrapper for Avatar.'
  }
};

export const basic = () => {
  angular.module(APP_NAME, [AvatarNG]).controller('testCtrl', function controller() {
    this.AvatarSize = AvatarSize;
    this.avatarUrl = `${hubConfig.serverUri}/api/rest/avatar/default?username=Jet%20Brains`;
  });

  return `
      <div ng-controller="testCtrl as $ctrl">
        <rg-avatar size="$ctrl.AvatarSize.Size32" url="$ctrl.avatarUrl"></rg-avatar>
      </div>
    `;
};

basic.story = {
  name: 'basic'
};
