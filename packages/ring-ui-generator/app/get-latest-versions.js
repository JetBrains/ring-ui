const {camelCase} = require('change-case');
const packageJson = require('latest-version');

const pkg = require('../package.json');

module.exports = packages => Promise.all(
  packages.map(packageName => {
    if (packageName === pkg.name) {
      return Promise.resolve(pkg);
    }

    const version = pkg.devDependencies[packageName];
    if (version) {
      return Promise.resolve({version});
    }

    return packageJson(packageName, version && {version});
  })
).
  then(configs => {
    const versions = {};
    packages.forEach((packageName, i) => {
      versions[camelCase(packageName)] = configs[i].version;
    });
    return versions;
  });
