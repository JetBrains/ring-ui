/* eslint-disable no-var */
/* eslint-disable modules/no-cjs */

var testsContext = require.context('../components', true, /\.test\.js$/);

testsContext.keys().forEach(testsContext);
