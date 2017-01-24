---
title: Getting Started
category: Docs 
order: 1
---

# Ring UI library

**See the [living style guide](http://ring-ui.github.io)**.

## Development environment setup

1. (macOS only) Install Xcode Command Line Tools: `xcode-select --install`

2. Install Node.js

3. Install dependencies: `npm install`

4. (Optional, macOS and Linux) Install the [status bar indicator](https://github.com/roman01la/anybar-webpack#known-apps) app to receive webpack build notifications.

## Available commands

To start the server: `npm start` (runs the webpack dev server on http://localhost:9999)

To run tests: `npm test`

To lint code: `npm run lint`

To build production files: `npm run build`

#### Settings

By default documenation configuration uses `development` environment.
Use `--env.production` flag to switch it to `production`.
Environment has effect on source-map generation mode and parameters below:

 * **port**
 * **host**
 * **hub** (Hub server URI)
 * **clientId** (Ring UI service client id in Hub)

You can chage them by following means (in order of precedence):

1. Command line syntax: `npm <start|run build> -- --env.<param> <value>`
Example: `npm start -- --env.port 8765`

2. Local persistent settings using npm: `npm config set ring-ui:<param> <value>`
Example: `npm config set ring-ui:port 8765`

3. Local persistent settings for selected environment: `npm config set ring-ui:<environment>:<param> <value>`  
Example: `npm config set ring-ui:development:port 8765`


## Contributing

To add a new component, issue one of the following commands after changing to the `components` folder:
  * For a plain ES6 component: `npm run component:es6`
  * For a ReactJS component: `npm run component:react`
  * For an AngularJS component: `npm run component:ng`
  
It will ask for component name and then create the skeleton for you.
  
## Building on host project side

1. Add the JetBrains internal registry to `.npmrc` in your project folder:

``` shell
echo 'registry = http://registry.npmjs.org' >> .npmrc
```

2. Install Ring UI with `npm install ring-ui --save-exact` 

3. Install `webpack-config-merger` to make working with webpack configs easier: `npm install webpack-config-merger --save-dev`

4. If you are building your app with webpack, make sure to `require` ring-ui components where needed. Otherwise, create an entry point (for example, `/app/app__components.tpl.js`) and
`require` the components there. 

``` javascript
require('ring-ui/components/react-ng/react-ng')({
  QueryAssist: require('ring-ui/components/query-assist/query-assist'),
  Footer: require('ring-ui/components/footer/footer')
});

require('ring-ui/components/auth-ng/auth-ng');
require('ring-ui/components/shortcuts-ng/shortcuts-ng');
```

5. Create `webpack.config.js` with the following contents (example):

``` javascript
var webpackConfigMerger = require('webpack-config-merger');

var webpackOptions = webpackConfigMerger(require('ring-ui').config, {
  entry: 'src/entry.js', // your entry point for webpack
  output: {
    path: 'path/to/dist',
    filename: '[name].js'
  }
});

module.exports = webpackOptions;
```

This reads Ring UI configuration and overrides some config params.

## Starting a new project with Ring UI

1. Install Yeoman: `npm install yo -g`

2. Install Ring UI yeoman generator: `npm i -g generator-ring-ui`

3. Go to project root folder and type: `yo ring-ui`. It will ask you to enter the name of the project
and desired frameworks (plain JS, ReactJS or AngularJS). It will then create a project skeleton
with testing infrastructure, webpack build configuration, ES6 support, ESLint and the required package.json dependencies.

4. Go to the generated project folder and run `npm install` followed by `npm start`. You project is ready to be developed.

## Is Lodash or Underscore available?

Instead of utility libraries Ring UI uses new features of *ES2015* and beyond provided by [Babel.js](https://babeljs.io) and [core-js](https://github.com/zloirock/core-js/).
Polyfills like `Array.prototype.find` that patch native objects should be imported manually (e.g. via `import 'core-js/modules/es6.array.find';`).

## Is jQuery available?

Instead of jQuery Ring UI uses modern DOM APIs, [DOM 4 polyfill](https://github.com/WebReflection/dom4) (should be imported via `import 'dom4';`) 
and some handy helpers located in the `dom` component. `jqLite` is still available for Angular.js components, however, using it is not recommended.

## Wallaby support

To enable the `Wallaby.js` test runner follow these steps:
 
1. Download and install the [Wallaby.js plugin](http://wallabyjs.com/) for WebStorm.
2. Make sure Node.js is available at `/usr/local/bin/node`, if not – create a symlink.  
3. Run the `Wallaby` configuration in WebStorm.


## Visual regression testing

#### Note: you should have the development server running before executing the commands below (`npm start`)

Ring UI uses [Gemini](https://ru.bem.info/tools/testing/gemini) for visual regression testing. Gemini works
by taking "screenshots" and comparing them to existing reference images. After you make some visual changes, 
run `npm run gemini-test` to make sure there are no regressions.

To update the reference images for a certain component (for example, `alert`) run 
`npm run gemini-gather components/alert/*.gemini.js`.
