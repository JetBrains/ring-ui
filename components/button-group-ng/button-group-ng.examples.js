import angular from 'angular';

import {storiesOf} from '@storybook/html';

import angularDecorator, {APP_NAME} from '../../.storybook/angular-decorator';

import ButtonNG from '../button-ng/button-ng';
import ButtonGroupNG from '../button-group-ng/button-group-ng';

storiesOf('Legacy Angular|Button Group Ng', module).
  addParameters({
    notes: 'Provides an Angular wrapper for Button Group.'
  }).
  addDecorator(angularDecorator()).
  add('basic', () => {
    angular.module(APP_NAME, [ButtonNG, ButtonGroupNG]);

    return `
      <div rg-button-group>
        <span rg-button-group-caption>Side</span>
        <rg-button>Left</rg-button>
        <rg-button>Right</rg-button>
      </div>
    `;
  });
