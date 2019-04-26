import angular from 'angular';

import {storiesOf} from '@storybook/html';
import {action} from '@storybook/addon-actions';

import angularDecorator, {APP_NAME} from '../../.storybook/angular-decorator';

import hubConfig from '../../.storybook/hub-config';
import AuthNG from '../auth-ng/auth-ng';

import QueryAssistNG from './query-assist-ng';

storiesOf('Legacy Angular|Query Assist Ng', module).
  addDecorator(angularDecorator()).
  add('basic', () => {
    angular.module(APP_NAME, [QueryAssistNG, AuthNG]).
      config(authProvider => {
        authProvider.config(hubConfig);
      }).
      controller('testCtrl', function ctrl($http) {
        this.queries = [];
        this.query = 'query';
        this.focus = true;
        this.disabled = true;

        this.save = ({query}) => {
          this.queries.unshift(query);
        };

        this.change = ({query}) => {
          this.query = query;
          action('onChange')('Query = ', query);
        };

        this.focusChange = ({focus}) => {
          this.focus = focus;
        };

        this.source = ({query, caret, omitSuggestions}) => {
          const config = {
            params: {
              fields: `query,caret,styleRanges${omitSuggestions ? '' : ',suggestions'}`,
              query,
              caret
            }
          };

          return $http.get(`${hubConfig.serverUri}/api/rest/users/queryAssist`, config).
            then(data => data.data);
        };
      });

    return `
      <div ng-controller="testCtrl as ctrl">
        <button ng-click="ctrl.disabled = !ctrl.disabled">Disable/Enable</button>
  
        <div>
          <p>{{ ctrl.query || 'no value' }}</p>
  
          <rg-query-assist
            x-clear="true"
            x-data-source="ctrl.source"
            x-disabled="ctrl.disabled"
            glass="true"
            focus="ctrl.focus"
            query="ctrl.query"
            on-apply="ctrl.save"
            on-change="ctrl.change"
            on-focus-change="ctrl.focusChange"
            placeholder="'placeholder'"
            hint="'Press ⇥ to complete first item'"
            hint-on-selection="'Press ↩ to complete selected item'"></rg-query-assist>
  
          <p ng-repeat="query in ctrl.queries track by $index">{{ query }}</p>
        </div>
      </div>
    `;
  });
