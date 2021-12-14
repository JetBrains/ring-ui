# Ring UI — JetBrains Web UI components
[![Storybook][storybook-img]][docsite] [![Build Status][ci-img]][ci-bt] [![Storybook][browserstack-img]][browserstack-build-page] [![Dependencies Status][deps-img]][deps] [![Dev Dependencies Status][dev-deps-img]][dev-deps] [![NPM version][npm-version-img]][npm-package] [![NPM downloads][npm-count-img]][npm-package]

[![official JetBrains project](https://jb.gg/badges/official-flat-square.svg)](https://confluence.jetbrains.com/display/ALL/JetBrains+on+GitHub)

This collection of UI components aims to provide all the necessary building blocks for web-based products built inside JetBrains, as well as third-party plugins developed for JetBrains' products.

## Try now
* Try the [codesandbox](https://codesandbox.io/s/ring-ui-sandbox-wrigs), based on `create-react-app` tooling, to see and try the UI components
* Check out [list of examples](https://jetbrains.github.io/ring-ui/master/index.html) for each component

## Installation

`npm install @jetbrains/ring-ui`

### Quick start

The easiest way is to import necessary components as ES modules:
```js
// You need to import RingUI styles once
import '@jetbrains/ring-ui/dist/style.css';

import alertService from '@jetbrains/ring-ui/dist/alert-service/alert-service';
import Button from '@jetbrains/ring-ui/dist/button/button';

...

export const Demo = () => {
  return (
    <Button onClick={() => alertService.successMessage('Hello world')}>
      Click me
    </Button>
  );
};

```

The bundle size will depend on the amount of components you imported.

### Generating app (deprecated)

1. Install Yeoman and Ring UI generator: `npm install -g yo@next-4 @jetbrains/generator-ring-ui`
2. Go to the root directory of your project (create one if necessary), run `yo @jetbrains/ring-ui` and enter the name of the project. Then run `npm install` to install all the necessary npm dependencies.
3. Your project is ready to be developed. The following commands are available:
  - `npm start` to run a local development server
  - `npm test` to launch karma tests
  - `npm run lint` to lint your code
  - `npm run build` to build a production bundle
  - `npm run create-component` to create a new component template with styles and tests

### Building Ring UI from source via Webpack

In case you have complex build, and you want to compile RingUI sources together with your sources
in a same build process, you can use the following configuration:

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

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md)

## Links

- [Living style guide][docsite]
- [GitHub repository](https://github.com/JetBrains/ring-ui)
- [Issues in YouTrack](https://youtrack.jetbrains.com/issues/RG)
- [Code review in Upsource](https://upsource.jetbrains.com/ring-ui/view)
- [Builds in TeamCity][ci-project]
- [npm package][npm-package]

[docsite]: https://jetbrains.github.io/ring-ui
[ci-project]: https://teamcity.jetbrains.com/project.html?projectId=JetBrainsUi_RingUi&tab=projectOverview
[ci-bt]: https://teamcity.jetbrains.com/viewType.html?buildTypeId=JetBrainsUi_RingUi_GeminiTests&tab=buildTypeStatusDiv
[ci-img]:  https://teamcity.jetbrains.com/app/rest/builds/buildType:JetBrainsUi_RingUi_GeminiTests/statusIcon.svg
[deps]: https://david-dm.org/jetbrains/ring-ui
[deps-img]: https://img.shields.io/david/jetbrains/ring-ui.svg
[dev-deps]: https://david-dm.org/jetbrains/ring-ui?type=dev
[dev-deps-img]: https://img.shields.io/david/dev/jetbrains/ring-ui.svg
[npm-package]: https://www.npmjs.com/package/@jetbrains/ring-ui
[npm-version-img]: https://img.shields.io/npm/v/@jetbrains/ring-ui.svg
[npm-count-img]: https://img.shields.io/npm/dt/@jetbrains/ring-ui.svg
[storybook-img]: https://cdn.jsdelivr.net/gh/storybookjs/brand@master/badge/badge-storybook.svg
[browserstack-img]: https://automate.browserstack.com/badge.svg?badge_key=elc3S1IvemtCdHBjcHdmQzdRcm9xYWxTakFvSWFqT2lrOGtrTjZRbFVRaz0tLXE0VnpyUjRqSk1Xc2xIQ1NnL1pkbnc9PQ==--f96a555ca0fe3ce50d0770cb975be0f3b6a6cf79
[browserstack-build-page]: https://automate.browserstack.com/public-build/elc3S1IvemtCdHBjcHdmQzdRcm9xYWxTakFvSWFqT2lrOGtrTjZRbFVRaz0tLXE0VnpyUjRqSk1Xc2xIQ1NnL1pkbnc9PQ==--f96a555ca0fe3ce50d0770cb975be0f3b6a6cf79
