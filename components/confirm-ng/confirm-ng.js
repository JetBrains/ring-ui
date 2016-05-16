/* global angular: false */

import Dialog from '../dialog-ng/dialog-ng';

const module = angular.module('Ring.confirm', [Dialog]);

module.service('confirm', (dialog, $templateCache) => {
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
        label: (actionTitle || 'Ok'),
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

export default module.name;
