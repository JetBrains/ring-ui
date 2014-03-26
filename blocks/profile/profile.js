define(['jquery',  'global/global__modules', 'global/global__views', 'auth/auth'], function($, Module, View) {
  'use strict';

  var module = 'profile';
  var auth = Module.get('auth');

  var HUB_TITLE = 'General';

  Module.add(module, {
    init: function(config) {
      config = config || {};
      var userId = config.userId || 'me';
      var authConfig = auth.get('config');
      var authInit = (authConfig === $.noop) ? auth.when('init:done') : $.Deferred().resolve(authConfig);

      var services = authInit.then(function() {
        return auth('get', 'api/rest/services?query=is:+verified+and+has:+userUriPattern&orderBy=name');
      });

      var user = authInit.then(function(config) {
        return auth('get', config.apiPath + '/users/' + userId);
      });

      $.when(services, user).then(function(services, user) {
        user = user && user[0] || {};

        var items = services && services[0] && services[0].services || [];
        var userLogin = user.login || '';
        var avatar = user.avatar && user.avatar.pictureUrl;

        if (items) {
          items = $.map(items, function(item) {
            var isHub = item.applicationName === 'JetPass' || item.applicationName === 'Hub';

            var profileURI = item.userUriPattern || null;

            // If the profile URI is not absolute prepend it with the service home URL
            if (profileURI && profileURI.indexOf('http') !== 0) {
              profileURI = item.homeUrl.replace(/\/$/, '') + '/' + profileURI.replace(new RegExp('^\\/'), '');
            }

            // Interpolate placeholders
            profileURI.replace(/\:id|\:login/, function (pattern) {
              if (pattern === ':id') {
                return userId;
              } else if (pattern === ':login') {
                return userLogin;
              } else {
                return '';
              }
            });

            return {
              url: profileURI,
              label: isHub ? HUB_TITLE : item.name,
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