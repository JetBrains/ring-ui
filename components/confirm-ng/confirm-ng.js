/* global angular: false */

require('dialog-ng/dialog-ng');

angular.module('Ring.confirm', ['Ring.dialog']).
  service('confirm', [
    'dialog',
    '$q',
    '$templateCache',
    function (dialog, $q, $templateCache) {
      var TEMPLATE_PATH = 'confirm-ng/confirm-ng.html';
      // We need this because dialog uses ngInclude
      $templateCache.put(TEMPLATE_PATH, require('./confirm-ng.html'));

      return function (message, description, actionTitle, cancelTitle, cancelIsDefault) {
        var defer = $q.defer();

        dialog.show({
          content: TEMPLATE_PATH,
          data: {
            message: (message || ''),
            description: description
          },
          buttons: [
            {
              'label': (actionTitle || 'Ok'),
              'default': !cancelIsDefault,
              'close': false,
              'action': function () {
                defer.resolve();
                dialog.hide();
                return true;
              }
            },
            {
              'label': (cancelTitle || 'Cancel'),
              'default': !!cancelIsDefault,
              'action': function () {
                defer.reject();
                dialog.hide();
                return false;
              }
            }
          ]
        });

        return defer.promise;
      };
    }
  ]);
