# Ring UI library

## Development environment setup

1. Install Node.js

2. Install dependencies: `npm install`

3. (Optional, Mac Os X / Linux) Install [menu bar apps](https://github.com/roman01la/anybar-webpack#known-apps) to watch webpack build status.

## Available commands

Start server: `npm start` (runs webpack dev server on http://localhost:9999 by default, you might want to change it using `npm config set ring-ui:port <port>`)

Run tests: `npm test`

Build production files: `npm run build`

Clean generated files: `npm run clean`

## Contributing

1. Install Yeoman: `npm install yo -g`

2. Install Ring UI Yeoman generator: `npm install -g generator-ring`.

3. To add new block, go to components folder and type
  * For plain js block: `yo ring:plain`
  * For ReactJS block: `yo ring:jsx`
  * For AngularJS block: `yo ring:ng`
  It will ask for block name and then create block folder and files with block skeleton for you.
  
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

## How to create new project using Ring UI?

1. Install Yeoman: `npm install yo -g`

2. Install Ring UI yeoman generator: `npm i -g generator-ring`

3. Go to project root folder and type: `yo ring`. It will ask you about project 
name and desired frameworks (plain JS, ReactJS or AngularJS). Then it will create project skeleton
with testing infrastructure, webpack build configuration, ES6 support, ESLint and filled package.json dependencies.

4. Go to generated project folder, type `npm install` and then `npm start`. You project is ready to develop.

## Is Lodash or Underscore available?

Ring UI uses [Moutjs](moutjs.com/docs/latest/) as the utility library. 


## Wallaby support

To enable wallaby.js test runner follow this steps:

1. Download and install wallaby.js webstorm plugin (http://wallabyjs.com/). You may have to leave your email in download section.
2. Run wallaby in your webstorm.
