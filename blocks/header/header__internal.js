define(['full-header/full-header'], function (header) {
  'use strict';

  var internalServices = [
    {
      'title': 'TeamCity',
      'url': 'http://teamcity.jetbrains.com'
    },
    {
      'title': 'YouTrack',
      'url': '//youtrack.jetbrains.com'
    },
    {
      'title': 'Upsource',
      'url': 'http://upsource.jetbrains.com'
    },
    {
      'title': 'Confluence',
      'url': 'http://confluence.jetbrains.com'
    },
    {
      'title': 'JetPeople',
      'url': '//jetpeople.jetbrains.com'
    },
    {
      'title': 'TeamFeed',
      'url': '//jetbrains-feed.appspot.com'
    },
    {
      'title': 'VC',
      'url': '***REMOVED***'
    },
    {
      'title': 'Forums',
      'url': 'http://forum.jetbrains.com'
    }
  ];

  var location = window.location.href;

  for (var i = internalServices.length; i--; i > 0) {
    if (location.indexOf(internalServices[i].url) !== -1) {
      delete internalServices[i].url;
      break;
    }
  }

  var process = function(data) {
    data.stripe = data.stripe || {};
    data.stripe.items = internalServices;

    return data;
  };

  header.addProcessor(process);
});