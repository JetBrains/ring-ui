var testsContext = require.context('../components', true, /\.test\.js$/);

// Always use polyfill in tests to go through Sinin's fake XHR
window.fetch = require('exports?self.fetch!imports?self=>{},Promise=core-js/es6/promise!whatwg-fetch');

testsContext.keys().forEach(testsContext);
