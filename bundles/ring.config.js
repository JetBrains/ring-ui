require.config({
  baseUrl: 'blocks',
  paths: {
    'ring'       : '../bundles/ring',
    'ring-oauth' : '../bundles/ring-oauth',
    'jquery'     : '../shims/jquery/jquery',
    'handlebars' : '../shims/handlebars/handlebars',
    'jquery-json': '../shims/jquery-json/jquery-json',
    'jso'        : '../components/jso/jso'
  },
  shim: {
    'jquery': {
      exports: '$'
    },
    'jso': {
      deps: ['jquery'],
      exports: "jso_configure",
      init: function(){
        return {
          configure: jso_configure,
          ensure: jso_ensureTokens,
          getToken: jso_getToken
        };
      }
    }
  }
});