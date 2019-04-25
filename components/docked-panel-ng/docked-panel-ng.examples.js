import angular from 'angular';

import {storiesOf} from '@storybook/html';

import angularDecorator, {APP_NAME} from '../../.storybook/angular-decorator';

import DockedPanelNG from '../docked-panel-ng/docked-panel-ng';
import PanelNG from '../panel-ng/panel-ng';
import ButtonNG from '../button-ng/button-ng';

storiesOf('Legacy Angular|Docked Panel Ng', module).
  addDecorator(angularDecorator()).
  add('basic', () => {
    angular.module(APP_NAME, [ButtonNG, DockedPanelNG, PanelNG]);

    return `
      <div>
        <textarea placeholder="Add description" rows="70" cols="100"></textarea>
      </div>
      <div rg-panel rg-docked-panel rg-docked-panel-class="customCssClass">
        <rg-button mode="primary">Save</rg-button>
        <rg-button >Cancel</rg-button>
      </div>
      <br/>
      <div>
        <textarea placeholder="Add steps" rows="10" cols="50"></textarea>
      </div>
    </div>
    `;
  });
