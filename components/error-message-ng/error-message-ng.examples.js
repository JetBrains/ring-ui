import angular from 'angular';

import frownIcon from '@jetbrains/icons/frown.svg';

import angularDecorator, {APP_NAME} from '../../.storybook/angular-decorator';

import ErrorMessageNG from '@jetbrains/ring-ui/components/error-message-ng/error-message-ng';

export default {
  title: 'Legacy Angular/Error Message Ng',
  decorators: [angularDecorator()],

  parameters: {
    notes: 'Displays an error message.',
    hermione: {skip: true}
  }
};

export const basic = () => {
  angular.module(APP_NAME, [ErrorMessageNG]).controller('DemoCtrl', function ctrl() {
    this.errorIcon = frownIcon;
  });

  return `
      <div ng-controller="DemoCtrl as ctrl" style="height: 300px">
        <rg-error-message code="Disconnected" message="no answer from server." icon="{{ctrl.errorIcon}}" links="[{href:'.',text:'Go to the home page'}]">
          Please try again soon.
        </rg-error-message>
      </div>
    `;
};

basic.story = {
  name: 'basic'
};
