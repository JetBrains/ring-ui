import angular from 'angular';

import {storiesOf} from '@storybook/html';

import angularDecorator, {APP_NAME} from '../../.storybook/angular-decorator';

import TemplateNG from './template-ng';

storiesOf('Legacy Angular|Template Ng', module).
  addParameters({hermione: {skip: true}}).
  addDecorator(angularDecorator()).
  add('basic', () => {
    angular.module(APP_NAME, [TemplateNG]);

    return '<rg-template template="\'<input/>\'"></rg-template>';
  }).
  add('with controller', () => {
    angular.module(APP_NAME, [TemplateNG]).
      controller('ExampleCtrl', function ctrl() {
        this.template = '<button>button</button>';
      });

    return '<rg-template template="ctrl.template" ng-controller="ExampleCtrl as ctrl"></rg-template>';
  });
