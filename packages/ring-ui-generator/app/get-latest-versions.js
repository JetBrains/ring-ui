const {camelCase} = require('change-case');
const latest = require('latest-version');

module.exports = packages => Promise.all(
  packages.map(packageName => latest(packageName))
).
  then(latestVersions => {
    const versions = {};
    packages.forEach((packageName, i) => {
      versions[camelCase(packageName)] = latestVersions[i];
    });
    return versions;
  });
