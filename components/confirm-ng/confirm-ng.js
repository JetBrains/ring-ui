import Dialog from '../dialog-ng/dialog-ng';

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

const angularModule = angular.module('Ring.confirm', [Dialog]);

angularModule.service('confirm', dialog => (message, description, actionTitle, cancelTitle, cancelIsDefault, actionFn) => dialog.show({
  template: require('./confirm-ng.html'),
  data: {
    message: (message || ''),
    description
  },
  buttons: [
    {
      label: (actionTitle || 'OK'),
      default: !cancelIsDefault,
      close: true,
      action: () => (actionFn ? actionFn() : true)
    },
    {
      label: (cancelTitle || 'Cancel'),
      default: !!cancelIsDefault,
      action: () => {
        dialog.reset();
        return false;
      }
    }
  ]
}));

export default angularModule.name;
