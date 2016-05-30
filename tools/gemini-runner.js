/* eslint-env node */
/* eslint-disable no-console */

import 'babel-polyfill';

import Gemini from 'gemini/api';
import geminiTeamcityPlugin from 'gemini-teamcity';
import http from 'http';
import chalk from 'chalk';
import path from 'path';

const isGather = process.argv.includes('--gather');
const isTeamcity = process.argv.includes('--teamcity');

function getDocsiteUrl() {
  const hostname = require('os').hostname();
  const fullHostname = hostname.indexOf('.') !== -1 ? hostname : `${hostname}.labs.intellij.net`;
  return `http://${fullHostname}:9999`;
}

const docsiteUrl = getDocsiteUrl();
console.log(chalk.blue('Docsite url detected:', docsiteUrl));

const config = {
  rootUrl: docsiteUrl,
  gridUrl: '***REMOVED***',
  retry: 5,
  system: {
    projectRoot: path.resolve(__dirname, '..')
  },
  desiredCapabilities: {
    windowSize: '1024x800',
    platform: 'WINDOWS'
  },
  browsers: {
    chrome: {
      windowSize: '1024x800',
      desiredCapabilities: {
        browserName: 'chrome'
      }
    },
    firefox: {
      windowSize: '1024x800',
      desiredCapabilities: {
        browserName: 'firefox'
      }
    },
    ie: {
      windowSize: '1024x800',
      desiredCapabilities: {
        browserName: 'internet explorer'
      }
    }
  }
};

const gemini = new Gemini(config);

if (isTeamcity) {
  geminiTeamcityPlugin(gemini);
}

function getFilesFromArguments() {
  let startIndex = isGather
    ? process.argv.indexOf('--gather')
    : process.argv.indexOf(path.resolve('./', 'tools/gemini-runner.js'));

  if (process.argv.indexOf('--teamcity') !== -1) {
    startIndex = process.argv.indexOf('--teamcity');
  }

  if (startIndex === -1) {
    throw new Error('Wrong gemini usage. Check the README.md');
  }

  startIndex += 1;  //increment to get first file position in arguments array

  return process.argv.slice(startIndex);
}

function handleGeminiError(error) {
  console.error(chalk.red('Error:', error.message));
  if (error.advice) {
    console.error(chalk.blue('To fix:', error.advice));
  }

  /**
   * #RG-663 Wait for calling process exit (to make all child processes finish)
   * And then call exit with error code instead
   */
  const exit = process.exit;
  process.on('exit', () => {
    exit(4);
  });

  throw error;
}

function checkUrlAvailability(url) {
  return new Promise((resolve, reject) => {
    http.get(url, resolve).on('error', reject);
  });
}

const files = getFilesFromArguments();

console.info(chalk.blue('Files to run on:'), files);

checkUrlAvailability(docsiteUrl).
  catch(err => {
    console.error(chalk.red('URL "%s" is not available (%s).' +
      ' Did you forget to run "npm start" before gemini test?'), docsiteUrl, err.code);
    handleGeminiError({message: 'Run "npm start" before'});
  }).
  then(() => {
    if (isGather) {
      console.log(chalk.blue('Gathering references for file:', files[0]));
      if (files.length > 1) {
        throw new Error(`You should gather only 1 file at time, received: ${files.join(',')}`);
      }
      if (files.length === 0) {
        throw new Error('You did not specify a file to gather. Use "npm run gemini-gather components/select/*.gemini.js" for example');
      }
      gemini.update(files, {}).
        then(res => {
          console.log(chalk.green('Gather done'), res);
        }).
        fail(handleGeminiError);

    } else {
      gemini.test(files, {
        reporters: ['html']
      }).
        then(res => {
          console.log(chalk.green('Test done'), res);
          if (res.failed || res.errored) {
            throw new Error('Not all tests passed successfully');
          }
        }).
        fail(handleGeminiError);
    }
  });
