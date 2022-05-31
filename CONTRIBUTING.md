### Environment setup

1. (macOS only) Install Xcode Command Line Tools: `xcode-select --install`
2. Install Node.js@16. We suggest using NVM for Node version management

### Available commands

To start the server: `npm start` (runs the webpack dev server on http://localhost:9999)

To run tests: `npm test`

To lint code: `npm run lint`

To build production files: `npm run build`

### Settings

By default, documentation is built using the `development` environment. Use the `--env.production` flag to switch it to `production`. Environment has an effect on source map generation. It also affects the following parameters:

 * **port**
 * **host**
 * **hub** (Hub server URI)
 * **clientId** (Ring UI service client ID in Hub)

### Contributing

To add a new component, issue one of the following commands after changing to the `components` directory:
  * For a plain ES6 component: `npm run component:es6`
  * For a ReactJS component: `npm run component:react`
  * For an AngularJS component: `npm run component:ng`
  
It will ask for component name and then create the skeleton for you.

### Is Lodash or Underscore available?

Instead of utility libraries Ring UI uses new features of *ES2015* and beyond provided by [Babel.js](https://babeljs.io) and [core-js](https://github.com/zloirock/core-js/). Polyfills like `Array.prototype.find` that patch native objects should be imported manually (e.g. via `import 'core-js/modules/es6.array.find';`).

### Is jQuery available?

Instead of jQuery Ring UI uses modern DOM APIs and some handy helpers located in the `dom` component. `jqLite` is still available for Angular.js components, however, using it is not recommended.

### Wallaby support

To enable the `Wallaby.js` test runner follow these steps:
 
1. Download and install the [Wallaby.js plugin](https://wallabyjs.com/) for WebStorm.
2. Make sure Node.js is available at `/usr/local/bin/node`, if not – create a symlink.  
3. Run the `Wallaby` configuration in WebStorm.

### Visual regression testing

Run the development server with `npm start` before executing the commands listed below*

Ring UI uses [Hermione](https://github.com/gemini-testing/hermione) for visual regression testing. Hermione works by taking screenshots and comparing them to existing reference images. 

We use [BrowserStack](https://www.browserstack.com/) as a cloud Selenium grid. In order to use it on your local machine, you need to have a BrowserStack account. 
Credentials can be gathered on [this page](https://www.browserstack.com/accounts/settings).

**If you don't have credentials, ask project contributors how can you get them.**

Set your username and access token as environment variables:
```
export BROWSERSTACK_NAME=yourlogin
export BROWSERSTACK_KEY=yourkey
```
 
 Or prepend these variables before your commands:
 `BROWSERSTACK_NAME=**** BROWSERSTACK_KEY=**** npm run hermione-test`

After you make some visual changes, run `npm run hermione-test` to make sure there are no regressions.

To update the reference images for a certain component (for example, `alert`):
`npm run hermione-gather -- -- --grep Components/Alert`.

### Accessibility audit

It is very important for web components to be accessible for everyone. We have some accessibility tests set up.

To check current status on CI you may check [teamcity configuration](https://teamcity.jetbrains.com/buildConfiguration/JetBrainsUi_RingUi_A11yAudit).

To run tests locally, run `npm run a11y-audit`. Also, there is "Accessibility" tab on storybook pages, 
so every component could be inspected via running storybook (`npm start`) and then checking this tab.
