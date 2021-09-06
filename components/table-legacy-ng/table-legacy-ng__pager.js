import angular from 'angular';

import Pager from '../pager-ng/pager-ng';
import MessageBundle from '../message-bundle-ng/message-bundle-ng';

const angularModule = angular.module('Ring.table-legacy.pager', [MessageBundle, Pager]);
angularModule.directive('rgLegacyTablePager', function rgLegacyTablePagerDirective() {
  return {
    restrict: 'E',
    template: `<rg-pager
  total="pagerCtrl.total"
  current-page="pagerCtrl.getPage()"
  page-size="pagerCtrl.top"
  on-page-change="pagerCtrl.onPageChange"
  disable-page-size-selector="true"
></rg-pager>`,
    scope: {},
    bindToController: {
      skip: '=',
      top: '=',
      total: '=',
      onPageChange: '&'
    },

    controllerAs: 'pagerCtrl',
    controller: function controller() {
      this.getPage = () => this.top / this.skip;
    }
  };
});

export default angularModule.name;
