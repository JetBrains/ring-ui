import angular from 'angular';

import angularDecorator, {APP_NAME} from '../../.storybook/angular-decorator';

import PanelNG from '@jetbrains/ring-ui/components/panel-ng/panel-ng';
import ButtonNG from '@jetbrains/ring-ui/components/button-ng/button-ng';

import DockedPanelNG from '@jetbrains/ring-ui/components/docked-panel-ng/docked-panel-ng';

export default {
  title: 'Legacy Angular/Docked Panel Ng',
  decorators: [angularDecorator()],

  parameters: {
    notes: 'Creates a panel docked at the bottom of the page.',
    hermione: {skip: true}
  }
};

export const basic = () => {
  angular.module(APP_NAME, [ButtonNG, DockedPanelNG, PanelNG]);

  return `
      <div>
        <textarea aria-label="Description" placeholder="Add description" rows="70" cols="100"></textarea>
      </div>
      <div rg-panel rg-docked-panel rg-docked-panel-class="customCssClass">
        <rg-button mode="primary">Save</rg-button>
        <rg-button >Cancel</rg-button>
      </div>
      <br/>
      <div>
        <textarea aria-label="Description" placeholder="Add steps" rows="10" cols="50"></textarea>
      </div>
    </div>
    `;
};

basic.story = {
  name: 'basic'
};
