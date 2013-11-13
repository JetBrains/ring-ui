define(['global/global__views', 'global/global__modules'], function (View, Module) {
  'use strict';

  var internalServices = [
    {
      label: 'TeamCity',
      url: 'http://teamcity.jetbrains.com'
    },
    {
      label: 'YouTrack',
      url: 'http://youtrack.jetbrains.com'
    },
    {
      label: 'Upsource',
      url: 'http://upsource.jetbrains.com'
    },
    {
      label: 'Confluence',
      url: 'http://confluence.jetbrains.com'
    },
    {
      label: 'JetPeople',
      url: '//jetpeople.jetbrains.com'
    },
    {
      label: 'VC',
      url: '***REMOVED***'
    },
    {
      label: 'Forums',
      url: 'http://forum.jetbrains.com'
    }
  ];

  Module.get(Module.GLOBAL).on('header:init:done', function() {
    var header = Module.get('header');
    var headerServices = header.get('view').services || [];
    var services = headerServices.concat(internalServices);

    var location = window.location.href;
    var url;
    var active;
    var currentActive;

    for (var i = services.length; i--; i > 0) {
      url = services[i].url;
      if (url && location.indexOf(url) !== -1) {
        active = services[i];
      } else if (services[i].active) {
        currentActive = services[i];
      }
    }

    if (active) {
      active.active = true;

      if (currentActive && typeof currentActive === 'object') {
        delete currentActive.active;
      }
    }

    header('update', 'services', services);
    header.trigger('services:done');
    header.trigger('services:always');
  });
});