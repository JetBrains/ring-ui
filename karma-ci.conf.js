/* eslint-env node */
/* eslint-disable no-var */
/* eslint-disable modules/no-cjs */

var merge = require('mout/object/merge');
var generateConfig = require('./karma.conf.js');

module.exports = function (karma) {
  var config = merge(generateConfig(karma), {
    action: 'run',
    // Something is broken in IE9 in hardly debuggable way, so we'll fix it someday
    browsers: ['wdIE11', /*'wdIE9', */'wdFirefox', 'wdChrome'],
    reporters: 'teamcity',
    coverageReporter: {
      reporters: [
        {type: 'html', dir: 'coverage/'},
        {type: 'teamcity'},
        {type: 'text-summary'}
      ]
    },
    webpackServer: {}
  });

  karma.set(config);
};
