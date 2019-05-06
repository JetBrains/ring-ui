import angular from 'angular';

import {storiesOf} from '@storybook/html';

import angularDecorator, {APP_NAME} from '../../.storybook/angular-decorator';

import ButtonNG from '../button-ng/button-ng';
import ButtonGroupNg from '../button-group-ng/button-group-ng';

import ButtonToolbarNG from './button-toolbar-ng';

storiesOf('Legacy Angular|Button Toolbar Ng', module).
  addParameters({
    notes: 'Provides an Angular wrapper for Button Toolbar.'
  }).
  addDecorator(angularDecorator()).
  add('basic', () => {
    angular.module(APP_NAME, [ButtonNG, ButtonToolbarNG, ButtonGroupNg]);

    return `
      <div rg-button-toolbar>
        <rg-button mode="primary" delayed="true">Run</rg-button>
        <div rg-button-group>
          <rg-button>Button one</rg-button>
          <rg-button>Button two</rg-button>
          <rg-button disabled>Button three</rg-button>
        </div>
        <rg-button>Another action</rg-button>
      </div>
    `;
  });
