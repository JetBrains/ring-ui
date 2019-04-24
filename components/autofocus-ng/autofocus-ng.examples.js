import angular from 'angular';

import {storiesOf} from '@storybook/html';

import angularDecorator, {APP_NAME} from '../../.storybook/angular-decorator';
import InputNg from '../input-ng/input-ng';
import SelectNg from '../select-ng/select-ng';

import AutofocusNG from './autofocus-ng';

// TODO: calling .focus() doesn't actually focus inputs in Storybook by some reason

storiesOf('Legacy Angular|Autofocus Ng', module).
  addDecorator(angularDecorator()).
  add('autofocus on input', () => {
    angular.module(APP_NAME, [AutofocusNG, InputNg]);

    return `
      <rg-input
        rg-autofocus="true"
        size="M"
        placeholder="Should be focused"
      ></rg-input>
    `;
  }).
  add('autofocus on select', () => {
    angular.module(APP_NAME, [AutofocusNG, SelectNg]);

    return '<rg-select options="item in []" size="M" rg-autofocus="true"></rg-select>';
  });
