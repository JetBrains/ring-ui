require.config({
  baseUrl: 'blocks',
  paths: {
    'ring'       : '../bundles/ring',
    'jquery'     : '../shims/jquery/jquery',
    'handlebars' : '../tmp/handlebars',
    'storage'    : '../components/polyfill/storage',
    'json3'      : '../components/json3/lib/json3',
    'jso'        : '../components/jso/jso'
  },
  shim: {
    'jquery': {
      exports: '$'
    },
    'jso': {
      deps: ['jquery', 'json3', 'storage'],
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
    }
  }
});