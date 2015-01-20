var merge = require('mout/object/merge');
var generateConfig = require('./karma-common.conf.js');

module.exports = function(karma) {
  var config = merge(generateConfig(karma), {
    action: 'run',
    browsers: ['ChromeNoSandbox', 'Firefox'],
    reporters: 'teamcity'
  });

  karma.set(config);
};
