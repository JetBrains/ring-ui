import angular from 'angular';

import angularDecorator, {APP_NAME} from '../../.storybook/angular-decorator';

import {Size as AvatarSize} from '@jetbrains/ring-ui/components/avatar/avatar';

import {avatarDataUri} from '@jetbrains/ring-ui/components/avatar/avatar-example-datauri';

import AvatarNG from '@jetbrains/ring-ui/components/avatar-ng/avatar-ng';

export default {
  title: 'Legacy Angular/Avatar Ng',
  decorators: [angularDecorator()],

  parameters: {
    notes: 'Provides an Angular wrapper for Avatar.'
  }
};

export const basic = () => {
  angular.module(APP_NAME, [AvatarNG]).controller('testCtrl', function controller() {
    this.AvatarSize = AvatarSize;
    this.avatarUrl = avatarDataUri;
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
