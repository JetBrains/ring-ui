require.config({
  baseUrl: 'blocks',
  paths: {
    'ring'       : '../bundles/ring',
    'jquery'     : '../shims/jquery/jquery',
    'handlebars' : '../tmp/handlebars',
    'codemirror' : '../components/codemirror/lib/codemirror',
    'storage'    : '../components/polyfill/storage',
    'json'       : '../components/json2/json2',
    'jso'        : '../components/jso/jso'
  },
  shim: {
    'jquery': {
      exports: '$'
    },
    'jso': {
      deps: ['jquery', 'json', 'storage'],
      exports: 'jso_configure',
      init: function(){
        /* jshint camelcase:false */
        /* globals jso_configure, jso_ensureTokens, jso_getToken, jso_wipe */
        return {
          configure: jso_configure,
          ensure: jso_ensureTokens,
          getToken: jso_getToken,
          wipe: jso_wipe
        };
      }
    },
    'codemirror': {
      'exports': 'CodeMirror'
    }
  }
});
