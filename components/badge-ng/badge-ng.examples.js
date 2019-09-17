import angular from 'angular';

import angularDecorator, {APP_NAME} from '../../.storybook/angular-decorator';
import GroupNG from '../group-ng/group-ng';

import BadgeNG from './badge-ng';

export default {
  title: 'Legacy Angular|Badge Ng',
  decorators: [angularDecorator()],

  parameters: {
    notes: 'Provides an Angular wrapper for Badge.'
  }
};

export const basic = () => {
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
};

basic.story = {
  name: 'basic'
};
