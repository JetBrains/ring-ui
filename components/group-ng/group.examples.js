import angular from 'angular';

import {storiesOf} from '@storybook/html';

import angularDecorator, {APP_NAME} from '../../.storybook/angular-decorator';
import ButtonNG from '../button-ng/button-ng';

import GroupNG from './group-ng';

storiesOf('Legacy Angular|Group Ng', module).
  addDecorator(angularDecorator()).
  add('basic', () => {
    angular.module(APP_NAME, [ButtonNG, GroupNG]);

    return `
      <rg-group>
        <rg-button>First item</rg-button>
        <rg-button>Second item</rg-button>
      </rg-group>
    `;
  });
