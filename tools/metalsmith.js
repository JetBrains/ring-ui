/* eslint-env node */
var path = require('path');
var server = process.argv.indexOf('--server') !== -1;
var noop = function noop() {};

var Metalsmith = require('metalsmith');
var markdown = require('metalsmith-markdown');
var templates = require('metalsmith-templates');
var ignore = require('metalsmith-ignore');
var metallic = require('metalsmith-metallic');
var assets = require('metalsmith-static');
var watch = require('metalsmith-watch');
var jsdoc = require('./metalsmith-jsdoc');
var collections = require('metalsmith-collections');
var filepath = require('metalsmith-filepath');

var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var webpackConfig = require('../webpack.config');

new Metalsmith(path.resolve(__dirname, '..'))
  .source('./components')
  .use(ignore([
    '**/*.svg',
    '**/*.png',
    '**/*.gif',
    '**/*.test.js',
    '**/*.html',
    '**/.*'
  ]))
  .use(jsdoc({
    tags: {
      example: require('./metalsmith-jsdoc-example-processor')
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
    engine: 'handlebars',
    pattern: '*.html',
    default: 'default.hbs'
  }))
  .use(assets([
    {
      src: 'node_modules/github-markdown-css/github-markdown.css',
      dest: 'assets/github-markdown.css'
    },
    {
      src: 'node_modules/highlight.js/styles/github.css',
      dest: 'assets/github.css'
    },
    {
      src: 'tools/favicon.ico',
      dest: 'favicon.ico'
    }
  ]))
  .use(server ? watch() : noop)
  .destination(path.resolve(__dirname, '..', 'docs'))
  .build(function (err) {
    if (err) {
      throw err;
    }

    var port = process.env.npm_package_config_port || require('../package.json').config.port;

    var metadata = this.metadata();
    var webpackEntries = metadata.webpackEntries.map(function (entry) {
      var config = entry;
      config.devtool = 'eval';
      config.debug = true;
      config.module = webpackConfig.module;
      config.resolve = webpackConfig.resolve;
      config.resolveLoader = webpackConfig.resolveLoader;

      return config;
    });

    console.log('Compiling %d components', webpackEntries.length);

    if (server) {
      var serverUrl = 'http://localhost:' + port;

      webpackEntries.push({
        entry: ['webpack-dev-server/client?' + serverUrl],
        output: {
          path: path.resolve(__dirname, '..', 'docs', 'assets'),
          filename: 'utils.js'
        }
      });
    }

    var compiler = webpack(webpackEntries);

    if (server) {
      new WebpackDevServer(compiler, {
        contentBase: path.resolve(__dirname, '..', 'docs'),
        // To be enabled after move to webpack entries instead of milti-compiler
        //hot: true,
        stats: {
          colors: true
        }
      }).listen(port, function () {
          console.log('Server started on ' + serverUrl);
        });
    } else {
      compiler.run(function(compileErr) {
        if (compileErr) {
          throw compileErr;
        }

        console.log('Successfully compiled');
      });
    }
  });

