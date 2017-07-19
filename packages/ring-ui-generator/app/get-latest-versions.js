const pify = require('pify');
const {camelCase} = require('change-case');
const latest = pify(require('npm-latest-version'));

const REGISTRY_URL = 'http://registry.npmjs.org';

module.exports = packages => Promise.all(
  packages.map(packageName => latest(packageName, {base: REGISTRY_URL}))
).
  then(latestVersions => {
    const versions = {};
    packages.forEach((packageName, i) => {
      versions[camelCase(packageName)] = latestVersions[i];
    });
    return versions;
  });
