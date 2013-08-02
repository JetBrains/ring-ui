/* jshint camelcase:false */
define(['jquery', 'jso', 'global/global__modules', 'global/global__views'], function ($, jso, Module, View) {
  'use strict';

  var config;
  var serverUrl;
  var provider = 'hub';
  var jsoConfig = {};

  var get = function(url, callback) {
    return $.oajax({url: serverUrl + url,
      jso_provider: provider,
      //TODO: use string scopes instead of ids
      jso_scopes: config.scope,
      jso_allowia: true,
      dataType: 'json',
      success: callback
    });
  };

  var convertServices = function(services) {
    var items = [];

    for (var i = 0; i < services.length; ++i) {
      var service = services[i];
      items.push({
        label: service.name,
        url: service.homeUrl
      });
    }

    return items;
  };

  var init = function (initialConfig) {
    serverUrl = initialConfig.serverUri;

    if (!serverUrl) {
      Module.util.log('Server URI is not defined!');
    }

    config = $.extend({
        client_id: 'dafb2157-a3ac-4f8c-92fa-450c3c903189',
        redirect_uri: window.location.href,
        authorization: serverUrl + '/rest/oauth2/auth',
        scope: ['dafb2157-a3ac-4f8c-92fa-450c3c903189']
      }, {
        client_id: initialConfig.clientId,
        redirect_uri: initialConfig.redirectUri,
        scope: initialConfig.scope
      }
    );

    jsoConfig[provider] = config;
    jso.configure(jsoConfig);

    var header = Module.get('header');
    //var headerServices = header.get('view').services || [];

    $.when(
      get('/rest/services'),
      get('/rest/users/me'),
      header.on('init')
    ).then(function(services, me) {
      //var servicesUpdate = headerServices.concat(convertServices(services[0].services));

      View.update('header', '.', {
        services: convertServices(services[0].services),
        user: me[0]
      });
    });
  };

  var getToken = function() {
    var token = jso.getToken(provider);

    if (token === null) {
      var ensure = {};
      ensure[provider] = config.scope;
      jso.ensure(ensure);
    } else {
      return token;
    }
  };

  var module = 'auth';
  Module.add(module, {
    init: init,
    ajax: get,
    getToken: {
      method: getToken,
      override: true
    }
  });
});