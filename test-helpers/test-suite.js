import './mocha-globals';
import './enzyme-configuration';

const testsContext = require.context('../components', true, /\.test\.js$/);

testsContext.keys().forEach(testsContext);
