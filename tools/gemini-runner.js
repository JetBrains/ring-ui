/* eslint-env node */
require('babel/polyfill');
var Gemini = require('gemini/api');
var geminiTeamcityPlugin = require('gemini-teamcity');
var http = require('http');
var when = require('when');

var isGather = process.argv.indexOf('--gather') !== -1;
var isTeamcity = process.argv.indexOf('--teamcity') !== -1;

function getDocsiteUrl() {
  var hostname = require('os').hostname();
  var fullHostname = hostname.indexOf('.') !== -1 ? hostname : hostname + '.labs.intellij.net';
  return fullHostname + ':9999';
}

var docsiteUrl = getDocsiteUrl();
console.log('Docsite url detected: ', docsiteUrl);

var gemini = new Gemini('.gemini.yml', {
  rootUrl: docsiteUrl
});

if (isTeamcity) {
  geminiTeamcityPlugin(gemini);
}

function getFilesFromArguments() {
  var startIndex = process.argv.indexOf('files') + 1;
  if (startIndex === -1) {
    throw new Error('Parameter "files" is not specified');
  }
  return process.argv.slice(startIndex);
}

function handleGeminiError(error) {
  console.error('Error: ' + error.message);
  if (error.advice) {
    console.error('To fix:', error.advice);
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
  .then(function () {
    if (isGather) {
      if (files.length > 1) {
        throw new Error('You should gather only 1 file at time, received: ' + files.join(','));
      }
      gemini.gather(files, {})
        .then(function (res) {
          console.log('Gather done', res);
        })
        .fail(handleGeminiError);

    } else {
      gemini.test(files, {
        reporters: ['html']
      })
        .then(function (res) {
          console.log('Test done', res);
          if (res.failed || res.errored) {
            throw new Error('Not all tests passed successfully');
          }
        })
        .fail(handleGeminiError);
    }
  })
  .catch(function (err) {
    console.error('URL "%s" is not available (%s).' +
      ' Did you forget to run "npm start" before gemini test?', docsiteUrl, err.code);
  });
