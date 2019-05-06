import angular from 'angular';

import {storiesOf} from '@storybook/html';

import angularDecorator, {APP_NAME} from '../../.storybook/angular-decorator';

import BreadcrumbNG from './breadcrumb-ng';

storiesOf('Legacy Angular|Breadcrumb Ng', module).
  addParameters({
    notes: 'Displays a breadcrumb.'
  }).
  addDecorator(angularDecorator()).
  add('basic', () => {
    angular.module(APP_NAME, [BreadcrumbNG]).
      controller('DemoCtrl', function controller() {
        // eslint-disable-next-line no-alert
        this.clickSecondLevel = () => alert('Second level was clicked');
      });

    return `
      <div ng-controller="DemoCtrl as ctrl">
        <rg-breadcrumb label="First level" link="test/href1">
          <rg-breadcrumb label="Second level" on-click="ctrl.clickSecondLevel()">
            <span>Active level</span>
          </rg-breadcrumb>
        </rg-breadcrumb>
      </div>
    `;
  });
