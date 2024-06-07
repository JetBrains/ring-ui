/* eslint-disable no-console */
const {exec, execSync} = require('child_process');
const path = require('path');

const browserStackLocal = require('browserstack-local');
const kill = require('kill-port');

require('dotenv').config();

const browserstack = new browserStackLocal.Local();

const browserstackPort = 45690;
// eslint-disable-next-line no-magic-numbers
const STDOUT_BUFFER_SIZE = 1024 * 1024 * 20; // 20 Mb

module.exports = callback => kill(browserstackPort).catch(e => {
  console.error(e);
}).then(() => {

  browserstack.start({
    key: process.env.BROWSERSTACK_KEY,
    verbose: true,
    logfile: 'browserstack.log'
  }, err => {
    if (err) {
      console.error(err.message);
      return;
    }

    console.log('BrowserStack is connected and ready');

    const cleanup = () => {
      browserstack.stop(error => {
        console.log('Closed BrowserStack process', error || '');
      });
      // eslint-disable-next-line no-use-before-define
      screenshotsProcess.kill();
      exec('git add testplane');
      callback();
    };

    process.on('SIGINT', () => {
      console.log('killed by SIGINT');
      cleanup();
    });

    execSync('npx jest packages/screenshots/get-stories-tree.js \'--testMatch=**\'', {
      cwd: path.resolve(__dirname, '../..'),
      stdio: 'inherit'
    });
    const screenshotsProcess = exec(
      // eslint-disable-next-line no-magic-numbers
      `npx testplane ${process.argv.slice(2).join(' ')}`,
      {maxBuffer: STDOUT_BUFFER_SIZE},
      error => {
        console.log('screenshots execution have been done, error =', error);
        cleanup();
      }
    );
    screenshotsProcess.stdout.pipe(process.stdout);
    screenshotsProcess.stderr.pipe(process.stderr);
  });
});

