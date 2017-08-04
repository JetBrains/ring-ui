# Ring UI — JetBrains Web UI components [![Build Status][ci-img]][ci] [![Dependencies Status][deps-img]][deps] [![Dev Dependencies Status][dev-deps-img]][dev-deps] [![NPM version][npm-version-img]][npm-package] [![NPM downloads][npm-count-img]][npm-package]

This collection of UI components aims to provide all of the necessary building 
blocks for web-based products built inside JetBrains, as well as third-party 
plugins developed for JetBrains' products.

### Quick start

1. Install Yeoman and Ring UI generator: `npm install -g yo @jetbrains/generator-ring-ui`
2. Go to the root directory of your project (create one if necessary) and run `yo @jetbrains/ring-ui`. After you enter the name of the project all the necessary npm dependencies will be installed.
3. You project is ready to be developed. The following commands are available:
   - `npm start` to run a local development server
   - `npm test` to launch karma tests
   - `npm run lint` to lint your code
   - `npm run build` to build a production bundle
   - `npm run create-component` to create a new component template with styles and tests

### Not-so-quick start

In case boilerplate generators are not your thing and you prefer to understand the inner workings a bit better.

1. Install Ring UI with `npm install @jetbrains/ring-ui --save-exact` 

2. If you are building your app with webpack, make sure to `import` ring-ui components where needed. Otherwise, create an entry point (for example, `/app/app__components.tpl.js`) and
`import` the components there. 
   ``` javascript
   import React from 'react';
   import ReactDOM from 'react-dom';
   import LoaderInline from '@jetbrains/ring-ui/components/loader-inline/loader-inline';
   
   ReactDOM.render(<LoaderInline/>, document.getElementById('container'));
   ```

3. Create `webpack.config.js` with the following contents (example):
   ``` javascript
   const ringConfig = require('@jetbrains/ring-ui/webpack.config').config;
   
   const webpackConfig = {
     entry: 'src/entry.js', // your entry point for webpack
     output: {
       path: 'path/to/dist',
       filename: '[name].js'
     },
     module: {
       rules: [
         ...ringConfig.module.rules,
         <Your rules here>
       ]
     }
   };
   
   module.exports = webpackConfig;
   ```

### Links

- [Living style guide](http://www.jetbrains.org/ring-ui/)
- [GitHub repository](https://github.com/JetBrains/ring-ui)
- [Issues in YouTrack](https://youtrack.jetbrains.com/issues/RG)
- [Code review in Upsource](https://upsource.jetbrains.com/ring-ui/view)
- [Builds in TeamCity][ci]
- [npm package][npm-package]

[ci]: https://teamcity.jetbrains.com/project.html?projectId=JetBrainsUi_RingUi&tab=projectOverview
[ci-img]:  https://teamcity.jetbrains.com/app/rest/builds/buildType:JetBrainsUi_RingUi_Build/statusIcon.svg
[deps]: https://david-dm.org/jetbrains/ring-ui
[deps-img]: https://img.shields.io/david/jetbrains/ring-ui.svg
[dev-deps]: https://david-dm.org/jetbrains/ring-ui?type=dev
[dev-deps-img]: https://img.shields.io/david/dev/jetbrains/ring-ui.svg
[npm-package]: https://www.npmjs.com/package/@jetbrains/ring-ui
[npm-version-img]: https://img.shields.io/npm/v/@jetbrains/ring-ui.svg
[npm-count-img]: https://img.shields.io/npm/dt/@jetbrains/ring-ui.svg
