/* jshint camelcase:false */
define(['jquery', 'global/global__modules', 'global/global__views', 'header/header', 'auth/auth'], function ($, Module, View) {
  'use strict';

  var auth = Module.get('auth');
  var header = Module.get('header');

  var authInited = $.Deferred();
  var headerInited = $.Deferred();

  auth.on('init:done', authInited.resolve.bind(authInited));
  header.on('init:done', headerInited.resolve.bind(headerInited));

  header.on('logout', auth.trigger.bind(auth, 'logout'));

  $.when(headerInited, authInited)
    .then(function() {
      return auth('ajax', '/rest/users/me');
    })
    .then(function(me) {
      if (me && me.name) {
        var config = auth.get('config');

        var data = {
          authLinks: {
            profile: {
              label: 'Profile',
              url: config.serverUrl + '/jpapUser'
            },
            logout: {
              label: 'Log out',
              url: config.serverUrl + '/rest/oauth2/logout?request_credentials=skip&redirect_uri=' + encodeURIComponent(config.redirect_uri),
              event: 'header:logout'
            }
          },
          user: {
            name: me.name
          }
        };

        View.update('header', '.', data);
      }
    });
});