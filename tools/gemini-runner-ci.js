/* eslint-disable no-console */

import {exec} from 'child_process';
import finalhandler from 'finalhandler';
import http from 'http';
import serveStatic from 'serve-static';

function runGeminiTestsOnServer(server) {
  console.log('Runing gemini tests');

  const geminiProcess = exec('babel-node tools/gemini-runner.js --teamcity components/**/*.gemini.js');

  geminiProcess.stdout.pipe(process.stdout);
  geminiProcess.stderr.pipe(process.stderr);

  geminiProcess.on('close', code => {
    server.close();
    if (code) {
      throw new Error('Tests failed, aborting');
    } else {
      console.log('Tests finished without errors');
    }
  });
}

function runServer() {
  const serve = serveStatic('docs', {index: ['index.html']});

  console.log('Starting static server on 9999 port');

  return http.createServer((req, res) => {
    const done = finalhandler(req, res);
    serve(req, res, done);
  })
    .listen(9999);
}

runGeminiTestsOnServer(runServer());
