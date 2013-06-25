define(['jso', 'jquery', 'header/header'], function (jso, $, header) {
  'use strict';

  var config;
  var headerInit = header.init;

  var oauthInit = function (initialConfig, dontWaitDom, component) {
    config = jQuery.extend(initialConfig, {});
    jso.configure({
      'default': config
    });
    $.oajax({url: config.headerDataUrl,
      jso_provider: 'default',
      //TODO: use string scopes instead of ids
      jso_scopes: ['dafb2157-a3ac-4f8c-92fa-450c3c903189'],
      jso_allowia: true,
      dataType: 'json',
      success: function (data) {
        console.log("Response (default):");
        console.log(data);
        headerInit(data, dontWaitDom, component);
      }
    });
  };

  header.init = oauthInit;

  return header;
});