import angular from 'angular';

import {action} from '@storybook/addon-actions';

import angularDecorator, {APP_NAME} from '../../.storybook/angular-decorator';

import BreadcrumbNG from '@jetbrains/ring-ui/components/breadcrumb-ng/breadcrumb-ng';

export default {
  title: 'Legacy Angular/Breadcrumb Ng',
  decorators: [angularDecorator()],

  parameters: {
    notes: 'Displays a breadcrumb.'
  }
};

export const basic = () => {
  angular.module(APP_NAME, [BreadcrumbNG]).controller('DemoCtrl', function controller() {
    this.clickSecondLevel = action('Second level was clicked');
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
};

basic.story = {
  name: 'basic'
};
