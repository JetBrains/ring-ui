---
title: Development
category: Docs
order: 2
---

### Environment setup

1. (macOS only) Install Xcode Command Line Tools: `xcode-select --install`
2. Install Node.js
3. Install dependencies: `npm install`
4. (Optional, macOS and Linux) Install the [status bar indicator](https://github.com/roman01la/anybar-webpack#known-apps) app to receive webpack build notifications.

### Available commands

Bootstrap the sub-packages: `npm run bootstrap` (should be done before anything else)

To start the server: `npm start` (runs the webpack dev server on http://localhost:9999)

To run tests: `npm test`

To lint code: `npm run lint`

To build production files: `npm run build`

### Settings

By default, documentation is built using `development` environment.
Use the `--env.production` flag to switch it to `production`.
Environment has an effect on source map generation, it also affects the following parameters:

 * **port**
 * **host**
 * **hub** (Hub server URI)
 * **clientId** (Ring UI service client ID in Hub)

You can change them by the following means (in order of precedence):

1. Command line switch: `npm <start|run build> -- --env.<param> <value>`
Example: `npm start -- --env.port 8765`
2. Persistently using NPM: `npm config set ring-ui:<param> <value>`
Example: `npm config set ring-ui:port 8765`
3. Persistently for a given environment: `npm config set ring-ui:<environment>:<param> <value>`  
Example: `npm config set ring-ui:development:port 8765`

### Contributing

To add a new component, issue one of the following commands after changing to the `components` folder:
  * For a plain ES6 component: `npm run component:es6`
  * For a ReactJS component: `npm run component:react`
  * For an AngularJS component: `npm run component:ng`
  
It will ask for component name and then create the skeleton for you.

### Is Lodash or Underscore available?

Instead of utility libraries Ring UI uses new features of *ES2015* and beyond provided by [Babel.js](https://babeljs.io) and [core-js](https://github.com/zloirock/core-js/).
Polyfills like `Array.prototype.find` that patch native objects should be imported manually (e.g. via `import 'core-js/modules/es6.array.find';`).

### Is jQuery available?

Instead of jQuery Ring UI uses modern DOM APIs, [DOM 4 polyfill](https://github.com/WebReflection/dom4) (should be imported via `import 'dom4';`) 
and some handy helpers located in the `dom` component. `jqLite` is still available for Angular.js components, however, using it is not recommended.

### Wallaby support

To enable the `Wallaby.js` test runner follow these steps:
 
1. Download and install the [Wallaby.js plugin](http://wallabyjs.com/) for WebStorm.
2. Make sure Node.js is available at `/usr/local/bin/node`, if not – create a symlink.  
3. Run the `Wallaby` configuration in WebStorm.

### Visual regression testing

**Run the development server with `npm start` before executing the commands listed below**

Ring UI uses [Gemini](https://ru.bem.info/tools/testing/gemini) for visual regression testing. Gemini works
by taking "screenshots" and comparing them to existing reference images. After you make some visual changes, 
run `npm run gemini-test` to make sure there are no regressions.

To update the reference images for a certain component (for example, `alert`) run 
`npm run gemini-gather components/alert/*.gemini.js`.
