define(['global/global__views', 'global/global__modules'], function (View, Module) {
  'use strict';

  var internalServices = [
    {
      label: 'TeamCity',
      url: 'http://teamcity.jetbrains.com'
    },
    {
      label: 'YouTrack',
      url: '//youtrack.jetbrains.com'
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
      label: 'TeamFeed',
      url: '//jetbrains-feed.appspot.com'
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
    var headerServices = Module.get('header').get('view').services || [];
    var services = headerServices.concat(internalServices);

    var location = window.location.href;
    var url;

    for (var i = services.length; i--; i > 0) {
      url = services[i].url;
      if (url && location.indexOf(url) !== -1) {
        services[i].active = true;
      } else {
        delete services[i].active;
      }
    }

    View.update('header', 'services', services);
  });
});