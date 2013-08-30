/* jshint camelcase:false */
define(['jquery', 'jso', 'global/global__modules'], function ($, jso, Module) {
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

  var init = function (config) {
    var dfd = $.Deferred();
    serverUrl = config.serverUri;

    if (!serverUrl) {
      Module.util.log('Server URI is not defined!');
    } else {
      serverUrl = serverUrl.replace(/\/+$/, '');
    }

    jsoConfig[provider] = $.extend({
        authorization: serverUrl + '/rest/oauth2/auth'
      }, {
        client_id: config.clientId,
        redirect_uri: config.redirectUri,
        scope: config.scope
      }
    );

    // Configure jso
    jso.configure(jsoConfig, null, function(done, err) {
      if (err) {
        dfd.reject(err);

      // Authorize, if needed or resolve dfd
      } else if(getToken()) {
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