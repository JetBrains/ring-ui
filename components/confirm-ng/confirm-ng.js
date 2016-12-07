import confirm from '../confirm-service/confirm-service';

/**
 * @name Confirm Ng
 * @category Angular Components
 * @description Displays a confirmation prompt.
 * @example
  <example name="confirm-ng">
    <file name="index.html">
      <div id="loader" ng-app="TestApp">
        <div rg-dialog></div>
        <div ng-controller="TestCtrl"></div>
      </div>
    </file>
    <file name="index.js">
      import angular from 'angular';
      import ConfirmNg from 'ring-ui/components/confirm-ng/confirm-ng';

      angular.module('TestApp', [ConfirmNg]).
        controller('TestCtrl', function (confirm) {
          confirm('Do you really want to proceed?', 'Confirm description').
            then(() => console.log('Confirmed')).
            catch(() => console.log('Declined'));
        })
    </file>
  </example>
 */
/* global angular: false */

const angularModule = angular.module('Ring.confirm', []);

/* eslint-disable arrow-body-style */
angularModule.service('confirm', $q => {
  return function showConfirm(message, description, actionTitle, cancelTitle, cancelIsDefault, actionFn) {
    return $q.when(confirm(message, description, actionTitle, cancelTitle)).
      then(() => actionFn && actionFn());
  };
});

export default angularModule.name;
