import angular from 'angular';

import {storiesOf} from '@storybook/html';

import angularDecorator, {APP_NAME} from '../../.storybook/angular-decorator';
import CompilerNG from '../compiler-ng/compiler-ng';

storiesOf('Legacy Angular|Compiler Ng', module).
  addDecorator(angularDecorator()).
  add('basic', () => {
    angular.module(APP_NAME, [CompilerNG]).
      run(function controller($rootScope, rgCompiler) {
        const $scope = $rootScope.$new();
        $scope.testValue = 'Hello from compiled node';

        rgCompiler({template: '<div>{{testValue}}</div>'}).
          then(data => {
            data.link($scope);
            setTimeout(() => {
              document.getElementById('for-compiled').appendChild(data.element[0]);
            });
          });
      });

    return '<div id="for-compiled"></div>';
  });
