(function () {
  'use strict';

  angular.module('Ring.confirm', []).
    service('confirm', [
      'dialog',
      '$q',
      function (dialog, $q) {
        this.show = function (message, description, actionTitle) {
          var defer = $q.defer();

          if (!message) {
            message = 'Confirm action?';
          }
          if (!actionTitle) {
            actionTitle = 'Confirm';
          }

          dialog.show({
            content: 'confirm/confirm.tpl.html',
            data: {
              message: message,
              description: description
            },
            buttons: [
              {
                'label': actionTitle,
                'default': true,
                'close': false,
                'action': function () {
                  defer.resolve(true);
                  dialog.hide();
                  return true;
                }
              },
              {
                'label': 'Cancel',
                'action': function () {
                  defer.resolve(false);
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