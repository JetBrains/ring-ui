import angular from 'angular';

import {action} from '@storybook/addon-actions';
import {storiesOf} from '@storybook/html';

import angularDecorator, {APP_NAME} from '../../.storybook/angular-decorator';
import ConfirmNG from '../confirm-ng/confirm-ng';

storiesOf('Legacy Angular|Confirm Ng', module).
  addDecorator(angularDecorator()).
  add('basic', () => {
    angular.module(APP_NAME, [ConfirmNG]).
      controller('TestCtrl', function controller(confirm) {
        confirm('Do you really wish to proceed?', 'A description of an action that is about to take place.').
          then(action('confirmed')).
          catch(action('declined'));
      });

    return `
      <div>
        <div rg-dialog></div>
        <div ng-controller="TestCtrl"></div>
      </div>
    `;
  });
