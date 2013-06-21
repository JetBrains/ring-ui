require.config({
  baseUrl: 'blocks',
  paths: {
    'ring'       : '../bundles/ring/ring',
    'jquery'     : '../shims/jquery/jquery',
    'handlebars' : '../shims/handlebars/handlebars',
    'jquery-json': '../shims/jquery-json/jquery-json'
  },
  shim: {
    'jquery': {
      exports: '$'
    }
  }
});