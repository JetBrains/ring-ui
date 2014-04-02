require.config({
  baseUrl: 'blocks',
  paths: {
    'ring'       : '../bundles/ring',
    'jquery'     : '../shims/jquery/jquery',
    'jquery-caret': '../components/jquery-caret/jquery.caret',
    'handlebars' : '../tmp/handlebars',
    'codemirror' : '../components/codemirror/lib/codemirror',
    'storage-polyfill': '../components/polyfill/obsolete/storage',
    'json'       : '../components/json2/json2',
    'jso'        : '../components/jso/jso',
    'raphael'    : '../components/raphael/raphael-min',
    'mousetrap'  : '../components/mousetrap/mousetrap'
  },
  shim: {
    'jquery': {
      exports: '$'
    },
    'jso': {
      deps: ['jquery'],
      exports: 'jso_configure',
      init: function(){
        /* jshint camelcase:false */
        /* globals jso_configure, jso_ensureTokens, jso_getToken, jso_wipe, jso_registerRedirectHandler, jso_registerStorageHandler, jso_authrequest */
        return {
          configure: jso_configure,
          ensure: jso_ensureTokens,
          getToken: jso_getToken,
          setRedirect: jso_registerRedirectHandler,
          registerStorageHandler: jso_registerStorageHandler,
          authRequest: jso_authrequest,
          wipe: jso_wipe
        };
      }
    },
    'jquery-caret': {
      deps:['jquery']
    },
    'codemirror': {
      'exports': 'CodeMirror'
    },
    'raphael': {
      'exports': 'Raphael'
    }
  }
});
