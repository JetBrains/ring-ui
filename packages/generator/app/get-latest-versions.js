const {camelCase} = require('change-case');
const packageJson = require('package-json');

module.exports = packages => Promise.all(
  packages.map(packageName => packageJson(packageName))
).
  then(configs => {
    const versions = {};
    packages.forEach((packageName, i) => {
      versions[camelCase(packageName)] = configs[i].version;
    });
    return versions;
  });
