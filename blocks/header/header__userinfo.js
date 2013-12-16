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
        var authConfig = auth.get('config');
        var headerConfig = header.get('view');

        var authLinks = {
          profile: {
            label: 'Profile',
            url: authConfig.serverUrl + '/jpapUser'
          },
          logout: {
            label: 'Log out',
            url: authConfig.serverUrl + '/rest/cas/logout?gateway=true&url=' + encodeURIComponent(authConfig.redirect_uri),
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