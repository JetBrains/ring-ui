import confirm from '../confirm-service/confirm-service';

/**
 * @name Confirm Ng
 * @category Angular Components
 * @description Displays a confirmation prompt.
 * @example
  <example name="confirm-ng">
    <file name="index.html" disable-auto-size>
      <div id="loader" ng-app="TestApp" ng-strict-di>
        <div rg-dialog></div>
        <div ng-controller="TestCtrl"></div>
      </div>
    </file>
    <file name="index.js">
      import angular from 'angular';
      import ConfirmNg from 'ring-ui/components/confirm-ng/confirm-ng';

      angular.module('TestApp', [ConfirmNg]).
        controller('TestCtrl', function (confirm) {
          confirm('Do you really wish to proceed?', 'A description of an action that is about to take place.').
            then(() => console.log('Confirmed')).
            catch(() => console.log('Declined'));
        })
    </file>
  </example>
 */
/* global angular: false */

const angularModule = angular.module('Ring.confirm', []);

angularModule.service('confirm', $q =>
  function showConfirm(message, description, actionTitle, cancelTitle, cancelIsDefault, actionFn) {
    return $q.when(confirm({
      text: message,
      description,
      confirmLabel: actionTitle,
      rejectLabel: cancelTitle,
      cancelIsDefault,
      onBeforeConfirm: actionFn
    }));
  }
);

export default angularModule.name;
