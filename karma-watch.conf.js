/* eslint-env node */
var merge = require('mout/object/merge');
var generateConfig = require('./karma.conf.js');

module.exports = function (karma) {
  var config = merge(generateConfig(karma), {
    singleRun: false,
    //browsers: ['HeadlessNodeWebkit'],
    reporters: ['nyan', 'osx'],
    osxReporter: {
      notificationMode: 'change'
    }
  });

  karma.set(config);
};
