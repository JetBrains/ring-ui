/* jshint camelcase:false */
define(['jquery', 'global/global__modules', 'global/global__views', 'header/header', 'auth/auth'], function ($, Module, View) {
  'use strict';

  var dfd = $.Deferred();

  var convertServices = function(services) {
    var items = [];

    for (var i = 0; i < services.length; ++i) {
      var service = services[i];
      items.push({
        label: service.name,
        url: service.homeUrl
      });
    }

    return items;
  };

  var header = Module.get('header');
  var auth = Module.get('auth');

  var update = function() {
    $.when(auth('ajax', '/rest/services'), auth('ajax','/rest/users/me'))
    .then(function(services, me) {
      var update;

      if (services && services[0] && services[0].services) {
        update = {};
        update['services'] = convertServices(services[0].services);
      }

      var user = header.get('view');
      if (user && me && me[0]) {
        update = update || {};
        update['user'] = me[0];
      }

      if (update) {
        View.update('header', '.', update);
      }

      dfd.resolve();
    });
  };

  auth.on('init', update);

  return dfd;
});