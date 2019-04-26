import angular from 'angular';

import {storiesOf} from '@storybook/html';

import angularDecorator, {APP_NAME} from '../../.storybook/angular-decorator';
import IconNG from '../icon-ng/icon-ng';
import {WarningIcon} from '../icon';

import TooltipNG from './tooltip-ng';

storiesOf('Legacy Angular|Tooltip Ng', module).
  addDecorator(angularDecorator()).
  add('basic', () => {
    angular.module(APP_NAME, [IconNG, TooltipNG]).
      controller('testController', function ctrl() {
        this.warningIcon = WarningIcon;
        this.testMessageWithQuote = 'It\'s a message with a single quotation mark';
      });

    return `
      <div ng-controller="testController as ctrl" style="margin: 16px;">
        Some text that needs an explanation
        <rg-icon glyph="{{ctrl.warningIcon}}" rg-tooltip="'Test message'"></rg-icon>
        <rg-icon glyph="{{ctrl.warningIcon}}" rg-tooltip="{{ctrl.testMessageWithQuote}}"></rg-icon>
        <rg-icon glyph="{{ctrl.warningIcon}}" rg-tooltip="{{ctrl.someUndefinedValue}}"></rg-icon>
      </div>
    `;
  });
