/* eslint-env node */
/* eslint-disable no-console */
/* eslint-disable no-var */
/* eslint-disable modules/no-cjs */

var exec = require('child_process').exec;
var finalhandler = require('finalhandler');
var http = require('http');
var serveStatic = require('serve-static');


function runGeminiTestsOnServer(server) {
  console.log('Runing gemini tests');

  var geminiProcess = exec('node tools/gemini-runner.js --teamcity files components/**/*.gemini.js');

  geminiProcess.stdout.pipe(process.stdout);
  geminiProcess.stderr.pipe(process.stderr);

  geminiProcess.on('close', function (code) {
    server.close();
    if (code) {
      throw new Error('Tests failed, aborting');
    } else {
      console.log('Tests finished without errors');
    }
  });
}

function runServer() {
  var serve = serveStatic('docs', {index: ['index.html']});

  console.log('Starting static server on 9999 port');

  return http.createServer(function (req, res) {
    var done = finalhandler(req, res);
    serve(req, res, done);
  })
    .listen(9999);
}

runGeminiTestsOnServer(runServer());
