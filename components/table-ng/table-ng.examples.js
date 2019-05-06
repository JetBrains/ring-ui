import angular from 'angular';

import {storiesOf} from '@storybook/html';

import angularDecorator, {APP_NAME} from '../../.storybook/angular-decorator';
import TableLegacyToolbar from '../table-legacy-ng/table-legacy-ng__toolbar';
import Selection from '../table/selection';
import data from '../table/table.examples.json';

import TableNG from './table-ng';

storiesOf('Legacy Angular|Table Ng', module).
  addParameters({
    notes: 'Provides an Angular wrapper for Table.'
  }).
  addDecorator(angularDecorator()).
  add('basic', () => {
    angular.module(APP_NAME, [TableNG, TableLegacyToolbar]).
      controller('testCtrl', function controller() {
        const columns = [
          {
            id: 'country',
            title: 'Country'
          },
          {
            id: 'city',
            title: 'City',
            sortable: true
          },
          {
            id: 'url',
            title: 'URL'
          }
        ];

        this.data = data;
        this.columns = columns;
        this.selection = new Selection({data});
        this.sortKey = 'city';
        this.sortOrder = false;

        this.onSelect = selection => {
          this.selection = selection;
        };

        this.onSort = ({column: {id: key}, order}) => {
          this.sortOrder = order;
          this.data = this.data.slice().sort((itemA, itemB) => (
            order ? itemA[key].localeCompare(itemB[key]) : itemB[key].localeCompare(itemA[key])
          ));
        };
      });

    return `
      <div ng-controller="testCtrl as ctrl">
        <h3>Title of the page</h3>

        <rg-legacy-table-toolbar stick>
          <div>Some toolbar content. Focused: {{ctrl.selection.getFocused().country}}</div>
        </rg-legacy-table-toolbar>

        <rg-table
          data="ctrl.data"
          columns="ctrl.columns"
          selection="ctrl.selection"
          on-select="ctrl.onSelect"
          autofocus="true"
          sticky-header-offset="'56px'"

          sort-key="ctrl.sortKey"
          sort-order="ctrl.sortOrder"
          on-sort="ctrl.onSort"
        ></rg-table>
      </div>
    `;
  });
