/* eslint-disable no-console */
const {exec} = require('child_process');

const sauceConnectLauncher = require('sauce-connect-launcher');
const kill = require('kill-port');

const storiesTreePromise = require('./get-stories-tree');

const saucePort = 4445;
// eslint-disable-next-line no-magic-numbers
const STDOUT_BUFFER_SIZE = 1024 * 1024 * 20; // 20 Mb

kill(saucePort).then(() => {
  sauceConnectLauncher({
    username: process.env.SAUCE_USERNAME,
    accessKey: process.env.SAUCE_ACCESS_KEY,
    logfile: 'saucelabs-session.log',
    connectRetries: 3,
    directDomains: ['hub.jetbrains.com', 'via.placeholder.com', '*.microsoft.com', 'icons.iconarchive.com']
  }, async (err, sauceConnectProcess) => {
    if (err) {
      console.error(err.message);
      return;
    }

    console.log('Sauce Connect ready');

    const cleanup = () => {
      sauceConnectProcess.close(() => {
        console.log('Closed Sauce Connect process');
      });
      // eslint-disable-next-line no-use-before-define
      hermioneProcess.kill();
      exec('git add hermione/screenshots');
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

