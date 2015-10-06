// Required for svg-sprite-loader's angularBaseWorkaround
require('angular');

var testsContext = require.context('../components', true, /\.test\.js$/);
testsContext.keys().forEach(testsContext);
