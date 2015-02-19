# Ring UI library

## Development environment setup

1. Install node.js

2. Install dependencies: `npm install`


## Avaiable commands

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

3. Install webpack-config-merger for simply work with config: `npm install webpack-config-merger --save-dev`

4. If your app builds with webpack, require ring-ui components where you need it. Otherwise, create entry point, `/app/app__components.tpl.js` for example.
Here require all components you need, example:

```
require('react-ng/react-ng')({
  QueryAssist: require('query-assist/query-assist'),
  Footer: require('footer/footer')
});

require('auth-ng/auth-ng');
require('shortcuts-ng/shortcuts-ng');
```

5. Create webpack.config.js with content (example):

```
var webpackConfigMerger = require('webpack-config-merger');

var webpackOptions = webpackConfigMerger(require('ring-ui/webpack.config'), {
  entry: 'src/entry.js', //your entry point for webpack
  output: {
    path: 'path/to/dist',
    filename: '[name].js'
  }
});

module.exports = webpackOptions;
```

Here you read ring-ui config and override some fields with your own.

6. If your app builds with webpack, just build it. If your use a grunt, install `grunt-webpack`, for example, and configure it just like this:

```js
 webpack: {
      dist: require('./webpack.config.js')
 }
```

## Lodash and underscore

[Moutjs](moutjs.com/docs/latest/) is used as utility library (instead of lodash or underscore). 
