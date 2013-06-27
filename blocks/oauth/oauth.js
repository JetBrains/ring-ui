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

  var oauthInit = function (initialConfig, baseData, dontWaitDom, component) {

    serverUrl = initialConfig.serverUri;

    if (!serverUrl) {
      throw "Server URI is not defined!";
    }

    config = jQuery.extend({
        client_id: "dafb2157-a3ac-4f8c-92fa-450c3c903189",
        redirect_uri: window.location.href,
        authorization: serverUrl + '/rest/oauth2/auth'
      }, {
        client_id: initialConfig.clientId,
        redirect_uri: initialConfig.redirectUri
      }
    );
    console.log(config);
    jso.configure({
      'default': config
    });
    $.oajax({url: serverUrl + '/rest/services',
      jso_provider: 'default',
      //TODO: use string scopes instead of ids
      jso_scopes: ['dafb2157-a3ac-4f8c-92fa-450c3c903189'],
      jso_allowia: true,
      dataType: 'json',
      success: function (servicePage) {
        console.log("Response (default):");
        console.log(servicePage);
        var items = convertServicesToItems(servicePage.services);
        defaultHeaderInit(jQuery.extend(baseData, {'stripe': {'items': items}}), dontWaitDom, component);
      }
    });
  };

  header.init = oauthInit;

  return header;
});