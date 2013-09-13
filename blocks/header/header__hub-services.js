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
  var header = Module.get('header');

  var authInited = $.Deferred();
  var headerInited = $.Deferred();

  auth.on('init:done', authInited.resolve.bind(authInited));
  header.on('init:done', headerInited.resolve.bind(headerInited));

  $.when(headerInited, authInited)
    .then(function() {
      return auth('ajax', '/rest/services');
    })
    .then(function(services) {
      var list = services && services.services;
      var headerServices = header.get('view').services || [];

      if (list) {
        View.update('header', 'services', headerServices.concat(convertServices(list)));
      }
    });
});