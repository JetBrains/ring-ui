/* eslint-env node */
/* eslint-disable no-process-exit */
/* eslint-disable no-console*/

/**
 * Pre-commit hook. Helps to detect linting issue before commit
 */
function preCommit() {
  var childProcess = require('child_process');
  var fs = require('fs');

  function processResults(err, stdout, stderr) {
    console.log(stdout);

    var exitCode = 0;
    if (err) {
      console.log(stderr);
      exitCode = -1;
    }

    process.exit(exitCode);
  }

  function processFiles(error, stdout) {
    var pkgConfig = require('../../package.json');
    var fileRE = new RegExp(pkgConfig.config['eslint-ext'].
      split(',').
      map(function escaspeExt(ext) {
        return '\\' + ext + '$';
      })
      .join('|'));

    if (error) {
      throw error;
    }

    var files = (stdout || '').
      split('\n').
      filter(function (filename) {
        return (fileRE).test(filename) && fs.existsSync(filename);
      });

    if (files.length === 0) {
      process.exit(0);
    }

    // cli param breaks on commits with many files
    process.env.ESLINT_HOOK_FILES = files.join(' ');
    childProcess.exec('npm run lint-hook', processResults);
  }

  childProcess.exec('git diff --cached --name-only', processFiles);
}

/**
 * Available hooks
 */
var hooks = {
  'pre-commit': preCommit
};

/**
 * Turns function to string
 * @param func
 * @returns {string}
 */
function wrapHook(func) {
  return '#!/usr/bin/env node\n\n' + func.toString() + '\n\n' + func.name + '();';
}

/**
 * Hook installer
 */
Object.keys(hooks).forEach(function writeHook(hook) {
  var path = require('path');
  var fs = require('fs');

  fs.writeFile(path.resolve(__dirname, '..', '.git', 'hooks', hook), wrapHook(hooks[hook]));
});
