import angular from 'angular';

import angularDecorator, {APP_NAME} from '../../.storybook/angular-decorator';

import CompilerNG from './compiler-ng';

export default {
  title: 'Legacy Angular|Compiler Ng',
  decorators: [angularDecorator()],

  parameters: {
    hermione: {skip: true}
  }
};

export const basic = () => {
  angular.module(APP_NAME, [CompilerNG]).run(function controller($rootScope, rgCompiler) {
    const $scope = $rootScope.$new();
    $scope.testValue = 'Hello from compiled node';

    rgCompiler({template: '<div>{{testValue}}</div>'}).then(data => {
      data.link($scope);
      setTimeout(() => {
        document.getElementById('for-compiled').appendChild(data.element[0]);
      });
    });
  });

  return '<div id="for-compiled"></div>';
};

basic.story = {
  name: 'basic'
};
