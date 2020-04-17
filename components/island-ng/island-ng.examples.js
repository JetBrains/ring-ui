import angular from 'angular';

import angularDecorator, {APP_NAME} from '../../.storybook/angular-decorator';

import IslandNg from '@jetbrains/ring-ui/components/island-ng/island-ng';

export default {
  title: 'Legacy Angular/Island Ng',
  decorators: [angularDecorator()],

  parameters: {
    notes: 'Provides an Angular wrapper for Island.',
    hermione: {captureSelector: '*[data-test~=ring-island]'}
  }
};

export const basic = () => {
  angular.module(APP_NAME, [IslandNg]);

  return `
      <rg-island>
        <rg-island-header border="true">
          This is header
        </rg-island-header>
        <rg-island-content>
          This is content
        </rg-island-content>
      </rg-island>
    `;
};

basic.story = {
  name: 'basic'
};

export const scrollable = () => {
  angular.module(APP_NAME, [IslandNg]);

  return `
      <rg-island narrow="true" style="height: 200px; width: 200px;">
        <rg-island-header border="true">
          Title
        </rg-island-header>
        <rg-island-content fade="true">
          Lorem Ipsum is simply dummy text of the printing and typesetting
          industry. Lorem Ipsum has been the industry's standard dummy text ever
          since the 1500s, when an unknown printer took a galley of type and
          scrambled it to make a type specimen book. It has survived not only five
          centuries, but also the leap into electronic typesetting, remaining
          essentially unchanged.
        </rg-island-content>
      </rg-island>
    `;
};

scrollable.story = {
  name: 'scrollable'
};
