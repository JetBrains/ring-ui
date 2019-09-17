import angular from 'angular';

import angularDecorator, {APP_NAME} from '../../.storybook/angular-decorator';
import Selection from '../data-list/selection';
import data from '../data-list/data-list.mock';

import RingDataList from './data-list-ng';

export default {
  title: 'Legacy Angular|DataList Ng',
  decorators: [angularDecorator()],

  parameters: {
    notes: 'Provides an Angular wrapper for DataList.'
  }
};

export const basic = () => {
  angular.module(APP_NAME, [RingDataList]).controller('testCtrl', function controller() {
    function itemFormatter(item) {
      return {
        ...item,
        collapsible: false
      };
    }

    const selection = new Selection({
      data,
      isItemSelectable: item => item.selectable,
      getChildren: item => item.items || []
    });

    this.data = data;
    this.itemFormatter = itemFormatter;
    this.selection = selection;
    this.onSelect = newSelection => {
      this.selection = newSelection;
    };
  });

  return `
      <div ng-controller="testCtrl as ctrl">
        <rg-data-list
          data="ctrl.data"
          selection="ctrl.selection"
          on-select="ctrl.onSelect"
          item-formatter="ctrl.itemFormatter"
        ></rg-data-list>
      </div>
    `;
};

basic.story = {
  name: 'basic'
};
