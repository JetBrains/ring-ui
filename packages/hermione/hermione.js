/* eslint-disable no-console */
const {exec} = require('child_process');

const sauceConnectLauncher = require('sauce-connect-launcher');
const kill = require('kill-port');

const storiesTreePromise = require('./get-stories-tree');

const saucePort = 4445;

kill(saucePort).then(() => {
  sauceConnectLauncher({
    username: process.env.SAUCE_USERNAME,
    accessKey: process.env.SAUCE_ACCESS_KEY,
    logfile: 'saucelabs-session.log',
    connectRetries: 3
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
      hermioneProcesss.kill();
      exec('git add hermione/screenshots');
    };

    process.on('SIGINT', cleanup);

    await storiesTreePromise;
    // eslint-disable-next-line no-magic-numbers
    const hermioneProcesss = exec(`node_modules/.bin/hermione ${process.argv.slice(2).join(' ')}`, cleanup);
    hermioneProcesss.stdout.pipe(process.stdout);
    hermioneProcesss.stderr.pipe(process.stderr);
  });
});

