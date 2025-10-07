/*
 * https://youtrack.jetbrains.com/issue/RG-2304/Publish-built-version-as-a-separate-package-jetbrains-ring-ui-built
 * Removes "devDependencies" from package.json file, and keeps only whitelisted "dependencies"
 */
/* eslint-disable no-console */
const fs = require('fs');

const sourcePackageJSON = require('../package.json');

const BUILT_PACKAGE_NAME = '@jetbrains/ring-ui-built';

// There should be all dependencies, that are actually used in runtime. All build-time dependencies should be removed
const WHITE_LIST = [
  '@jetbrains/icons',
  '@jetbrains/logos',
  'change-case',
  'classnames',
  'combokeys',
  'date-fns',
  'dequal',
  'element-resize-detector',
  'fastdom',
  'focus-trap',
  'highlight.js',
  'just-debounce-it',
  'memoize-one',
  'react-movable',
  'react-virtualized',
  'react-waypoint',
  'scrollbar-width',
  'simply-uuid',
  'sniffr',
  'util-deprecate',
];

function clearAndRenamePackage() {
  const filterDependencies = (packageData, whitelist) => {
    const dependencies = packageData.dependencies;

    const filteredDependencies = {};

    // Only keep runtime dependencies and the ones in the whitelist
    for (const depName in dependencies) {
      if (whitelist.includes(depName)) {
        filteredDependencies[depName] = dependencies[depName];
      }
    }

    return {
      ...packageData,
      dependencies: filteredDependencies,
      devDependencies: {},
    };
  };

  const updatePackageJSON = (filename, packageData) => {
    fs.writeFileSync(filename, JSON.stringify(packageData, null, 2));
  };

  // Rename package.name
  sourcePackageJSON.name = BUILT_PACKAGE_NAME;

  // Remove "webpack" from peer dependencies
  delete sourcePackageJSON.peerDependencies.webpack;
  delete sourcePackageJSON.peerDependenciesMeta.webpack;

  // Remove build-time files from files to be published
  sourcePackageJSON.files = ['components', 'typings.d.ts'];

  // remove overrides
  delete sourcePackageJSON.overrides;

  const filteredData = filterDependencies(sourcePackageJSON, WHITE_LIST);
  updatePackageJSON('./package.json', filteredData);
  console.log('package.json updated. DevDependencies removed.');
}

clearAndRenamePackage();
