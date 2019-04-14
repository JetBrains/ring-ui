require('core-js/stable');
require('regenerator-runtime/runtime');

const path = require('path');

const webpack = require('webpack');
const {DllBundlesPlugin} = require('webpack-dll-bundles-plugin');
const webpackConfig = require('@jetbrains/ring-ui/webpack.config');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const pkgConfig = require('./package.json').config;
const docpackSetup = require('./webpack-docs-plugin.setup');
const createEntriesList = require('./create-entries-list');

// Borrowed from webpack-dev-server
const colorInfo = msg => `\u001b[1m\u001b[34m${msg}\u001b[39m\u001b[22m`;

const ringUiPath = path.dirname(
  require.resolve('@jetbrains/ring-ui/package.json')
);
const publicPath = '/';
const distDir = 'dist';
const contentBase = path.resolve(__dirname, distDir);
const siteComponents = path.resolve(__dirname, 'components');

// For docs-app entry point
webpackConfig.componentsPath.push(siteComponents);
webpackConfig.loaders.svgInlineLoader.include.push(
  require('@jetbrains/logos'),
  path.dirname(require.resolve('octicons/package.json'))
);

module.exports = (env = {}) => {
  const {server, production} = env;
  const envString = production ? 'production' : 'development';
  const envDefinition = {
    'process.env': {
      NODE_ENV: JSON.stringify(envString)
    }
  };
  const devtool = production ? false : 'cheap-eval-source-map';
  const dllPath = `dll-${envString}`;
  const optimizePlugins = production
    ? [
      new webpack.DefinePlugin(envDefinition),
      new webpack.optimize.UglifyJsPlugin(),
      new webpack.LoaderOptionsPlugin({
        minimize: true
      })
    ]
    : [];

  const exampleCssPattern = /example?\.css$/;
  const [, ...cssLoader] = webpackConfig.loaders.cssLoader.use;
  // Patch cssLoader to avoid using it on examples' styles
  webpackConfig.loaders.cssLoader.exclude = exampleCssPattern;
  const extractCSS = new ExtractTextPlugin('examples/[name]/[hash].css');
  const extractHTML = new ExtractTextPlugin('examples/[name]/[hash].html');

  const getParam = name => (
    env[name] ||
    process.env[`npm_package_config_${name}`] ||
    process.env[`npm_package_config_${envString}_${name}`] ||
    pkgConfig[name] ||
    pkgConfig[envString][name]
  );

  const port = Number(getParam('port'));
  const host = getParam('host');
  const serverUri = getParam('hub');
  const clientId = getParam('clientId');

  console.log(`Hub server used is ${colorInfo(serverUri)}`);
  const hubConfig = JSON.stringify({serverUri, clientId});

  const docsWebpackConfig = {
    entry: {
      components: createEntriesList(path.join(ringUiPath, 'components/*')),
      'docs-app': siteComponents,
      'example-common': path.join(siteComponents, 'example-common'),
      favicon: `file-loader?name=favicon.ico!${require.resolve('./favicon.ico')}`
    },
    resolve: {
      mainFields: ['module', 'browser', 'main'],
      modules: [path.resolve(ringUiPath, 'node_modules')],
      // needed in examples
      alias: {
        '@ring-ui/docs': __dirname,
        '@jetbrains/logos': require('@jetbrains/logos'),
        '@jetbrains/ring-ui': ringUiPath
      }
    },
    context: ringUiPath,
    module: {
      rules: [
        ...webpackConfig.config.module.rules,
        // HTML examples
        {
          test: /example\.html$/,
          use: extractHTML.extract({
            use: webpackConfig.loaders.htmlLoader.loader
          })
        },
        // CSS examples
        {
          test: exampleCssPattern,
          use: extractCSS.extract({
            // no need to emit results, we inline them manually in twig template
            disable: true,
            use: cssLoader
          })
        },
        // twig templates
        {
          test: /\.twig$/,
          loader: 'twig-loader'
        }
      ]
    },
    devtool,
    devServer: {
      host,
      port,
      contentBase,
      stats: {
        assets: false,
        chunks: false,
        hash: false,
        children: 'error',
        version: false
      }
    },
    output: {
      path: contentBase,
      pathinfo: server,
      filename: '[name].js',
      publicPath // serve HMR update jsons properly
    },
    node: {
      Buffer: false,
      process: 'mock'
    },
    stats: {
      reasons: true
    },
    plugins: [
      ...optimizePlugins,
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
      new webpack.IgnorePlugin(/^esprima$/),
      new webpack.IgnorePlugin(/^buffer$/), // for some reason node.Buffer = false doesn't work properly
      new webpack.DefinePlugin({hubConfig}),
      docpackSetup(dllPath),
      extractCSS,
      extractHTML,
      new DllBundlesPlugin({
        bundles: {
          vendor: [
            'core-js',
            'regenerator-runtime',
            'dom4',
            'whatwg-fetch',
            'react',
            'react-dom',
            'prop-types',
            'react-waypoint',
            'angular',
            'classnames',
            'combokeys',
            'moment',
            'simply-uuid',
            'sniffr'
          ]
        },
        dllDir: path.join(contentBase, dllPath),
        webpackConfig: {
          devtool,
          module: {
            rules: [
              webpackConfig.loaders.whatwgLoader
            ]
          },
          plugins: optimizePlugins // DllBundlesPlugin will set the DllPlugin here
        }
      })
    ]
  };

  return docsWebpackConfig;
};
