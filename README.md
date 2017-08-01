---
title: Getting Started
category: Docs 
order: 1
---

[Living style guide](http://jetbrains.github.io/ring-ui) is available.

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
2. Install `webpack-config-merger` to make working with webpack configs easier: `npm install webpack-config-merger --save-dev`
3. If you are building your app with webpack, make sure to `import` ring-ui components where needed. Otherwise, create an entry point (for example, `/app/app__components.tpl.js`) and
`import` the components there. 
   ``` javascript
   import React from 'react';
   import ReactDOM from 'react-dom';
   import LoaderInline from '@jetbrains/ring-ui/components/loader-inline/loader-inline';
   
   ReactDOM.render(<LoaderInline/>, document.getElementById('container'));
   ```
4. Create `webpack.config.js` with the following contents (example):
   ``` javascript
   var webpackConfigMerger = require('webpack-config-merger');
   
   var webpackOptions = webpackConfigMerger(require('@jetbrains/ring-ui/webpack.config').config, {
     entry: 'src/entry.js', // your entry point for webpack
     output: {
       path: 'path/to/dist',
       filename: '[name].js'
     }
   });
   
   module.exports = webpackOptions;
   ```

   This reads Ring UI configuration and overrides some config params.
