# Ring UI — JetBrains Web UI components
[![Storybook][storybook-img]][docsite] [![Build Status][ci-img]][ci-bt] [![Storybook][browserstack-img]][browserstack-build-page] [![NPM version][npm-version-img]][npm-package] [![NPM downloads][npm-count-img]][npm-package]

[![official JetBrains project](https://jb.gg/badges/official-flat-square.svg)](https://github.com/JetBrains#jetbrains-on-github)

- [Design guildelines](https://www.jetbrains.com/help/ring-ui/welcome.html)
- [Usage examples in Storybook][docsite]
- [GitHub repository](https://github.com/JetBrains/ring-ui)
- [Issues in YouTrack](https://youtrack.jetbrains.com/issues/RG)
- [Builds in TeamCity][ci-project]
- [npm package][npm-package]

This collection of UI components aims to provide all the necessary building blocks for web-based products built inside JetBrains, as well as third-party plugins developed for JetBrains' products.

## Try now
* Try the [codesandbox](https://codesandbox.io/p/sandbox/ring-ui-7-0-demo-z6v6ym), based on `create-react-app` tooling, to see and try the UI components
* Check out [list of examples](https://jetbrains.github.io/ring-ui/master/index.html) for each component
* Check out [Ring UI Design Guidelines](http://www.jetbrains.com/help/ring-ui)

## Installation

* For Quick Start, use pre-built version: 
  `npm install @jetbrains/ring-ui-built`
* For complex projects, use "sources" version
  `npm install @jetbrains/ring-ui`
  You will then need to include building Ring UI into your WebPack build (see "Building Ring UI from source via Webpack" below)

### Quick start

The easiest way is to import necessary components as ES modules:
```js
// You need to import RingUI styles once
import '@jetbrains/ring-ui-built/components/style.css';

import alertService from '@jetbrains/ring-ui-built/components/alert-service/alert-service';
import Button from '@jetbrains/ring-ui-built/components/button/button';

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

[docsite]: https://jetbrains.github.io/ring-ui
[ci-project]: https://teamcity.jetbrains.com/project.html?projectId=JetBrainsUi_RingUi&tab=projectOverview
[ci-bt]: https://teamcity.jetbrains.com/viewType.html?buildTypeId=JetBrainsUi_RingUi_GeminiTests&tab=buildTypeStatusDiv
[ci-img]:  https://teamcity.jetbrains.com/app/rest/builds/buildType:JetBrainsUi_RingUi_GeminiTests/statusIcon.svg
[npm-package]: https://www.npmjs.com/package/@jetbrains/ring-ui
[npm-version-img]: https://img.shields.io/npm/v/@jetbrains/ring-ui.svg
[npm-count-img]: https://img.shields.io/npm/dt/@jetbrains/ring-ui.svg
[storybook-img]: https://cdn.jsdelivr.net/gh/storybookjs/brand@master/badge/badge-storybook.svg
[browserstack-img]: https://automate.browserstack.com/badge.svg?badge_key=elc3S1IvemtCdHBjcHdmQzdRcm9xYWxTakFvSWFqT2lrOGtrTjZRbFVRaz0tLXE0VnpyUjRqSk1Xc2xIQ1NnL1pkbnc9PQ==--f96a555ca0fe3ce50d0770cb975be0f3b6a6cf79
[browserstack-build-page]: https://automate.browserstack.com/public-build/elc3S1IvemtCdHBjcHdmQzdRcm9xYWxTakFvSWFqT2lrOGtrTjZRbFVRaz0tLXE0VnpyUjRqSk1Xc2xIQ1NnL1pkbnc9PQ==--f96a555ca0fe3ce50d0770cb975be0f3b6a6cf79
