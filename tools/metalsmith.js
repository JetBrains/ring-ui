/* eslint-env node */
/* eslint-disable no-console*/
var path = require('path');
var fs = require('fs');
var mixIn = require('mout/object/mixIn');

var isServer = process.argv.indexOf('--server') !== -1;
var noop = function noop() {};

var Metalsmith = require('metalsmith');
var markdown = require('metalsmith-markdown');
var templates = require('metalsmith-templates');
var ignore = require('metalsmith-ignore');
var metallic = require('metalsmith-metallic');
var watch = require('metalsmith-watch');
var jsdoc = require('./metalsmith-jsdoc');
var collections = require('metalsmith-collections');
var filepath = require('metalsmith-filepath');
var replace = require('metalsmith-text-replace');

var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var webpackConfig = require('../webpack-site.config');
var publicPath = '/assets/';

new Metalsmith(path.resolve(__dirname, '..'))
  .source('./components')
  // Add README.md
  // Remove after https://github.com/segmentio/metalsmith/issues/50
  .use(function (files, metalsmith, done) {
    fs.readFile(path.resolve(__dirname, '..', 'README.md'), function (err, contents) {
      if (err) {
        throw err;
      }

      files['README.md'] = {
        contents: contents,
        collection: 'docs',
        title: 'Getting Started',
        order: 1
      };

      done();
    });
  })
  .use(ignore([
    '**/*.svg',
    '**/*.png',
    '**/*.gif',
    '**/*.test.js',
    '**/*.html',
    '**/.*'
  ]))
  .use(jsdoc({
    publicPath: '..' + publicPath,
    tags: {
      example: require('./metalsmith-jsdoc-example-processor')
    }
  }))
  .use(replace({
    '{**/,}*.md': {
      find: /[A-Z]+-\d+/g,
      replace: function (match, offset, string) {
        // Do not replace parts of links
        // like `[RG-640](https://youtrack.jetbrains.com/issue/RG-640)`
        var lookBehind = string.charAt(offset - 1);
        if (lookBehind === '[' || lookBehind === '/') {
          return match;
        }

        return '[' + match + '](https://youtrack.jetbrains.com/issue/' + match + ')';
      }
    }
  }))
  .use(metallic())
  .use(markdown({
    gfm: true,
    smartypants: true,
    tables: true
  }))
  .use(collections({
    docs: {
      sortBy: 'order'
    },
    jsdoc: {
      sortBy: 'title',
      metadata: {
        title: 'Components'
      }
    }
  }))
  .use(filepath({
    absolute: false
  }))
  .use(templates({
    directory: 'site',
    engine: 'handlebars',
    pattern: '*.html',
    default: 'default.hbs'
  }))
  .use(isServer ? watch() : noop)
  .destination(path.resolve(__dirname, '..', 'docs'))
  .build(function (err, files) {
    if (err) {
      throw err;
    }

    var port = process.env.npm_package_config_port || require('../package.json').config.port;
    var serverUrl = 'http://localhost:' + port;

    Object.keys(files).forEach(function (fileName) {
      var file = files[fileName];

      if (file.webpack) {
        mixIn(webpackConfig.entry, file.webpack);
      }
    });

    var entries = Object.keys(webpackConfig.entry);

    if (isServer) {
      var webpackClient = ['webpack-dev-server/client?' + serverUrl, 'webpack/hot/dev-server'];

      entries.forEach(function (entryName) {
        webpackConfig.entry[entryName] = webpackClient.concat(webpackConfig.entry[entryName]);
      });
    }

    console.log('Compiling %d components', entries.length);
    var compiler = webpack(webpackConfig);

    if (isServer) {
      new WebpackDevServer(compiler, {
        contentBase: path.resolve(__dirname, '..', 'docs'),
        hot: true,
        publicPath: publicPath,
        quiet: true
      }).listen(port, function () {
        console.log('Server started on ' + serverUrl);
      });
    } else {
      compiler.run(function (compileErr) {
        if (compileErr) {
          throw compileErr;
        }

        console.log('Successfully compiled');
      });
    }
  });

