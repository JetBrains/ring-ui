/* eslint-env node */
var Gemini = require('gemini/api');

var docsiteUrl = require('os').hostname() + ':9999';
var isGather = process.argv.indexOf('--gather') !== -1;

var gemini = new Gemini('.gemini.yml', {
  rootUrl: docsiteUrl
});

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
  var exit = process.exit;
  exit(1);
}

var files = getFilesFromArguments();

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
