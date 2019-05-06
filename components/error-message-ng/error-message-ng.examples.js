import angular from 'angular';

import {storiesOf} from '@storybook/html';

import angularDecorator, {APP_NAME} from '../../.storybook/angular-decorator';

import {FrownIcon} from '../icon';

import ErrorMessageNG from './error-message-ng';

storiesOf('Legacy Angular|Error Message Ng', module).
  addParameters({
    notes: 'Displays an error message.',
    hermione: {skip: true}
  }).
  addDecorator(angularDecorator()).
  add('basic', () => {
    angular.module(APP_NAME, [ErrorMessageNG]).
      controller('DemoCtrl', function ctrl() {
        this.errorIcon = FrownIcon;
      });

    return `
      <div ng-controller="DemoCtrl as ctrl">
        <rg-error-message code="Disconnected" message="No, no one\\'s there." icon="{{ctrl.errorIcon}}" links="[{href:'.',text:'home'}]">
          Service backend isn't available
        </rg-error-message>
      </div>
    `;
  });
