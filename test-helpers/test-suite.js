/* eslint-disable no-var */
/* eslint-disable modules/no-cjs */

var testsContext = require.context('../components', true, /\.test\.js$/);

// Always use polyfill in tests to go through Sinon's fake XHR
window.fetch = require('exports?self.fetch!imports?self=>{},Promise=core-js/es6/promise!whatwg-fetch');

testsContext.keys().forEach(testsContext);
