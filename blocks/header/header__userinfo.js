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

  var authConfig;
  var headerConfig;

  $.when(headerInited, authInited)
    .then(function() {
      authConfig = auth.get('config');
      headerConfig = header.get('view');

      return auth('get', authConfig.apiProfilePath);
    })
    .then(function(me) {
      if (me && me.name) {
        var authLinks = {
          profile: {
            label: 'Profile',
            url: authConfig.profilePath
          },
          logout: {
            label: 'Log out',
            url: authConfig.logoutPath,
            event: 'header:logout'
          }
        };

        if (headerConfig && headerConfig.authLinks) {
          $.extend(true, authLinks, headerConfig.authLinks);
        }

        var data = {
          authLinks: authLinks,
          user: {
            name: me.name
          }
        };

        View.update('header', '.', data);
      }
    });
});