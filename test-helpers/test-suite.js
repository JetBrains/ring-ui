import './mocha-globals';

const testsContext = require.context('../components', true, /\.test\.js$/);

testsContext.keys().forEach(testsContext);
