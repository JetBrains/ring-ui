define(['jquery', 'global/global__modules', 'header/header', 'auth/auth'], function ($, Module) {
  'use strict';

  var convertServices = function(services, activeServiceId) {
    var items = [];

    for (var i = 0; i < services.length; ++i) {
      var service = services[i];
      items.push({
        active: service.id === activeServiceId,
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
      header.trigger('services');
      return auth('get', 'api/rest/services?query=is:+verified');
    })
    .then(function(services) {
      var list = services && services.services;
      var headerServices = header.get('view').services || [];

      if (list) {
        var clientServiceId = (auth.get('config') || {}).client_id;
        header('update', 'services', headerServices.concat(convertServices(list, clientServiceId)));
        header.trigger('services:done');
      } else {
        header.trigger('services:fail');
      }
      header.trigger('services:always');
    });
});