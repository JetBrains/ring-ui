import angular from 'angular';

import angularDecorator, {APP_NAME} from '../../.storybook/angular-decorator';

import ButtonNG from '@jetbrains/ring-ui/components/button-ng/button-ng';

import PromisedClickNG from '@jetbrains/ring-ui/components/promised-click-ng/promised-click-ng';

export default {
  title: 'Legacy Angular/Promised Click Ng',
  decorators: [angularDecorator()],

  parameters: {
    notes: 'Controls the active state of a button.',
    hermione: {skip: true}
  }
};

export const basic = () => {
  angular.
    module(APP_NAME, [PromisedClickNG, ButtonNG]).
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
};

basic.story = {
  name: 'basic'
};
