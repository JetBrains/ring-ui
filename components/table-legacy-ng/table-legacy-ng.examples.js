import angular from 'angular';

import {storiesOf} from '@storybook/html';

import angularDecorator, {APP_NAME} from '../../.storybook/angular-decorator';

import SelectNG from '../select-ng/select-ng';
import SidebarNG from '../sidebar-ng/sidebar-ng';
import QueryAssistNG from '../query-assist-ng/query-assist-ng';

import TableNG from './table-legacy-ng';

storiesOf('Legacy Angular|TableLegacy Ng', module).
  addDecorator(angularDecorator()).
  add('basic', () => {
    angular.module(APP_NAME, [TableNG]).
      controller('testCtrl', function controller() {
        this.itemsArray = [{
          name: 'test1',
          subList: [{name: 'some group'}],
          iconUrl: 'https://d13yacurqjgara.cloudfront.net/users/317408/avatars/mini/Layout_Behance_Avatar_(1).jpg?1376382552'
        }];

        for (let i = 0; i < 20; i++) {
          this.itemsArray.push({
            name: Math.random(),
            subList: [
              {name: Math.random()},
              {name: Math.random()},
              {name: Math.random()}
            ]
          });
        }
      });

    return `
      <div ng-controller="testCtrl as ctrl">
        <rg-legacy-table-toolbar stick>
          <div>Some toolbar content. Selected item:
            {{ctrl.selection.getActiveItem().name}}
          </div>
        </rg-legacy-table-toolbar>

        <rg-legacy-table items="ctrl.itemsArray" selection="ctrl.selection">
          <rg-legacy-table-header>
            <rg-legacy-table-title>Avatar</rg-legacy-table-title>
            <rg-legacy-table-title>Check</rg-legacy-table-title>
            <rg-legacy-table-title active>Name</rg-legacy-table-title>
            <rg-legacy-table-title>Groups</rg-legacy-table-title>
          </rg-legacy-table-header>

          <rg-legacy-table-row row-item="item" ng-repeat="item in ctrl.itemsArray">
            <rg-legacy-table-column avatar>
              <img ng-if="::item.iconUrl" ng-src="{{ ::item.iconUrl }}"
                class="ring-table__avatar__img"/>
            </rg-legacy-table-column>
            <rg-legacy-table-checkbox-cell></rg-legacy-table-checkbox-cell>
            <rg-legacy-table-column limited>{{ ::item.name }}</rg-legacy-table-column>
            <rg-legacy-table-column wide limited>
              <span class="ring-table__column-list"
                ng-repeat="subItem in ::item.subList">{{ ::subItem.name }}</span>
            </rg-legacy-table-column>
          </rg-legacy-table-row>
        </rg-legacy-table>
      </div>
    `;
  }).
  add('without selection', () => {
    angular.module(APP_NAME, [TableNG]);

    return `
      <div ng-init="itemsArray = ['first', 'second', 'third', 'fourth']">
        <rg-legacy-table items="itemsArray" disable-selection="true">
          <rg-legacy-table-row row-item="item" ng-repeat="item in itemsArray">
            <rg-legacy-table-column>{{item}}</rg-legacy-table-column>
          </rg-legacy-table-row>
        </rg-legacy-table>
      </div>
    `;
  }).
  add('with sidebar', () => {
    angular.module(APP_NAME, [TableNG, SidebarNG, SelectNG, QueryAssistNG]).
      controller('testCtrl', function controller($timeout) {
        this.query = 'fooo';

        this.isShowSideBar = true;

        $timeout(() => {
          this.itemsArray = [{
            name: 'test1',
            iconUrl: 'https://d13yacurqjgara.cloudfront.net/users/317408/avatars/mini/Layout_Behance_Avatar_(1).jpg?1376382552'
          }];

          for (let i = 0; i < 20; i++) {
            this.itemsArray.push({name: Math.random()});
          }
        }, 500);

        this.queryAssistSource = ({query, caret, omitSuggestions}) => ({
          caret,
          query,
          styleRanges: omitSuggestions
            ? [{
              start: 0,
              length: 1,
              style: 'text'
            }]
            : [],
          suggestions: [{
            prefix: 'login: ',
            option: 'test',
            suffix: ' ',
            description: 'logins',
            matchingStart: 0,
            matchingEnd: 4,
            caret: 2,
            completionStart: 0,
            completionEnd: 4,
            group: 'logins',
            icon: 'data:uri'
          }]
        });
      });

    return `
      <h3>Scroll down to see the effect</h3>
      <div ng-controller="testCtrl as ctrl">
        <rg-sidebar show="ctrl.isShowSideBar"
          place-under-sibling=".some-toolbar"
          top-offset="1">
          <div class="ring-sidebar__title">Here is sidebar content</div>
          <div class="ring-sidebar__section">
            {{ctrl.selection.getActiveItem().name}}
          </div>
          <rg-select
            options="item.name for item in ctrl.itemsArray track by item.name"></rg-select>

          <rg-query-assist
            x-data-source="ctrl.queryAssistSource"
            query="ctrl.query"></rg-query-assist>
        </rg-sidebar>

        <rg-legacy-table-toolbar stick class="some-toolbar">
          <div>Some toolbar content. Selected
            item: {{ctrl.selection.getActiveItem().name}}
            <rg-sidebar-toggle-button model="ctrl.isShowSideBar">Toggle
              toolbar
            </rg-sidebar-toggle-button>
          </div>
        </rg-legacy-table-toolbar>

        <rg-legacy-table items="ctrl.itemsArray" selection="ctrl.selection">
          <rg-legacy-table-header class="example__table-header"
            stick-to=".some-toolbar">
            <rg-legacy-table-title>Avatar</rg-legacy-table-title>
            <rg-legacy-table-title>Check</rg-legacy-table-title>
            <rg-legacy-table-title active>Name</rg-legacy-table-title>
            <rg-legacy-table-title></rg-legacy-table-title>
          </rg-legacy-table-header>

          <rg-legacy-table-row row-item="item" ng-repeat="item in ctrl.itemsArray">
            <rg-legacy-table-column avatar>
              <img ng-if="::item.iconUrl" ng-src="{{ ::item.iconUrl }}"
                class="ring-table__avatar__img"/>
            </rg-legacy-table-column>
            <rg-legacy-table-checkbox-cell></rg-legacy-table-checkbox-cell>
            <rg-legacy-table-column limited>{{::item.name }}</rg-legacy-table-column>
            <rg-legacy-table-column>
              <rg-sidebar-toggle-button ng-show="item.active"
                model="ctrl.isShowSideBar"></rg-sidebar-toggle-button>
            </rg-legacy-table-column>
          </rg-legacy-table-row>
        </rg-legacy-table>
      </div>
    `;
  });
