import pkgConfig from '../package.json';
console.log(`##teamcity[importData type='jslint' path='${pkgConfig.config['eslint-report']}']`);
