/* eslint-env node */
/* eslint-disable no-console*/

var message = 'webpack.config.js is missing';
console.log('##teamcity[buildStatus status=\'FAILURE\' text=\'{build.status.text},' + message + '\']');

throw new Error(message);
