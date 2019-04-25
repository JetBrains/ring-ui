import angular from 'angular';

import {storiesOf} from '@storybook/html';

import angularDecorator, {APP_NAME} from '../../.storybook/angular-decorator';

import ButtonNG from '../button-ng/button-ng';

import ButtonSetNG from './button-set-ng';

storiesOf('Legacy Angular|Button Set Ng', module).
  addDecorator(angularDecorator()).
  add('basic', () => {
    angular.module(APP_NAME, [ButtonNG, ButtonSetNG]);

    return `
      <rg-button-set>
        <rg-button>Button 1</rg-button>
        <rg-button>Button 2</rg-button>
        <rg-button>Button 3</rg-button>
      </rg-button-set>
    `;
  });
