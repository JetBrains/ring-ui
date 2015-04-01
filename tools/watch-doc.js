/* eslint-env node */

var childProcess = require('child_process');
var watch = require('watch');
var path = require('path');
var fs = require('fs');

var watchPath = path.resolve(__dirname, '../components');
var supportedFileRegexp = /\.(js|jsx)$/i;
var watchOptions = {
  filter: function (fileName) {
    if (fs.lstatSync(fileName).isDirectory()){
      return true;
    }

    return supportedFileRegexp.test(fileName);
  }
};

function runScript(scriptPath, args, callback) {
  var process = childProcess.fork(scriptPath, args);

  process.on('error', callback);

  process.on('exit', function (code) {
    var err = code === 0 ? null : new Error('exit code ' + code);
    callback(err);
  });
}

var isAlreadyGenerating = false;

watch.watchTree(watchPath, watchOptions, function onChange(file, curr, prev) {

  if (typeof file === 'string' && prev !== null && curr !== null && curr.nlink !== 0) {
    // file was changed
    var fileName = file.match(/[\w.-]+$/)[0];
    console.log('File changed:', fileName);

    if (isAlreadyGenerating){
      console.log('Documentation generation is in progress, change skipped');
      return;
    }

    isAlreadyGenerating = true;
    runScript(path.resolve(__dirname, './generate-documentation.js'), [fileName], function (err) {
      isAlreadyGenerating = false;
      if (err) {
        console.log(err);
      } else {
        console.log('Documentation generated successfully.');
      }
    });
  }

});

console.log('Watch started on', watchPath);
