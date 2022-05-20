import angular from 'angular';

import angularDecorator, {APP_NAME} from '../../.storybook/angular-decorator';

import BreadcrumbNG from './breadcrumb-ng';

export default {
  title: 'Legacy Angular/Breadcrumb Ng',
  decorators: [angularDecorator()],

  parameters: {
    notes: 'Displays a breadcrumb.'
  }
};

export const basic = ({onClickSecondLevel}) => {
  angular.module(APP_NAME, [BreadcrumbNG]).controller('DemoCtrl', function controller() {
    this.clickSecondLevel = onClickSecondLevel;
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

basic.storyName = 'Breadcrumb Ng';
basic.argTypes = {onClickSecondLevel: {}};
