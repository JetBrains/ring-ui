require.config({
  baseUrl: 'blocks',
  paths: {
    'ring'       : '../bundles/ring',
    'jquery'     : '../shims/jquery/jquery',
    'jquery-json': '../shims/jquery-json/jquery-json',
    'handlebars' : '../tmp/handlebars',
    'jso'        : '../components/jso/jso',
    'codemirror' : '../components/codemirror/lib/codemirror'
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
        /* globals jso_configure, jso_ensureTokens, jso_getToken */
        return {
          configure: jso_configure,
          ensure: jso_ensureTokens,
          getToken: jso_getToken
        };
      }
    },
    'codemirror': {
      'exports': 'CodeMirror'
    }
  }
});
