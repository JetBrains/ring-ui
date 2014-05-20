(function () {
  'use strict';

  angular.module('Ring.confirm', []).
    service('confirm', [
      'dialog',
      '$q',
      function (dialog, $q) {
        this.show = function (message, description, actionTitle, cancelTitle) {
          var defer = $q.defer();

          if (!message || !actionTitle || !cancelTitle) {
            defer.reject();
          } else {
            dialog.show({
              content: 'confirm/confirm.ng.html',
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
                  'label': cancelTitle,
                  'action': function () {
                    defer.resolve(false);
                    dialog.hide();
                    return false;
                  }
                }
              ]
            });
          }

          return defer.promise;
        };

      }
    ]);
})();