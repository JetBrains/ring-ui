import angular from 'angular';

import {storiesOf} from '@storybook/html';

import angularDecorator, {APP_NAME} from '../../.storybook/angular-decorator';

import RingPager from './pager-ng';

storiesOf('Legacy Angular|Pager Ng', module).
  addDecorator(angularDecorator()).
  add('basic', () => {
    angular.module(APP_NAME, [RingPager]).
      controller('testCtrl', function controller() {
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
  });
