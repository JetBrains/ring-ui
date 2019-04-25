import angular from 'angular';

import {storiesOf} from '@storybook/html';

import angularDecorator, {APP_NAME} from '../../.storybook/angular-decorator';
import GroupNG from '../group-ng/group-ng';

import BadgeNG from './badge-ng';

storiesOf('Legacy Angular|Badge Ng', module).
  addDecorator(angularDecorator()).
  add('basic', () => {
    angular.module(APP_NAME, [GroupNG, BadgeNG]);

    return `
      <rg-group>
        <rg-badge>simple</rg-badge>
        <rg-badge gray="true">gray</rg-badge>
        <rg-badge valid="true">valid</rg-badge>
        <rg-badge invalid="true">invalid</rg-badge>
        <rg-badge disabled="true">disabled</rg-badge>
      </rg-group>
    `;
  });
