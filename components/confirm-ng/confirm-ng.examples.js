import angular from 'angular';

import {action} from '@storybook/addon-actions';
import {storiesOf} from '@storybook/html';

import angularDecorator, {APP_NAME} from '../../.storybook/angular-decorator';
import ConfirmNG from '../confirm-ng/confirm-ng';
import {hideConfirm} from '../confirm-service/confirm-service';

storiesOf('Legacy Angular|Confirm Ng', module).
  addParameters({hermione: {captureSelector: '*[data-test~=ring-dialog]'}}).
  addDecorator(angularDecorator()).
  add('basic', () => {
    angular.module(APP_NAME, [ConfirmNG]).
      controller('TestCtrl', function controller($scope, confirm) {
        confirm('Do you really wish to proceed?', 'A description of an action that is about to take place.').
          then(action('confirmed')).
          catch(action('declined'));

        $scope.$on('$destroy', hideConfirm);
      });

    return `
      <div>
        <div rg-dialog></div>
        <div ng-controller="TestCtrl"></div>
      </div>
    `;
  });
