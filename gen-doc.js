/**
 * Usage: Run `node gen-doc.js > docs/index.html`
 */

var when = require('when');
var fs = require('fs');
var qfs = require('q-fs');
var webpack = require('webpack');
var path = require('path');
var MemoryFileSystem = require('memory-fs');
var webpackConfig = require('./webpack.config.js');
var Handlebars = require('handlebars');
var indexHTMLTemplate = Handlebars.compile(String(fs.readFileSync('./docs/index.template.html')));

var ReactWithAddonsScript = fs.readFileSync(path.resolve(
  path.dirname(require.resolve('react')),
  './dist/react-with-addons.js'));

var componentDir = 'src/components/';
var docs = [];

/**
 * Convert Bem name to camel case
 * @param {string} str
 * @return {Object}
 */
var toCamelCase = function (str) {
  return str.split(/__|-/).reduce(function (str, part) {
    return str + part[0].toUpperCase() + part.slice(1);
  }, '');
};

/**
 * Remove leading and trainling spaces with empty leading and
 * trailing lineas
 * @param {string} text
 * @returun {string}
 */
var trim = function (text) {
  var MAX_INDENT = 9999;
  var empty = RegExp.prototype.test.bind(/^\s*$/);
  var lines = text.split('\n');
  var minIndent = MAX_INDENT;
  var indentRegExp;
  var ignoreLine = (lines[0][0] !== ' ' && lines.length > 1);
  // ignore first line if it has no indentation and there is more than one line

  lines.forEach(function (line) {
    if (ignoreLine) {
      ignoreLine = false;
      return;
    }

    var indent = line.match(/^\s*/)[0].length;
    if (indent > 0 || minIndent === MAX_INDENT) {
      minIndent = Math.min(minIndent, indent);
    }
  });

  indentRegExp = new RegExp('^\\s{0,' + minIndent + '}');

  for (var i = 0; i < lines.length; i++) {
    lines[i] = lines[i].replace(indentRegExp, '');
  }

  // remove leading lines
  while (empty(lines[0])) {
    lines.shift();
  }

  // remove trailing
  while (empty(lines[lines.length - 1])) {
    lines.pop();
  }
  return lines.join('\n');
};

/**
 * @param text
 * @param file
 * @returns {*|Promise.<Array.<Object>>}
 */
var getExamples = function (text, file) {
  var examples = [];
  var scriptRegExp = /<script>([\s\S]*?)<\/script>/gmi;

  trim((text || '')).replace(/<example>([\s\S]*?)<\/example>/gmi, function (_, content) {
    content.replace(scriptRegExp, function (_, script) {
      var defer = when.defer();
      var fileName = toCamelCase(path.basename(file, '.jsx'));
      webpackConfig.entry = {};
      webpackConfig.output = {
        path: '/',
        filename: '[name].bundle.js',
        library: '[name]'
      };
      webpackConfig.externals.react = 'React';
      webpackConfig.externals['react/addons'] = 'React';
      webpackConfig.entry[fileName] = path.resolve('./', file);
      webpackConfig.plugins = webpackConfig.plugins.concat(
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.UglifyJsPlugin()
      );

      var compiler = webpack(webpackConfig);
      var fs = compiler.outputFileSystem = new MemoryFileSystem();

      compiler.plugin('done', function () {
        var compiledScript = fs.readFileSync(path.resolve('/', fileName + '.bundle.js'))
          .toString();

        var html = content.replace(script, [
          compiledScript,
          script
        ].join(';'));

        defer.resolve({
          code: script,
          html: html
        });
      });

      compiler.run(function (error, status) {
        if (error) {
          console.log(error, status);
        }
      });
      examples.push(defer.promise);
      return script;
    });

    return content;
  });

  return when.all(examples);
};

/**
 * Return function which will construct status object from
 * native status object
 * @param {string} path The file path
 * @return {Function} The status constructor function
 */
var getStats = function (path) {
  return function (stats) {
    return {
      isDirectory: stats.isDirectory(),
      path: path
    };
  };
};

/**
 * Read all files in parallel
 * And generate docObject
 * @param {Array} files The list of files from which will be extracted content
 * @return {Deferred}
 */
var getJSFiles = function (files) {
  return when.all(files.filter(function (file) {
    return /\.jsx$/.test(file);
  }).map(function (file) {
    return qfs.read(file).then(function (content) {
      return getExamples(content.toString(), file);
    }).then(function (examples) {
      docs.push({
        path: file,
        examples: examples
      });
    });
  }));
};

when(qfs.stat(componentDir), getStats(componentDir))
  .then(function (statsInfo) {
    if (statsInfo.isDirectory) {
      return when(qfs.listTree(statsInfo.path), getJSFiles);
    }

    return getJSFiles([statsInfo.path]);
  }).then(function () {

    console.log(indexHTMLTemplate({
      ReactWithAddonsScript: ReactWithAddonsScript,
      components: docs
    }));
  });
