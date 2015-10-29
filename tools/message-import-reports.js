/* eslint-env node */
/* eslint-disable no-console*/

var pkgConfig = require('../package.json');

console.log('##teamcity[importData type=\'jslint\' path=\'' + pkgConfig.config['eslint-report'] + '\']');
