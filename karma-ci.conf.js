/* eslint-env node */
/* eslint-disable no-var */
/* eslint-disable modules/no-cjs */

var deepAssign = require('deep-assign');
var generateConfig = require('./karma-base.conf.js');

module.exports = function (config) {
  var configCI = deepAssign(generateConfig(config), {
    // Something is broken in IE9 in hardly debuggable way, so we'll fix it someday
    browsers: ['Chrome'],
    coverageReporter: {
      reporters: [
        {type: 'html', dir: 'coverage/'},
        {type: 'teamcity'}
      ]
    },
    reporters: ['progress', 'coverage']
  });

  require('fs').writeFileSync('cfg.json', JSON.stringify(configCI, null, 2));
  config.set(configCI);
};
