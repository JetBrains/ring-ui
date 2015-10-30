/* eslint-env node */
/* eslint-disable no-console*/
/* eslint-disable no-var*/

var pkgConfig = require('../package.json');

console.log('##teamcity[importData type=\'jslint\' path=\'' + pkgConfig.config['eslint-report'] + '\']');
