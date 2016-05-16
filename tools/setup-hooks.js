/* eslint-env node */
/* eslint-disable no-process-exit */
/* eslint-disable no-console*/

/**
 * Pre-commit hook. Helps to detect linting issue before commit
 */
function preCommit() {
  const childProcess = require('child_process');
  const fs = require('fs');

  function processResults(err, stdout, stderr) {
    console.log(stdout);

    let exitCode = 0;
    if (err) {
      console.log(stderr);
      exitCode = -1;
    }

    process.exit(exitCode);
  }

  function processFiles(error, stdout) {
    const fileRE = /\.js$/;

    if (error) {
      throw error;
    }

    const files = (stdout || '').
    split('\n').
    filter(filename => (fileRE).test(filename) && fs.existsSync(filename));

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
 * Hook installer
 * @param hooks {object} hash with hook name to function
 */
function install(hooks) {
  const fs = require('fs');
  const path = require('path');

  /**
   * Turns function to string
   * @param func
   * @returns {string}
   */
  function wrapHook(func) {
    return `#!/usr/bin/env node\n\n${func.toString()}\n\n${func.name}();`;
  }

  const hooksDirPath = path.resolve(__dirname, '..', '.git', 'hooks');
  if (!fs.existsSync(hooksDirPath)) {
    fs.mkdirSync(hooksDirPath);
  }

  Object.keys(hooks).forEach(function writeHook(hook) {
    const hookPath = path.resolve(hooksDirPath, hook);

    fs.writeFileSync(hookPath, wrapHook(hooks[hook]));
    fs.chmodSync(hookPath, '755');
  });
}

install({
  'pre-commit': preCommit
});
