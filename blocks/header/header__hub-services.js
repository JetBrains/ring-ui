define([
  'jquery',
  'global/global__modules',
  'global/global__utils',
  'header/header',
  'auth/auth'
], function ($, Module,utils) {
  'use strict';

  var convertServices = function (services, activeServiceId) {
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
  var header = Module.get('header'),
    servicesCache;

  $.when(auth.when('init:done'), header.when('init:done'))
    .then(function () {
      header.trigger('services');
      return auth('get', 'api/rest/services?query=is:+verified&fields=id,name,homeUrl');
    })
    .then(function (services) {
      var list = services && services.services;
      var headerServices = header.get('view').services || [];

      if (list) {
        var clientServiceId = (auth.get('config') || {}).client_id;
        servicesCache = headerServices.concat(convertServices(list, clientServiceId));
        header('update', 'services', servicesCache);
        header.trigger('services:done');
      } else {
        header.trigger('services:fail');
      }
      header.trigger('services:always');
    });

  $(window).on('resize', utils.throttle(function () {
    var services = JSON.parse(JSON.stringify(servicesCache));
    header('update', 'services', services);
  }));
});