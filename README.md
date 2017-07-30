---
title: Getting Started
category: Docs 
order: 1
---

[Living style guide](http://ring-ui.github.io) is available.

### Quick start

1. Install Yeoman and Ring UI generator: `npm install -g yo generator-ring-ui`
2. Go to project root folder (create it if necessary) and type: `yo ring-ui`. It will ask you to enter the name of the project and run `npm install` for you
3. You project is ready to be developed. The following commands are available:
   - `npm start` to run a local development server
   - `npm test` to launch karma tests
   - `npm run lint` to lint your code
   - `npm run build` to build a production bundle
   - `npm run create-component` to create a new component template with styles and tests

### Slow start

1. Add the JetBrains internal registry to `.npmrc` in your project folder:
   ``` shell
   echo 'registry = http://registry.npmjs.org' >> .npmrc
   ```
2. Install Ring UI with `npm install ring-ui --save-exact` 
3. Install `webpack-config-merger` to make working with webpack configs easier: `npm install webpack-config-merger --save-dev`
4. If you are building your app with webpack, make sure to `import` ring-ui components where needed. Otherwise, create an entry point (for example, `/app/app__components.tpl.js`) and
`import` the components there. 
   ``` javascript
   import React from 'react';
   import ReactDOM from 'react-dom';
   import LoaderInline from 'ring-ui/components/loader-inline/loader-inline';
   
   ReactDOM.render(<LoaderInline/>, document.getElementById('container'));
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
