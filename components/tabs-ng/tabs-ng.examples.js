import angular from 'angular';

import angularDecorator, {APP_NAME} from '../../.storybook/angular-decorator';

import RingTabs from '@jetbrains/ring-ui/components/tabs-ng/tabs-ng';

export default {
  title: 'Legacy Angular/Tabs Ng',
  decorators: [angularDecorator()],

  parameters: {
    notes: 'Displays a tabset.'
  }
};

export const basic = () => {
  angular.module(APP_NAME, [RingTabs]);

  return `
      <rg-tabs class="container container_tabs">
        <rg-tabs-pane x-title="Settings">Settings tab content</rg-tabs-pane>
        <rg-tabs-pane x-title="Access" counter="7">Access tab content</rg-tabs-pane>
        <rg-tabs-pane x-title="Disabled" ng-disabled="true" counter="8">Inaccessible tab content</rg-tabs-pane>
        <rg-tabs-pane x-title="Members">Members tab content</rg-tabs-pane>
        <rg-tabs-pane x-title="Members" counter="666">Members 666 tab content</rg-tabs-pane>
      </rg-tabs>
    `;
};

basic.story = {
  name: 'basic'
};

export const dark = () => {
  angular.module(APP_NAME, [RingTabs]);

  return `
      <rg-tabs class="container container_tabs" theme="dark">
        <rg-tabs-pane x-title="Settings">Settings tab content</rg-tabs-pane>
        <rg-tabs-pane x-title="Access" counter="7">Access tab content</rg-tabs-pane>
        <rg-tabs-pane x-title="Disabled" ng-disabled="true" counter="8">Inaccessible tab content</rg-tabs-pane>
        <rg-tabs-pane x-title="Members">Members tab content</rg-tabs-pane>
        <rg-tabs-pane x-title="Members" counter="666">Members 666 tab content</rg-tabs-pane>
      </rg-tabs>
    `;
};

dark.story = {
  name: 'dark',

  parameters: {
    storyStyles: `
      <style>
        body {
          background: #000;
          color: #fff;
        }
      </style>`
  }
};
