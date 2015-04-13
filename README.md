---
collection: docs
title: Getting started
order: 1
---

# Ring UI library

## Development environment setup

1. Install Node.js

2. Install dependencies: `npm install`

3. (Optional, Mac Os X / Linux) Install [menu bar apps](https://github.com/roman01la/anybar-webpack#known-apps) to watch webpack build status.

## Available commands

Start server: `npm start` (runs webpack dev server on localhost:8080)

Run tests: `npm test`

Build production files: `npm run build`

Clean generated files: `npm run clean`


## Building on host project side:

1. Add JetBrains internal registry to .npmrc in your project folder:

```
echo 'registry = http://registry.npmjs.org' >> .npmrc
```

2. Install Ring UI with `npm install ring-ui --save-exact` 

3. Install webpack-config-merger to make working with webpack configs easier: `npm install webpack-config-merger --save-dev`

4. If your app builds with webpack, make sure to `require` ring-ui components where needed. Otherwise, create an entry point (for example, `/app/app__components.tpl.js`) and
`require` the components there. 

```
require('react-ng/react-ng')({
  QueryAssist: require('query-assist/query-assist'),
  Footer: require('footer/footer')
});

require('auth-ng/auth-ng');
require('shortcuts-ng/shortcuts-ng');
```

5. Create webpack.config.js with the following contents (example):

```
var webpackConfigMerger = require('webpack-config-merger');

var webpackOptions = webpackConfigMerger(require('ring-ui/webpack.config'), {
  entry: 'src/entry.js', // your entry point for webpack
  output: {
    path: 'path/to/dist',
    filename: '[name].js'
  }
});

module.exports = webpackOptions;
```

This reads Ring UI configuration and overrides some config params.

6. If your app builds with webpack, just build it. If you are using grunt, install `grunt-webpack` and configure it like this:

```js
 webpack: {
      dist: require('./webpack.config.js')
 }
```

## Is Lodash or Underscore available?

Ring UI uses [Moutjs](moutjs.com/docs/latest/) as the utility library. 


## Wallaby support

To enable wallaby.js test runner follow this steps:

1. Download and install wallaby.js webstorm plugin (http://wallabyjs.com/). You may have to leave your email in download section.
2. Setup wallaby run configuration in your webstorm.
3. Run it.
