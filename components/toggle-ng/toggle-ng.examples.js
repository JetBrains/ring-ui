import angular from 'angular';

import {storiesOf} from '@storybook/html';

import angularDecorator, {APP_NAME} from '../../.storybook/angular-decorator';

import ToggleNG from '../toggle-ng/toggle-ng';

storiesOf('Legacy Angular|Toggle Ng', module).
  addParameters({
    notes: 'Provides an Angular wrapper for Toggle.'
  }).
  addDecorator(angularDecorator()).
  add('basic', () => {
    angular.module(APP_NAME, [ToggleNG]);

    return '<rg-toggle></rg-toggle>';
  });
