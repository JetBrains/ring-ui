/* eslint-env node */
var path = require('path');
var webpack = require('webpack');
var MemoryFileSystem = require('memory-fs');
var when = require('when');
var merge = require('react/lib/merge');
var webpackConfig = require('../webpack.config.js');

/**
 * Process example code using webpack
 * @param {Object} exampleMap Map with examples. Require `dgeni-packages/example`
 * @return {Object}
 */
module.exports = function webpackExampleProcessor(exampleMap) {
  return {
    $runAfter: ['parseExamplesProcessor'],
    $runBefore: ['generateExamplesProcessor'],
    $process: function(docs) {
      return when.all(exampleMap.map(function(example) {
        return when.all(
          this._getFileArray(example).filter(this._filter).map(this._processFile.bind(this, example.doc))
        );
      }.bind(this))).then(function() {
        return docs;
      });
    },

    /**
     * @param {Object} example
     * @return {Array} List of example's files
     */
    _getFileArray: function(example) {
      var vector = [];
      for (var file in example.files) {
        vector.push(example.files[file]);
      }
      return vector;
    },

    /**
     * @param {Object} file Example file
     * @return {Boolean} Return true if we should process it file
     */
    _filter: function(file) {
      return file.type === 'js' && file.hasOwnProperty('webpack');
    },

    /**
     * Processing file content using webpack and put it to
     * fileContents property of file object. Original content
     * will be available through property originalFileContents
     * @param {Object} doc
     * @param {Object} file
     * @return {Object} Deferred object
     */
    _processFile: function(doc, file) {
      var defer = when.defer();

      var entryFilePath = this._getExampleFilePath(doc, file);

      /**
       * Create webpack config for example file
       */
      var config = merge(webpackConfig);
      config.entry = entryFilePath;
      config.externals = {};
      config.output = {
        path: '/',
        filename: 'test.js'
      };

      var compiler = webpack(config);

      /**
       * Setup custom input and out file systems
       * to webpack compiler
       */
      compiler.inputFileSystem = this._getInputFileSystem(file, entryFilePath);
      compiler.resolvers.normal.fileSystem = compiler.inputFileSystem;
      compiler.resolvers.context.fileSystem = compiler.inputFileSystem;
      compiler.resolvers.loader.fileSystem = compiler.inputFileSystem;
      compiler.outputFileSystem = new MemoryFileSystem();

      /**
       * Subscribe on compilation done
       */
      compiler.plugin('done', function(output) {
        var compilationErrors = output.compilation.errors;

        /**
         * Handle webpack compilation errors
         */
        if (compilationErrors.length) {
          compilationErrors.forEach(function(error) {
            console.error(error);
          });

          return defer.reject();
        }

        var processedFileContent = compiler
          .outputFileSystem
          .readFileSync(path.resolve(config.output.path, config.output.filename))
          .toString();

        /**
         * XXX:
         * Modify file object
         */
        file.originalFileContents = file.fileContents;
        file.fileContents = processedFileContent;

        defer.resolve();
      });

      /**
       * Run webpack compiler
       */
      compiler.run(function(error, status) {
        if (error) {
          defer.reject();
          console.log(error, status);
        }
      });

      return defer.promise;
    },

    /**
     * Get path for example relative to file
     * in which located example
     * @return {String} Example file path
     */
    _getExampleFilePath: function(doc, file) {
      return path.resolve(
        path.dirname(doc.fileInfo.filePath), file.name);
    },

    /**
     * XXX
     * Monkey patched file system.
     * If request entry path then immediately return content
     * from object file, because entry file is virtual file(example file)
     */
    _getInputFileSystem: function(file, entryFilePath) {
      var fs = require('fs');
      var inputFileSystem = {};

      inputFileSystem.stat = (function(stat) {
        return function(filePath, callback) {
          if (filePath === entryFilePath) {
            return callback(null, {
              isDirectory: function() {
                return false;
              },
              isFile: function() {
                return true;
              }
            });
          }
          return stat.apply(this, arguments);
        };
      }(fs.stat));

      inputFileSystem.readlink = fs.readlink.bind(fs);

      inputFileSystem.readFile = (function(readFile) {
        return function(filePath, callback) {
          if (filePath === entryFilePath) {
            return callback(null, file.fileContents);
          }
          return readFile.apply(this, arguments);
        };
      }(fs.readFile));

      return inputFileSystem;
    }
  };
};
