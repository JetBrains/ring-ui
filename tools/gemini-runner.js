/* eslint-env node */
/* eslint-disable no-console */
/* eslint-disable no-var */
/* eslint-disable modules/no-cjs */

require('babel/polyfill');
var Gemini = require('gemini/api');
var geminiTeamcityPlugin = require('gemini-teamcity');
var http = require('http');
var chalk = require('chalk');

var isGather = process.argv.indexOf('--gather') !== -1;
var isTeamcity = process.argv.indexOf('--teamcity') !== -1;

function getDocsiteUrl() {
  var hostname = require('os').hostname();
  var fullHostname = hostname.indexOf('.') !== -1 ? hostname : hostname + '.labs.intellij.net';
  return fullHostname + ':9999';
}

var docsiteUrl = getDocsiteUrl();
console.log(chalk.blue('Docsite url detected:', docsiteUrl));

var gemini = new Gemini('.gemini.yml');

//Update rootUrl using private API since here is no way to do that correctly
gemini.config._configs.chrome.rootUrl = docsiteUrl;
gemini.config._configs.firefox.rootUrl = docsiteUrl;

if (isTeamcity) {
  geminiTeamcityPlugin(gemini);
}

function getFilesFromArguments() {
  var startIndex = process.argv.indexOf('files') + 1;
  if (startIndex < 1) {
    throw new Error('Parameter "files" is not specified. Usage: "npm run gemini-gather files components/select/*.gemini.js"');
  }
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
  var exit = process.exit;
  process.on('exit', function () {
    exit(4);
  });

  throw error;
}

function checkUrlAvailability(url) {
  return new Promise(function (resolve, reject) {
    http.get('http://' + url, resolve).on('error', reject);
  });
}

var files = getFilesFromArguments();

checkUrlAvailability(docsiteUrl)
  .catch(function (err) {
    console.error(chalk.red('URL "%s" is not available (%s).' +
      ' Did you forget to run "npm start" before gemini test?'), docsiteUrl, err.code);
    handleGeminiError({message: 'Run "npm start" before'});
  })
  .then(function () {
    if (isGather) {
      console.log(chalk.blue('Gathering references for file:', files[0]));
      if (files.length > 1) {
        throw new Error('You should gather only 1 file at time, received: ' + files.join(','));
      }
      if (files.length === 0) {
        throw new Error('You did not specify a file to gather. Use "npm run gemini-gather files components/select/*.gemini.js" for example');
      }
      gemini.update(files, {})
        .then(function (res) {
          console.log(chalk.green('Gather done'), res);
        })
        .fail(handleGeminiError);

    } else {
      gemini.test(files, {
        reporters: ['html']
      })
        .then(function (res) {
          console.log(chalk.green('Test done'), res);
          if (res.failed || res.errored) {
            throw new Error('Not all tests passed successfully');
          }
        })
        .fail(handleGeminiError);
    }
  });
