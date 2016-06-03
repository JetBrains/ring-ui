/* eslint-disable modules/no-cjs */
/* eslint-disable strict */
'use strict';

const path = require('path');
const fs = require('fs');
const mixIn = require('mout/object/mixIn');

const Metalsmith = require('metalsmith');
const markdown = require('metalsmith-markdown');
const templates = require('metalsmith-templates');
const ignore = require('metalsmith-ignore');
const metallic = require('metalsmith-metallic');
const watch = require('metalsmith-watch');
const jsdoc = require('./metalsmith-jsdoc');
const collections = require('metalsmith-collections');
const filepath = require('metalsmith-filepath');
const replace = require('metalsmith-text-replace');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const webpackConfig = require('../webpack-docs.config.js');

const isServer = process.argv.includes('--server');
const publicPath = '/assets/';

function noop() {}

new Metalsmith(path.resolve(__dirname, '..')).
  source('./components').
  // Add README.md
  // Remove after https://github.com/segmentio/metalsmith/issues/50
  use((files, metalsmith, done) => {
    fs.readFile(path.resolve(__dirname, '..', 'README.md'), (err, contents) => {
      if (err) {
        throw err;
      }

      files['README.md'] = {
        contents,
        collection: 'docs',
        title: 'Getting Started',
        order: 1
      };

      done();
    });
  }).
  use(ignore([
    '**/*.svg',
    '**/*.png',
    '**/*.gif',
    '**/*.test.js',
    '**/*.html',
    '**/.*'
  ])).
  use(jsdoc({
    publicPath: `..${publicPath}`,
    tags: {
      example: require('./metalsmith-jsdoc-example-processor')
    }
  })).
  use(replace({
    '{**/,}*.md': {
      find: /[A-Z]+-\d+/g,
      replace(match, offset, string) {
        // Do not replace parts of links
        // like `[RG-640](https://youtrack.jetbrains.com/issue/RG-640)`
        const lookBehind = string.charAt(offset - 1); // eslint-disable-line no-magic-numbers

        if (lookBehind === '[' || lookBehind === '/') {
          return match;
        }

        return `[${match}](https://youtrack.jetbrains.com/issue/${match})`;
      }
    }
  })).
  use(metallic()).
  use(markdown({
    gfm: true,
    smartypants: true,
    tables: true
  })).
  use(collections({
    docs: {
      sortBy: 'order'
    },
    jsdoc: {
      sortBy: 'title',
      metadata: {
        title: 'Components'
      }
    }
  })).
  use(filepath({
    absolute: false
  })).
  use(templates({
    directory: 'site',
    engine: 'handlebars',
    pattern: '*.html',
    default: 'default.hbs'
  })).
  use(isServer ? watch() : noop).
  destination(path.resolve(__dirname, '..', 'docs')).
  build((err, files) => {
    if (err) {
      throw err;
    }

    const port = process.env.npm_package_config_port || require('../package.json').config.port;
    const serverUrl = `http://localhost:${port}`;

    Object.keys(files).forEach(fileName => {
      const file = files[fileName];

      if (file.webpack) {
        mixIn(webpackConfig.entry, file.webpack);
      }
    });

    const entries = Object.keys(webpackConfig.entry);

    if (isServer) {
      const webpackClient = [`webpack-dev-server/client?${serverUrl}`, 'webpack/hot/dev-server'];

      entries.forEach(entryName => {
        webpackConfig.entry[entryName] = webpackClient.concat(webpackConfig.entry[entryName]);
      });
    }

    console.log('Compiling %d components', entries.length);
    const compiler = webpack(webpackConfig);

    if (isServer) {
      new WebpackDevServer(compiler, {
        contentBase: path.resolve(__dirname, '..', 'docs'),
        hot: true,
        publicPath,
        stats: {
          assets: false,
          chunks: false,
          hash: false,
          children: false,
          version: false
        }
      }).listen(port, () => {
        console.log(`Server started on ${serverUrl}`);
      });
    } else {
      compiler.run(compileErr => {
        if (compileErr) {
          throw compileErr;
        }

        console.log('Successfully compiled');
      });
    }
  });
