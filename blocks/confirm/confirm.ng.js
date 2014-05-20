(function () {
  'use strict';

  angular.module('Ring.confirm', []).
    service('confirm', [
      'dialog',
      '$q',
      function (dialog, $q) {
        return function (message, description, actionTitle, cancelTitle) {
          var defer = $q.defer();

          dialog.show({
            content: 'confirm/confirm.ng.html',
            data: {
              message: (message || ''),
              description: description
            },
            buttons: [
              {
                'label': (actionTitle || 'Ok'),
                'default': true,
                'close': false,
                'action': function () {
                  defer.resolve();
                  dialog.hide();
                  return true;
                }
              },
              {
                'label': (cancelTitle || 'Cancel'),
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
})();