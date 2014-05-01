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
      var REPLACE_TABLE = {'&': '&amp;', '<': '&lt;', '>': '&gt;'};

      $.each(ring('alerts', 'getAlertTypes')(), function (name, type) {
        service[type] = function (message, opt_timeout, opt_unsafe) {

          // Escape message
          if (opt_unsafe !== true) {
            //TODO: Why don't we use angular $sanitize here?
            message = message.replace(/[&<>]/g, function (tag) {
                return REPLACE_TABLE[tag] || tag;
              }
            );
          }

          return ring('alerts', 'add')(message, type, true, opt_timeout);
        };
      });

      return service;
    }]);
})();