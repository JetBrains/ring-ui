/* jshint camelcase:false */
define(['jquery', 'jso', 'global/global__modules', 'global/global__views'], function ($, jso, Module, View) {
  'use strict';

  var serverUrl;
  var provider = 'hub';
  var jsoConfig = {};

  var get = function(url, callback) {
    return $.oajax({url: serverUrl + url,
      jso_provider: provider,
      //TODO: use string scopes instead of ids
      jso_scopes: jsoConfig[provider].scope,
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

  var init = function (config) {
    serverUrl = config.serverUri;

    if (!serverUrl) {
      Module.util.log('Server URI is not defined!');
    }

    jsoConfig[provider] = $.extend({
        authorization: serverUrl + '/rest/oauth2/auth'
      }, {
        client_id: config.clientId,
        redirect_uri: config.redirectUri,
        scope: config.scope
      }
    );

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
      ensure[provider] = jsoConfig[provider].scope;
      jso.ensure(ensure);
    } else {
      return token;
    }
  };

  var module = 'auth';
  Module.add(module, {
    init: init,
    ajax: get,
    getToken: getToken
  });
});