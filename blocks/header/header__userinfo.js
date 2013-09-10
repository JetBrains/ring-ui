/* jshint camelcase:false */
define(['jquery', 'global/global__modules', 'global/global__views', 'header/header', 'auth/auth'], function ($, Module, View) {
  'use strict';

  var auth = Module.get('auth');

  auth.on('init:done', function() {
    auth('ajax', '/rest/users/me')
      .done(function(me) {
        if (me && me.name) {
          View.update('header', 'user.name', me.name);
        }
      });
  });
});