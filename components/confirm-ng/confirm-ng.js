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
          confirm('Do you really want to proceed?').
            then(() => console.log('Confirmed')).
            catch(() => console.log('Declined'));
        })
    </file>
  </example>
 */
/* global angular: false */

const angularModule = angular.module('Ring.confirm', [Dialog]);

angularModule.service('confirm', (dialog, $templateCache) => {
  const TEMPLATE_PATH = 'ring-ui/components/confirm-ng/confirm-ng.html';

  // We need this because dialog uses ngInclude
  $templateCache.put(TEMPLATE_PATH, require('./confirm-ng.html'));

  return (message, description, actionTitle, cancelTitle, cancelIsDefault) => dialog.show({
    content: TEMPLATE_PATH,
    data: {
      message: (message || ''),
      description
    },
    buttons: [
      {
        label: (actionTitle || 'OK'),
        default: !cancelIsDefault,
        close: false,
        action: () => {
          dialog.done();
          return true;
        }
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
  });
});

export default angularModule.name;
