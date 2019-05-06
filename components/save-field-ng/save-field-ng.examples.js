/* eslint-disable angular/controller-as */
import angular from 'angular';

import {storiesOf} from '@storybook/html';
import {action} from '@storybook/addon-actions';

import angularDecorator, {APP_NAME} from '../../.storybook/angular-decorator';
import hubConfig from '../../.storybook/hub-config';
import QueryAssistNG from '../query-assist-ng/query-assist-ng';

import SaveFieldNG from './save-field-ng';

storiesOf('Legacy Angular|Save Field Ng', module).
  addParameters({
    notes: 'Allows to create forms where some fields have their own Save buttons.',
    hermione: {skip: true}
  }).
  addDecorator(angularDecorator()).
  add('basic', () => {
    angular.module(APP_NAME, [SaveFieldNG, QueryAssistNG]).
      config((shortcutsProvider, rgSaveFieldShortcutsMode) => {
        shortcutsProvider.mode({
          id: 'ring-shortcuts',
          shortcuts: []
        });
        shortcutsProvider.mode(rgSaveFieldShortcutsMode);
      }).
      controller('SaveFieldDemoCtrl', function ctrl($scope, $q, $http) {
        $scope.data = {
          email: 'aa',
          longText: null,
          longTextList: ['one', 'two', 'three'],
          num: 10,
          someText: 'some text',
          query: 'login: guest'
        };

        // eslint-disable-next-line angular/deferred
        const defer = $q.defer();
        defer.resolve();
        $scope.save = () => {
          action('save')('data = ', $scope.data);
          return defer.promise;
        };

        $scope.invalidSave = currentValue => {
          if (currentValue.length < 7) {
            return $q.reject(`Length of the string must be greater than 7! >> ${currentValue}`);
          } else {
            return true;
          }
        };

        $scope.queryAssistSource = ({query, caret, omitSuggestions}) => {
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

        $scope.updateQueryAssistValue = ({query}) => {
          $scope.data.query = query;
        };
      });

    return `
      <div rg-shortcuts-app>
        <div class="ring-form" ng-controller="SaveFieldDemoCtrl">
  
          <div class="ring-form__group">
            <label class="ring-form__label">
              Input
            </label>
  
            <div class="ring-form__control">
              <rg-save-field value="data.email"
                on-save="save()">
                <input type="text"
                  class="ring-input ring-input-size_md"
                  ng-required="true"
                  ng-pattern="/^[a-zA-Z][a-zA-Z0-9-_\\.]*[@][a-zA-Z0-9-_\\.]+$/"
                  ng-model="data.email">
              </rg-save-field>
              <div class="ring-form__control__description">Enter valid email</div>
            </div>
          </div>
  
          <div class="ring-form__group">
            <label class="ring-form__label">
              Input
            </label>
  
            <div class="ring-form__control">
              <rg-save-field value="data.email" working-value="data.emailWorkingValue"
                on-save="save()">
                <input type="text"
                  class="ring-input ring-input-size_md"
                  ng-required="true"
                  ng-pattern="/^[a-zA-Z][a-zA-Z0-9-_\\.]*[@][a-zA-Z0-9-_\\.]+$/"
                  ng-model="data.emailWorkingValue">
              </rg-save-field>
              <div class="ring-form__control__description">value: {{data.email}}  working-value: {{data.emailWorkingValue}}</div>
            </div>
          </div>
  
          <div class="ring-form__group">
            <label class="ring-form__label">
              Textarea
            </label>
  
            <div class="ring-form__control">
              <rg-save-field value="data.longText"
                on-save="save()">
                  <textarea type="text"
                    class="ring-input ring-input-size_l"
                    ng-required="true"
                    ng-model="data.longText"></textarea>
              </rg-save-field>
            </div>
          </div>
  
          <div class="ring-form__group">
            <label class="ring-form__label">
              Textarea List Mode
            </label>
  
            <div class="ring-form__control">
              <rg-save-field value="data.longTextList"
                multiline="list"
                on-save="save()">
                  <textarea type="text"
                    name="myMultilineArea"
                    class="ring-input ring-input-size_md"
                    ng-model="data.longTextList"></textarea>
              </rg-save-field>
              <div class="ring-form__control__description">data.longTextList =
                {{data.longTextList}}
              </div>
            </div>
          </div>
  
          <div class="ring-form__group">
            <label class="ring-form__label">
              Number
            </label>
  
            <div class="ring-form__control">
              <rg-save-field value="data.num"
                on-save="save()">
                <input type="number"
                  max="10"
                  class="ring-input ring-input-size_xs"
                  ng-model="data.num">
              </rg-save-field>
            </div>
          </div>
  
          <div class="ring-form__group">
            <label class="ring-form__label">
              Rejected Save
            </label>
  
            <div class="ring-form__control">
              <rg-save-field value="data.someText"
                on-save="invalidSave(value)">
                <input type="text"
                  class="ring-input ring-input-size_md"
                  ng-model="data.someText">
              </rg-save-field>
            </div>
          </div>
  
          <div class="ring-form__group">
            <label class="ring-form__label">
              Query Assist
            </label>
  
            <div class="ring-form__control">
              data.query={{data.query}}
              <rg-save-field value="data.query"
                on-save="save(value)">
                <rg-query-assist
                  class="ring-input-size_l"
                  x-data-source="queryAssistSource"
                  query="data.query"
                  on-apply="save"
                  on-change="updateQueryAssistValue"
                  placeholder="placeholder"
                  hint="'Press ⇥ to complete first item'"
                  hint-on-selection="'Press ↩ to complete selected item'"></rg-query-assist>
              </rg-save-field>
              <div class="ring-form__control__description">Currently there is a
                bug with "escape" shortcut
              </div>
            </div>
          </div>
        </div>
  
      </div>
    `;
  });
