/* eslint-env node */
var path = require('path');

var Metalsmith = require('metalsmith');
var markdown = require('metalsmith-markdown');
var templates = require('metalsmith-templates');
var ignore = require('metalsmith-ignore');
var metallic = require('metalsmith-metallic');
var assets = require('metalsmith-static');
var watch = require('metalsmith-watch');
var jsdoc = require('./metalsmith-jsdoc');

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
  .use(jsdoc())
  .use(metallic())
  .use(markdown({
    gfm: true,
    smartypants: true,
    tables: true
  }))
  .use(templates({
    engine: 'handlebars',
    pattern: '*html',
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
    }
  ]))
  .use(watch())
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
    }).concat({
      entry: ['webpack-dev-server/client?http://localhost:' + port],
      output: {
        path: path.resolve('..', 'docs', 'assets'),
        filename: 'utils.js'
      }
    });

    // Start a webpack-dev-server
    new WebpackDevServer(webpack(webpackEntries), {
      contentBase: path.resolve('..', 'docs'),
      //hot: true,
      stats: {
        colors: true
      }
    }).listen(port);
  });

