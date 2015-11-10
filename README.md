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
require('ring-ui/components/react-ng/react-ng')({
  QueryAssist: require('ring-ui/components/query-assist/query-assist'),
  Footer: require('ring-ui/components/footer/footer')
});

require('ring-ui/components/auth-ng/auth-ng');
require('ring-ui/components/shortcuts-ng/shortcuts-ng');
```

5. Create `webpack.config.js` with the following contents (example):

```
var webpackConfigMerger = require('webpack-config-merger');

var webpackOptions = webpackConfigMerger(require('ring-ui'), {
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

2. Install Ring UI yeoman generator: `npm i -g generator-ring`

3. Go to project root folder and type: `yo ring`. It will ask you to enter the name of the project
and desired frameworks (plain JS, ReactJS or AngularJS). It will then create a project skeleton
with testing infrastructure, webpack build configuration, ES6 support, ESLint and filled package.json dependencies.

4. Go to generated project folder, type `npm install` and then `npm start`. You project is ready to develop.

## Is Lodash or Underscore available?

Instead of libraries Ring UI uses new features of *ES2015* and beyond provided by [Babel.js](https://babeljs.io) and [core-js](https://github.com/zloirock/core-js/).
Polyfills like `Array.prototype.find` that patch native objects should be imported manually (e.g. via `import 'core-js/modules/es6.array.find';`).

## Is jQuery available?

Instead of jQuery Ring UI uses modern DOM APIs, [DOM 4 polyfill](https://github.com/WebReflection/dom4) (should be imported via `import 'dom4;'`) 
and some handy helpers located in `dom` component. `jqLite` is still available for Angular.js components, however its usage is not recommended.


## Wallaby support

To enable the `Wallaby.js` test runner follow these steps:

1. Download and install the [Wallaby.js plugin](http://wallabyjs.com/) for WebStorm.
2. Run shared `Wallaby` configuration in WebStorm.


## Visual regression testing

#### Note: you should have the development server running before executing the commands below (`npm start`)

Ring UI uses [Gemini](https://ru.bem.info/tools/testing/gemini) for visual regression testing. Gemini works
by taking "screenshots" and comparing them to existing reference images. After you make some visual changes, 
run `npm run gemini-test` to make sure there are no regressions.

To update the reference images for a certain component (for example, `alert`) run 
`npm run gemini-gather files components/alert/*.gemini.js`.
