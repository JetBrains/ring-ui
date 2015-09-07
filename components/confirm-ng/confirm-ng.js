/* global angular: false */

import 'dialog-ng/dialog-ng';

let ringDialog = angular.module('Ring.confirm', ['Ring.dialog']);

ringDialog.service('confirm', function (dialog, $q, $templateCache) {
  const TEMPLATE_PATH = 'confirm-ng/confirm-ng.html';

  // We need this because dialog uses ngInclude
  $templateCache.put(TEMPLATE_PATH, require('./confirm-ng.html'));

  return function (message, description, actionTitle, cancelTitle, cancelIsDefault) {
    return dialog.show({
      content: TEMPLATE_PATH,
      data: {
        message: (message || ''),
        description: description
      },
      buttons: [
        {
          label: (actionTitle || 'Ok'),
          'default': !cancelIsDefault,
          close: false,
          action: () => {
            dialog.done();
            return true;
          }
        },
        {
          label: (cancelTitle || 'Cancel'),
          'default': !!cancelIsDefault,
          action: () => {
            dialog.reset();
            return false;
          }
        }
      ]
    });
  };
});
