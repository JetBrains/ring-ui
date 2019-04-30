import angular from 'angular';

import {storiesOf} from '@storybook/html';

import angularDecorator, {APP_NAME} from '../../.storybook/angular-decorator';
import ButtonNG from '../button-ng/button-ng';

import PromisedClickNG from './promised-click-ng';

storiesOf('Legacy Angular|Promised Click Ng', module).
  addParameters({hermione: {skip: true}}).
  addDecorator(angularDecorator()).
  add('basic', () => {
    angular.module(APP_NAME, [PromisedClickNG, ButtonNG]).
      controller('testController', function controller($scope, $timeout) {
        this.onClick = () => $timeout(angular.noop, 5000);
      }).
      directive('rgTestDirective', $timeout => ({
        require: 'rgPromisedClick',
        link: (scope, iElement, iAttrs, rgPromisedClick) => {
          rgPromisedClick.onClick(() => $timeout(angular.noop, 1000));
        }
      }));

    return `
      <div class="button-example" ng-controller="testController as ctrl">
        <rg-button rg-promised-click="ctrl.onClick()">Simple use</rg-button>
        <rg-button rg-promised-click="ctrl.onClick()" promised-mode="loader">Simple use loader mode</rg-button>
        <rg-button rg-promised-click rg-test-directive>Via controller</rg-button>
        <rg-button rg-promised-click="ctrl.onClick()">Ring button</rg-button>
      </div>
    `;
  });
