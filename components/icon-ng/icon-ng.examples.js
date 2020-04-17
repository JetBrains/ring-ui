import angular from 'angular';

import checkmarkIcon from '@jetbrains/icons/checkmark.svg';
import warningIcon from '@jetbrains/icons/warning.svg';

import angularDecorator, {APP_NAME} from '../../.storybook/angular-decorator';

import IconNG from '@jetbrains/ring-ui/components/icon-ng/icon-ng';

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

basic.story = {
  name: 'basic'
};
