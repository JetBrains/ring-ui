/* eslint-env node */
var pkgConfig = require('../package.json');

console.log('##teamcity[importData type=\'jslint\' path=\'' + pkgConfig.config['eslint-report'] + '\']');
