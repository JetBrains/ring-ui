import angular from 'angular';

import angularDecorator, {APP_NAME} from '../../.storybook/angular-decorator';

import RingPager from './pager-ng';

export default {
  title: 'Legacy Angular|Pager Ng',
  decorators: [angularDecorator()],

  parameters: {
    notes: 'Provides an Angular wrapper for Pager.'
  }
};

export const basic = () => {
  angular.module(APP_NAME, [RingPager]).controller('testCtrl', function controller() {
    this.total = 750;
    this.currentPage = 1;

    this.onPageChange = page => {
      this.currentPage = page;
    };
  });

  return `
      <div ng-controller="testCtrl as ctrl">
        <rg-pager
          total="ctrl.total"
          current-page="ctrl.currentPage"
          on-page-change="ctrl.onPageChange"
        ></rg-pager>
      </div>
    `;
};

basic.story = {
  name: 'basic'
};
