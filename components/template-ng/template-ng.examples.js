import angular from 'angular';

import angularDecorator, {APP_NAME} from '../../.storybook/angular-decorator';

import TemplateNG from './template-ng';

export default {
  title: 'Legacy Angular|Template Ng',
  decorators: [angularDecorator()],

  parameters: {
    hermione: {skip: true}
  }
};

export const basic = () => {
  angular.module(APP_NAME, [TemplateNG]);

  return '<rg-template template="\'<input/>\'"></rg-template>';
};

basic.story = {
  name: 'basic'
};

export const withController = () => {
  angular.module(APP_NAME, [TemplateNG]).controller('ExampleCtrl', function ctrl() {
    this.template = '<button>button</button>';
  });

  return '<rg-template template="ctrl.template" ng-controller="ExampleCtrl as ctrl"></rg-template>';
};

withController.story = {
  name: 'with controller'
};
