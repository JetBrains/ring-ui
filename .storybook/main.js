import {createRequire} from 'node:module';
import {dirname, join, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

const require = createRequire(import.meta.url);
const path = require('path');
const webpack = require('webpack');

const ringConfig = require('../webpack.config').createConfig();

const pkgConfig = require('../package.json').config;

/* eslint-disable no-underscore-dangle */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
/* eslint-enable */

export default {
  stories: [
    // Make welcome stories default
    '../src/welcome.stories.tsx',
    '../src/**/!(template)*.mdx',
    '../src/**/!(template)*.stories.{js,ts,tsx}',
  ],

  features: {
    actions: false,
  },

  addons: ['@storybook/addon-docs', '@storybook/addon-a11y', '@storybook/addon-themes'],

  webpackFinal(config) {
    ringConfig.componentsPath.push(__dirname, path.resolve(__dirname, '../src'));

    const autoDocumentationRule = config.module.rules.find(rule => /react-docgen-loader\.js$/.test(rule.loader));
    const mdxRule = config.module.rules.find(
      rule =>
        rule.test.toString().startsWith('/\\.mdx') && rule.use?.some(u => u.loader?.includes('@storybook/addon-docs')),
    );

    config.module.rules = [
      ...ringConfig.config.module.rules,
      config.module.rules.find(rule => /react-docgen-loader\.js$/.test(rule.loader)),
      autoDocumentationRule,
      mdxRule,
      {
        test: /\.md$/,
        loader: 'raw-loader',
      },
      {
        test: /\.svg$/,
        loader: require.resolve('svg-inline-loader'),
        options: {removeSVGTagAttrs: false},
        include: [/@primer\/octicons/, /@jetbrains\/logos/],
      },
      {
        test: /\.png$/,
        type: 'asset/resource',
      },
      {test: /\.m?js$/, resolve: {fullySpecified: false}},
    ];

    config.resolve = {
      ...config.resolve,
      alias: {
        ...config.resolve?.alias,
        '@custom-docs': resolve(__dirname, './custom-docs'),
      },
    };

    const serverUri = pkgConfig.hub;
    const clientId = pkgConfig.clientId;
    const hubConfig = JSON.stringify({serverUri, clientId});

    config.plugins.push(new webpack.DefinePlugin({hubConfig}));

    return config;
  },

  framework: {
    name: getAbsolutePath('@storybook/react-webpack5'),
    options: {},
  },

  staticDirs: ['./custom-header/dist'],

  typescript: {
    reactDocgen: 'react-docgen',
  },
};

function getAbsolutePath(value) {
  return dirname(require.resolve(join(value, 'package.json')));
}
