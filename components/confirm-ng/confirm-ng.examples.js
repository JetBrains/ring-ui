import angular from 'angular';

import {action} from '@storybook/addon-actions';

import angularDecorator, {APP_NAME} from '../../.storybook/angular-decorator';

import {hideConfirm} from '../confirm-service/confirm-service';

import ConfirmNG from './confirm-ng';

export default {
  title: 'Legacy Angular|Confirm Ng',
  decorators: [angularDecorator()],

  parameters: {
    notes: 'Displays a confirmation prompt.',
    hermione: {captureSelector: '*[data-test~=ring-dialog]'}
  }
};

export const basic = () => {
  angular.
    module(APP_NAME, [ConfirmNG]).
    controller('TestCtrl', function controller($scope, confirm) {
      confirm(
        'Do you really wish to proceed?',
        'A description of an action that is about to take place.'
      ).
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
};

basic.story = {
  name: 'basic'
};
