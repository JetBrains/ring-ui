import angular from 'angular';

import warningIcon from '@jetbrains/icons/warning.svg';

import angularDecorator, {APP_NAME} from '../../.storybook/angular-decorator';

import IconNG from '@jetbrains/ring-ui/components/icon-ng/icon-ng';

import TooltipNG from '@jetbrains/ring-ui/components/tooltip-ng/tooltip-ng';

export default {
  title: 'Legacy Angular/Tooltip Ng',
  decorators: [angularDecorator()],

  parameters: {
    notes: 'Provides an Angular wrapper for Tooltip.'
  }
};

export const basic = () => {
  angular.module(APP_NAME, [IconNG, TooltipNG]).controller('testController', function ctrl() {
    this.warningIcon = warningIcon;
    this.testMessageWithQuote = "It's a message with a single quotation mark";
  });

  return `
      <div ng-controller="testController as ctrl" style="margin: 16px;">
        Some text that needs an explanation
        <rg-icon glyph="{{ctrl.warningIcon}}" rg-tooltip="'Test message'"></rg-icon>
        <rg-icon glyph="{{ctrl.warningIcon}}" rg-tooltip="{{ctrl.testMessageWithQuote}}"></rg-icon>
        <rg-icon glyph="{{ctrl.warningIcon}}" rg-tooltip="{{ctrl.someUndefinedValue}}"></rg-icon>
      </div>
    `;
};

basic.story = {
  name: 'basic'
};
