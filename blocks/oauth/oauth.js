define(['jso', 'jquery', 'header/header'], function (jso, $, header) {
  'use strict';

  var config;
  var headerInit = header.init;

  var oauthInit = function (initialConfig, baseData, dontWaitDom, component) {
    if (!(initialConfig) || !(initialConfig.serverUri)) {
      throw "Server URI is not defined!";
    }
    config = jQuery.extend({
        client_id: "dafb2157-a3ac-4f8c-92fa-450c3c903189",
        redirect_uri: window.location.href,
        authorization: initialConfig.serverUri + '/rest/oauth2/auth'
      }, {
        client_id: initialConfig.clientId,
        redirect_uri: initialConfig.redirectUri
      }
    );
    console.log(config);
    jso.configure({
      'default': config
    });
    $.oajax({url:initialConfig.serverUri + '/rest/services',
      jso_provider: 'default',
      //TODO: use string scopes instead of ids
      jso_scopes: ['dafb2157-a3ac-4f8c-92fa-450c3c903189'],
      jso_allowia: true,
      dataType: 'json',
      success: function (data) {
        console.log("Response (default):");
        console.log(data);
        headerInit(baseData, dontWaitDom, component);
      }
    });
  };

  header.init = oauthInit;

  return header;
});