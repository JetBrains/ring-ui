/* jshint camelcase:false */
define(['jquery', 'jso', 'global/global__modules', 'global/global__utils'], function ($, jso, Module, utils) {
  'use strict';

  var defaultRedirectUri = window.location.protocol + '//' + window.location.host;
  var defaultId = '0-0-0-0-0';
  var defaultPath = '/rest/oauth2/auth';

  var serverUrl;
  var provider = 'hub';
  var jsoConfig = {};
  var defaultConfig = {
    scope: [defaultId],
    redirect_uri: defaultRedirectUri,
    client_id: defaultId
  };

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

  var getToken = function(denyIA) {
    var token = jso.getToken(provider);

    if (token === null) {
      var ensure = {};
      ensure[provider] = jsoConfig[provider].scope;

      if (!denyIA) {
        jso.ensure(ensure);
      }
      return false;
    } else {
      return token;
    }
  };

  var init = function (config) {
    var dfd = $.Deferred();
    serverUrl = typeof config === 'string' ? config : config.serverUri;

    if (!serverUrl) {
      utils.log('Server URI is not defined!');
    } else {
      serverUrl = serverUrl.replace(/\/+$/, '');
    }

    jsoConfig[provider] = {authorization: serverUrl + defaultPath};

    var cfg = $.extend(jsoConfig[provider], defaultConfig);

    if (config.clientId) {
      cfg.client_id = config.clientId;
    }

    if (config.redirect_uri) {
      cfg.redirect_uri = config.redirectUri;
    }

    if (config.scope) {
      cfg.scope = config.scope;
    }

    // Configure jso
    jso.configure(jsoConfig, null, function(done, err) {
      if (err) {
        dfd.reject(err);

      // Authorize, if needed or resolve dfd
      } else if(getToken(config.denyIA)) {
        dfd.resolve(done);
      }
    });

    return dfd;
  };

  Module.add('auth', {
    init: init,
    ajax: get,
    getToken: {
      method: getToken,
      override: true
    }
  });
});