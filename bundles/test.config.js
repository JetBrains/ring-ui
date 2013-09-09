/* global requirejs: false */
/* jshint camelcase:false */
var tests = [];
for (var file in window.__karma__.files) {
  if (window.__karma__.files.hasOwnProperty(file)) {
    if (/^\/base\/test\//.test(file)) {
      tests.push(file);
    }
  }
}

requirejs.config({
  // Karma serves files from '/base'
  baseUrl: '/base/blocks',

  paths: {
    'ring'       : '../bundles/ring',
    'jquery'     : '../shims/jquery/jquery',
    'handlebars' : '../tmp/handlebars',
    'codemirror' : '../components/codemirror/lib/codemirror',
    'storage'    : '../components/polyfill/storage',
    'json'      : '../components/json2/json2',
    'jso'        : '../components/jso/jso',
    'raphael'    : '../components/raphael/raphael-min'
  },
  shim: {
    'jquery': {
      exports: '$'
    },
    'jso': {
      deps: ['jquery', 'json', 'storage'],
      exports: 'jso_configure',
      init: function(){
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
    },
    'raphael': {
      'exports': 'Raphael'
    }
  },

  // ask Require.js to load these files (all our tests)
  deps: tests,

  // start test run, once Require.js is done
  callback: window.__karma__.start
});
