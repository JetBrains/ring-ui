define(['jquery',  'global/global__modules', 'global/global__views', 'auth/auth'], function($, Module, View) {
  'use strict';

  var module = 'profile';
  var auth = Module.get('auth');

  var profileUrls = {
    Hub: '/users/%u',
    JetPass: '/users/%u', // should be deprecated, remove after rename
    YouTrack: '/user/%u',
    TeamCity: '/profile.html?init=1'
  };

  var servicesOrder = {};
  var initialOrder = 0;
  $.each(profileUrls, function(key) {
    servicesOrder[key] = initialOrder++;
  });

  Module.add(module, {
    init: function(config) {
      config = config || {};
      var authConfig = auth.get('config');
      var authInit = (authConfig === $.noop) ? auth.when('init:done') : $.Deferred().resolve(authConfig);

      var services = authInit.then(function() {
        var apps = $.map(profileUrls, function (value, key) {
          return 'applicationName:+{' + key + '}';
        }).join('+or+');

        return auth('get', 'api/rest/services?query=is:+verified+and+(' + apps + ')');
      });

      var user = authInit.then(function(config) {
        return auth('get', config.apiProfilePath);
      });

      $.when(services, user).then(function(services, user) {
        user = user && user[0] || {};

        var items = services && services[0] && services[0].services || [];
        var userName = user.name || '';
        var avatar = user.avatar && user.avatar.pictureUrl;

        if (items) {
          items.sort(function(a, b) {
            return servicesOrder[a.applicationName] - servicesOrder[b.applicationName];
          });

          items = $.map(items, function(item) {
            var profileUrl = item.profileUrl || profileUrls[item.applicationName];
            var isHub = item.applicationName === 'JetPass' || item.applicationName === 'Hub';

            return !profileUrl ? null : {
              url: item.homeUrl + profileUrl.replace('%u', userName),
              label: isHub ? 'Profile' : item.name,
              image: (isHub ? avatar :  item.iconUrl) || null,
              active: auth.get('config').client_id === item.id
            };
          });
        }

        if (items.length <= 1) {
          return;
        }

        config.items = items;

        View.init(module, config.targetElem || null, config.method || null, {}, config);
      });
    }
  });

});