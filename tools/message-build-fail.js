/* eslint-env node */
/* eslint-disable no-console */
/* eslint-disable no-var */
/* eslint-disable modules/no-cjs */

var message = 'webpack.config.js is missing';
console.log('##teamcity[buildStatus status=\'FAILURE\' text=\'{build.status.text},' + message + '\']');

throw new Error(message);
