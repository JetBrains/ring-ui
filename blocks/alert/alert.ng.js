(function () {
  'use strict';

  angular.module('Ring.alert', []).
  /**
   * Service to add alerts to the stack of alert messages.
   *
   * Usage:
   * alert.message("Hello"); - shows message "Hello"
   * alert.warning("Beware", 5000); - shows warning "Beware" for 5 seconds.
   * alert.error("Fail :("); - shows error message
   * alert.success("Successfully processed everything", 10000); shows success message for 10 seconds
   */
    service('alert', [function () {
      var service = {};

      $.each(ring('alerts', 'getAlertTypes')(), function (name, type) {
        service[type] = function (message, opt_timeout) {
          // Escape message
          var tagsToReplace = {'&': '&amp;', '<': '&lt;', '>': '&gt;'};
          message = message.replace(/[&<>]/g, function (tag) {
              return tagsToReplace[tag] || tag;
            }
          );

          return ring('alerts', 'add')(message, type, true, opt_timeout || 5000);
        };
      });

      return service;
    }]);
})();