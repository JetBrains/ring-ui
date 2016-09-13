const pkgConfig = require('../package.json'); // eslint-disable-line modules/no-cjs
console.log(`##teamcity[importData type='jslint' path='${pkgConfig.config['eslint-report']}']`);
