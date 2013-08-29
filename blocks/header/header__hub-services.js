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

  var auth = Module.get('auth');
  var dfd;

  var update = function() {
    var getServices = $.Deferred();
    var getMe = $.Deferred();

    dfd = $.when(
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
        })
    ,
      auth('ajax', '/rest/users/me')
        .done(function(me) {
          if (me && me.name) {
            getMe.resolve({user: {name: me.name}});
          } else {
            getMe.resolve({});
          }
        })
        .fail(function() {
          getMe.resolve({});
        })
    ).promise();


    return $.when(getServices, getMe);
  };

  auth.on('init:done', function() {
    update().then(function(services, me) {
      View.update('header', '.', $.extend({}, services, me));
    });
  });

  Module.add('auth', {
    hubData: function() {
      return dfd;
    }
  });

  return dfd;
});