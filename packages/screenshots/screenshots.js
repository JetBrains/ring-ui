/* eslint-disable no-console */
import {exec, execSync} from 'child_process';
import path from 'path';
import {fileURLToPath} from 'url';
import browserStackLocal from 'browserstack-local';
import 'dotenv/config';

const dirname = path.dirname(fileURLToPath(import.meta.url));

const browserstack = new browserStackLocal.Local();

const browserstackPort = 45690;
// eslint-disable-next-line no-magic-numbers
const STDOUT_BUFFER_SIZE = 1024 * 1024 * 20; // 20 Mb

export default callback => {
  try {
    execSync(`npx port-claim ${browserstackPort}`);
  } catch (e) {
    console.error(e);
  }
  browserstack.start(
    {
      key: process.env.BROWSERSTACK_KEY,
      verbose: true,
      logfile: 'browserstack.log',
    },
    err => {
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

      execSync('npx vitest run packages/screenshots/get-stories-tree.test.js', {
        cwd: path.resolve(dirname, '../..'),
        stdio: 'inherit',
      });
      const screenshotsProcess = exec(
        `npx testplane ${process.argv.slice(2).join(' ')}`,
        {maxBuffer: STDOUT_BUFFER_SIZE},
        error => {
          console.log('screenshots execution have been done, error =', error);
          cleanup();
        },
      );
      screenshotsProcess.stdout.pipe(process.stdout);
      screenshotsProcess.stderr.pipe(process.stderr);
    },
  );
};
