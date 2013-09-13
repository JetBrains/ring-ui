/* jshint camelcase:false */
define(['jquery', 'global/global__modules', 'global/global__views', 'header/header', 'auth/auth'], function ($, Module, View) {
  'use strict';

  var auth = Module.get('auth');
  var header = Module.get('header');

  var authInited = $.Deferred();
  var headerInited = $.Deferred();

  auth.on('init:done', authInited.resolve.bind(authInited));
  header.on('init:done', headerInited.resolve.bind(headerInited));

  $.when(headerInited, authInited)
    .then(function() {
      return auth('ajax', '/rest/users/me');
    })
    .then(function(me) {
      if (me && me.name) {
        View.update('header', 'user.name', me.name);
      }
    });
});