import angular from 'angular';

import confirm from '../confirm-service/confirm-service';
import MessageBundle from '../message-bundle-ng/message-bundle-ng';

/**
 * @name Confirm Ng
 * @category Legacy Angular
 * @tags Ring UI Language
 * @description Displays a confirmation prompt.
 * @example
  <example name="Confirm Ng">
    <file name="index.html" disable-auto-size>
      <div id="loader" ng-app="TestApp" ng-strict-di>
        <div rg-dialog></div>
        <div ng-controller="TestCtrl"></div>
      </div>
    </file>
    <file name="index.js">
      import angular from 'angular';
      import ConfirmNg from '@jetbrains/ring-ui/components/confirm-ng/confirm-ng';

      angular.module('TestApp', [ConfirmNg]).
        controller('TestCtrl', function (confirm) {
          confirm('Do you really wish to proceed?', 'A description of an action that is about to take place.').
            then(() => console.log('Confirmed')).
            catch(() => console.log('Declined'));
        })
    </file>
  </example>
 */

const angularModule = angular.module('Ring.confirm', [
  MessageBundle
]);

angularModule.service('confirm', function service($q, RingMessageBundle) {
  return function showConfirm(
    message, description, actionTitle, cancelTitle,
    cancelIsDefault, actionFn
  ) {
    return $q.when(confirm({
      text: message,
      description,
      confirmLabel: actionTitle || RingMessageBundle.confirmation_ok(),
      rejectLabel: cancelTitle || RingMessageBundle.confirmation_cancel(),
      cancelIsDefault,
      onBeforeConfirm: actionFn
    }));
  };
});

export default angularModule.name;
