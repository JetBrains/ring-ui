import angular from 'angular';

import checkmarkIcon from '@jetbrains/icons/checkmark';
import warningIcon from '@jetbrains/icons/warning';

import angularDecorator, {APP_NAME} from '../../.storybook/angular-decorator';

import IconNG from './icon-ng';

export default {
  title: 'Legacy Angular/Icon Ng',
  decorators: [angularDecorator()],

  parameters: {
    notes: 'Provides an Angular wrapper for Icon.'
  }
};

export const basic = () => {
  angular.module(APP_NAME, [IconNG]).controller('testCtrl', function ctrl() {
    this.icon = checkmarkIcon;
    this.error = warningIcon;
  });

  return `
      <div ng-controller="testCtrl as ctrl">
        <rg-icon glyph="{{ctrl.icon}}"></rg-icon>
        <rg-icon glyph="{{ctrl.icon}}" color="MAGENTA"></rg-icon>
        <rg-icon glyph="{{ctrl.icon}}" color="{{'BLUE'}}" loading="true"></rg-icon>
      </div>
    `;
};

basic.storyName = 'Icon Ng';
