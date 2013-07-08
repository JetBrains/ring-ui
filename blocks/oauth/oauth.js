define(['jso', 'jquery', 'full-header/full-header'], function (jso, $, header) {
  'use strict';

  var config;
  var defaultHeaderInit = header.init;
  var serverUrl;

  function convertServicesToItems(services) {
    var items = [];
    for (var i = 0; i < services.length; ++i) {
      var service = services[i];
      items.push({
        'title': service.name,
        'url': service.homeUrl
      });
    }
    return items;
  }

  function convertUserToProfile(user) {
    return {'username': user.name};
  }

  var oauthInit = function (initialConfig, baseData, dontWaitDom, component) {

    serverUrl = initialConfig.serverUri;

    if (!serverUrl) {
      throw "Server URI is not defined!";
    }

    config = jQuery.extend({
        client_id: "dafb2157-a3ac-4f8c-92fa-450c3c903189",
        redirect_uri: window.location.href,
        authorization: serverUrl + '/rest/oauth2/auth',
        scope: ['dafb2157-a3ac-4f8c-92fa-450c3c903189']
      }, {
        client_id: initialConfig.clientId,
        redirect_uri: initialConfig.redirectUri,
        scope: initialConfig.scope
      }
    );
    console.log(config);
    jso.configure({
      'default': config
    });
    hubAjax(serverUrl + '/rest/services',
      function (servicePage) {
        console.log("Response (default):");
        console.log(servicePage);
        var items = convertServicesToItems(servicePage.services);
        var data = jQuery.extend(baseData, {'stripe': {'items': items}});
        hubAjax(serverUrl + '/rest/users/me', function (user) {
          console.log(user);
          data.stripe = jQuery.extend(data.stripe, {'personal': convertUserToProfile(user)});
            defaultHeaderInit(data, dontWaitDom, component);
        });
      }
    );
  };

  function hubAjax(url, callback) {
    $.oajax({url: url,
      jso_provider: 'default',
      //TODO: use string scopes instead of ids
      jso_scopes: config.scope,
      jso_allowia: true,
      dataType: 'json',
      success: callback
    });
  }

  header.init = oauthInit;

  return header;
});