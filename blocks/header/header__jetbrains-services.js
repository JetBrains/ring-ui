define(['global/global__views', 'global/global__modules', 'counter/counter'], function (View, Module, counter) {
  'use strict';

  var internalServices = [
    {
      label: 'TeamCity',
      url: 'http://teamcity.jetbrains.com'
    },
    {
      label: 'YouTrack',
      url: 'https://youtrack.jetbrains.com'
    },
    {
      label: 'Upsource',
      url: 'https://upsource.jetbrains.com'
    },
    {
      label: 'Confluence',
      url: 'https://confluence.jetbrains.com'
    },
    {
      label: 'JetPeople',
      url: 'https://jetpeople.jetbrains.com'
    },
    {
      label: 'Meeting Rooms',
      url: '***REMOVED***'
    },
    {
      label: 'Dashboard',
      url: 'https://hub.jetbrains.com/dashboard'
    },
    {
      label: 'Forums',
      url: 'http://forum.jetbrains.com'
    }
  ];

  Module.get(Module.GLOBAL).one('header:init:done', function () {
    var header = Module.get('header');
    var services = header.get('view').services || internalServices;

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

      services[i].event = {
        name: 'header:service-click',
        data: services[i].label
      };
    }

    if (active) {
      active.active = true;

      if (currentActive && typeof currentActive === 'object') {
        delete currentActive.active;
      }
    }

    header.on('service-click', function(data, e) {
      e.preventDefault();

      counter.event({
        'eventCategory': 'header service',
        'eventAction': 'click',
        'eventLabel': data,
        'hitCallback': function() {
          var URL = e.target.href;

          if (URL) {
            window.location = URL;
          }
        }
      });
    });

    header('update', 'services', services);
    header.trigger('services:done');
    header.trigger('services:always');
  });
});