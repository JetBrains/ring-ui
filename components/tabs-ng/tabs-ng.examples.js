import angular from 'angular';

import {storiesOf} from '@storybook/html';

import angularDecorator, {APP_NAME} from '../../.storybook/angular-decorator';

import RingTabs from './tabs-ng';

storiesOf('Legacy Angular|Tabs Ng', module).
  addDecorator(angularDecorator()).
  add('basic', () => {
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
  }).
  add('dark', () => {
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
  });
