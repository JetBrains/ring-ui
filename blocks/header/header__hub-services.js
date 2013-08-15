/* jshint camelcase:false */
define(['jquery', 'global/global__modules', 'global/global__views', 'header/header', 'auth/auth'], function ($, Module, View) {
  'use strict';

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
    var getServices = $.Deferred();
    var getMe = $.Deferred();

    auth('ajax', '/rest/services')
      .done(function(services) {
        var list = services && services.services;

        if (list) {
          getServices.resolve({services: convertServices(list)});
        } else {
          getServices.resolve({});
        }
      })
      .fail(function() {
        getServices.resolve({});
      });

    auth('ajax', '/rest/users/me')
      .done(function(me) {
        var user = header.get('view');

        if (user && me && me[0]) {
          getMe.resolve({user: me[0]});
        } else {
          getMe.resolve({});
        }
      })
      .fail(function() {
        getMe.resolve({});
      });

    return $.when(getServices, getMe);
  };

  var dfd = $.Deferred();

  auth.on('init', function() {
    update().then(function(services, me) {
      View.update('header', '.', $.extend({}, services, me));
      dfd.resolve();
    });
  });

  return dfd;
});