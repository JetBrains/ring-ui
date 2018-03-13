import angular from 'angular';

import Pager from '../pager-ng/pager-ng';
import MessageBundle from '../message-bundle-ng/message-bundle-ng';

const angularModule = angular.module('Ring.table-legacy.pager', [MessageBundle, Pager]);
angularModule.directive('rgLegacyTablePager', function rgLegacyTablePagerDirective() {
  return {
    restrict: 'E',
    template: require('./table-legacy-ng__pager.html'),
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
