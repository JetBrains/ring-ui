/* eslint-disable no-console */
const {exec} = require('child_process');

const browserStackLocal = require('browserstack-local');
const kill = require('kill-port');

const storiesTreePromise = require('./get-stories-tree');
require('dotenv').config();

const browserstack = new browserStackLocal.Local();

const browserstackPort = 45691;
// eslint-disable-next-line no-magic-numbers
const STDOUT_BUFFER_SIZE = 1024 * 1024 * 20; // 20 Mb

kill(browserstackPort).then(() => {

  browserstack.start({
    key: process.env.BROWSERSTACK_KEY,
    verbose: true,
    logfile: 'browserstack.log'
  }, async err => {
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
      hermioneProcess.kill();
      exec('git add hermione');
    };

    process.on('SIGINT', () => {
      console.log('killed by SIGINT');
      cleanup();
    });

    await storiesTreePromise;
    const hermioneProcess = exec(
      // eslint-disable-next-line no-magic-numbers
      `node_modules/.bin/hermione ${process.argv.slice(2).join(' ')}`,
      {maxBuffer: STDOUT_BUFFER_SIZE},
      error => {
        console.log('hermione execution have been done, error =', error);
        cleanup();
      }
    );
    hermioneProcess.stdout.pipe(process.stdout);
    hermioneProcess.stderr.pipe(process.stderr);
  });
});

