# Ring UI library

**See the [living style guide](https://hub.jetbrains.com/)**.

## Development environment setup

1. Install Node.js

2. Install dependencies: `npm install`

3. (Optional, Mac OS X / Linux) Install [status bar indicator application](https://github.com/roman01la/anybar-webpack#known-apps) to receive webpack build notifications.

## Available commands

Start the server: `npm start` (runs the webpack dev server on http://localhost:9999. You can change the port using `npm config set ring-ui:port <port>`)

Run tests: `npm test`

Lint code: `npm run lint`

Build production files: `npm run build`

## Contributing

1. Install Yeoman: `npm install yo -g`

2. Install Ring UI Yeoman generator: `npm install -g generator-ring`.

3. To add a new component, issue one of the following commands after changing to the `components` folder:
  * For a plain JS component: `yo ring:plain`
  * For a ReactJS component: `yo ring:jsx`
  * For an AngularJS component: `yo ring:ng`
  
It will ask for component name and then create the skeleton for you.
  
## Building on host project side

1. Add JetBrains internal registry to `.npmrc` in your project folder:

```
echo 'registry = http://registry.npmjs.org' >> .npmrc
```

2. Install Ring UI with `npm install ring-ui --save-exact` 

3. Install `webpack-config-merger` to make working with webpack configs easier: `npm install webpack-config-merger --save-dev`

4. If you are building your app with webpack, make sure to `require` ring-ui components where needed. Otherwise, create an entry point (for example, `/app/app__components.tpl.js`) and
`require` the components there. 

```
require('react-ng/react-ng')({
  QueryAssist: require('query-assist/query-assist'),
  Footer: require('footer/footer')
});

require('auth-ng/auth-ng');
require('shortcuts-ng/shortcuts-ng');
```

5. Create `webpack.config.js` with the following contents (example):

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

6. If you are building your app with webpack, run the build. If you are using grunt, install `grunt-webpack` and configure it like this:

```js
 webpack: {
      dist: require('./webpack.config.js')
 }
```

## Starting a new project with Ring UI

1. Install Yeoman: `npm install yo -g`

2. Install Ring UI yeoman generator: `npm i -g generator-ring`

3. Go to project root folder and type: `yo ring`. It will ask you to enter the name of the project
and desired frameworks (plain JS, ReactJS or AngularJS). It will then create a project skeleton
with testing infrastructure, webpack build configuration, ES6 support, ESLint and filled package.json dependencies.

4. Go to generated project folder, type `npm install` and then `npm start`. You project is ready to develop.

## Is Lodash or Underscore available?

Ring UI uses [Moutjs](http://moutjs.com/docs/latest/) as the utility library. 


## Wallaby support

To enable the `Wallaby.js` test runner follow these steps:

1. Download and install the [Wallaby.js plugin](http://wallabyjs.com/) for WebStorm.
2. Run shared `Wallaby` configuration in WebStorm.
