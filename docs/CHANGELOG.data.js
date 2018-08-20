window.source = {
  "title": "Changelog",
  "url": "CHANGELOG.html",
  "type": "md",
  "content": "---\ntitle: Changelog\ncategory: Docs\norder: 2\n---\n\n## [0.4.6] — 28-12-2017\n\n- `ErrorBubble` component was reimplemented using `Popup`. While the API did not change, the\nimplementation has changed drastically. If you were relying on the internals \n(to customize CSS, for example) please review your implementation.\n\n## [0.4.0] — 18-12-2017\n\n- `react-markdown` package was updated to version 3.0 which contains breaking changes. \nSince the `Markdown` component passes props to `react-markdown`, this constitutes a breaking change for Ring UI itself. \nSee the [details](https://github.com/rexxars/react-markdown/blob/master/CHANGELOG.md#300---2017-11-20).\n\n- [dependencies.io](https://www.dependencies.io/) was set up to help us keep dependencies up-to-date. Most dependencies were updated to latest versions.\n\n## [0.3.8] — 29-11-2017\n\n### Auth improvements\n- Embedded login flow is now supported: instead of redirecting to and from Hub to perform authentication, a login form \ncan now be opened in a separate window. Upon successful authentication the service may choose to either reload the page\nor to partially update the UI without reloading, which results in a more pleasant login experience for the users. \nTo enable the new mode, pass `embeddedLogin: true` to Auth configuration. There's also a new `enableBackendStatusCheck` \noption that checks if Hub is up and running before opening the login window or making the redirect. This option is enabled by default.\n\n## [0.3.0] — 20-11-2017\n### Breaking\n- Release 0.3.0 is designed to work with React 16. Moreover, `react` and `react-dom` are no longer `dependencies` but\n`peerDependencies` — make sure to include them in your project's `dependencies`, if you don't have them already. \nIf your project's `webpack.config.js` includes a `resolve` section for making sure only one copy of React is loaded, \nit can now be removed.\n\n- `RingComponent`, a base class for all Ring UI components is now gone. The components are now inherited directly from\n`PureComponent`. If you have your own components using `RingComponent` as the base class, please refactor them:\n\n      // Before\n      import React from 'react';\n      import RingComponent from '../ring-component/ring-component';\n      \n      export default class MyComponent extends RingComponent {\n        ...\n        // RingComponent had its own lifecycle methods, matching the original ones        \n        didUpdate(prevProps, prevState) {\n        \n        }\n      }\n      \n      // After\n      import React, {PureComponent} from 'react';\n      \n      export default class MyComponent extends PureComponent {\n        ...\n        componentDidUpdate(prevProps, prevState) {\n        \n        }\n      }\n      \n- If you were relying on the `rerender` method of `RingComponent` (for example, to trigger re-rendering of `date-picker`\nor `query-assist`), special wrapped versions of those components should be used instead. Those wrapped versions include\nthe `rerender` method for backward compatibility:\n\n      // Before\n      import DatePicker from \"@jetbrains/ring-ui/components/date-picker/date-picker\";\n      \n      // After\n      import {RerenderableDatePicker as DatePicker} from \"@jetbrains/ring-ui/components/date-picker/date-picker\";\n      \n### Added\n\n- [Hover mode](http://www.jetbrains.org/ring-ui/dropdown.html#Dropdown%20with%20hover%20mode) was added to `Dropdown`. [Review][RING-UI-CR-2998]\n- `user-card` [component](http://www.jetbrains.org/ring-ui/user-card.html) was added. [Review][RING-UI-CR-3016]\n- Support for fuzzy search was added to `Select`, pass `props.filter = { fuzzy: true }` to activate. [Review][RING-UI-CR-3037]\n- `data-list` component [received a major rewrite](http://www.jetbrains.org/ring-ui/data-list.html). [Review][RING-UI-CR-3042]\n\n### Removed\n\n- `React Ng`, a legacy Angular directive for proxying React components was removed.\n- An ability to import SVG icons as components (`import PencilIcon from '@jetbrains/icons/pencil.svg'`) deprecated earlier was removed.\n\n### Internals\n- Updated lots of dependencies\n- `mout` is no longer a dependency\n\n[0.4.6]: https://upsource.jetbrains.com/ring-ui/compare/%40jetbrains/ring-ui%400.4.5...%40jetbrains/ring-ui%400.4.6\n[0.4.0]: https://upsource.jetbrains.com/ring-ui/compare/%40jetbrains/ring-ui%400.3.8...9a4e78c2d33ec82fec05f8b5afc14d081d553798\n[0.3.8]: https://upsource.jetbrains.com/ring-ui/compare/%40jetbrains/ring-ui%400.3.1...%40jetbrains/ring-ui%400.3.8\n[0.3.0]: https://upsource.jetbrains.com/ring-ui/compare/%40jetbrains/ring-ui%400.2.50...%40jetbrains/ring-ui%400.3.1\n[RING-UI-CR-2998]: https://upsource.jetbrains.com/ring-ui/review/RING-UI-CR-2998\n[RING-UI-CR-3016]: https://upsource.jetbrains.com/ring-ui/review/RING-UI-CR-3016\n[RING-UI-CR-3037]: https://upsource.jetbrains.com/ring-ui/review/RING-UI-CR-3037\n[RING-UI-CR-3042]: https://upsource.jetbrains.com/ring-ui/review/RING-UI-CR-3042\n       \n## [0.2.10] — 22-08-2017\n### Added\n- `Icon` component now exports icons (`@jetbrains/icons` package) and logos (`@jetbrains/logos`) as React components.\nA previously introduced feature of importing them directly from packages is deprecated:\n\n      // deprecated, will be removed in 0.3\n      import PencilIcon from '@jetbrains/icons/pencil.svg'\n      import SearchIcon from '@jetbrains/icons/search.svg'\n      import HubLogo from '@jetbrains/logos/hub/hub.svg'\n      \n      <PencilIcon/>\n      <SearchIcon/>\n      <HubLogo/>\n      \n      // Worked before, works now, and will work later\n      import pencilIcon from '@jetbrains/icons/pencil.svg'\n      import searchIcon from '@jetbrains/icons/search.svg'\n      import hubLogo from '@jetbrains/logos/hub/hub.svg'\n      import Icon from '@jetbrains/components/icon/icon'\n      \n      <Icon glyph={pencilIcon}/>\n      <Icon glyph={searchIcon}/>\n      <Icon glyph={hubLogo}/>\n      \n      // Works since 0.2.7. This allows to stop patching ring-ui's `svg-sprite-loader` rule in your webpack config.\n      import {PencilIcon, SearchIcon} from '@jetbrains/components/icon'\n      import {HubLogo} from '@jetbrains/components/icon/logos' // This can dramatically increase your bundle size, so you may want to keep using the above traditional method for logos\n      \n      <PencilIcon/>\n      <SearchIcon/>\n      <HubLogo/>\n      \n      // Also works\n      import Icon, {PencilIcon, SearchIcon} from '@jetbrains/components/icon'\n      import {HubLogo} from '@jetbrains/components/icon/logos'\n      \n      <Icon glyph={PencilIcon}/>\n      <Icon glyph={SearchIcon}/>\n      <Icon glyph={HubLogo}/>\n  [Review][RING-UI-CR-2945]\n- `Tag`: `disabled` prop was added. [Review][RING-UI-CR-2951]\n- `Popup`: a custom container can be passed as a prop. [Review][RING-UI-CR-2941]\n- `Dialog`: focus is trapped inside dialog. Tabbing outside of the dialog is blocked.\nYou can opt out of this behavior by passing `trapFocus={false}`. [Review][RING-UI-CR-2935]\n\n### Changed\n- `Select`: after selecting a tag, the input is cleared. [Review][RING-UI-CR-2944]\n\n### Fixed\n- \"Clear\" icon on `Select`'s button was not clickable in Firefox. [Review][RING-UI-CR-2952]\n- `svg-sprite-loader` was updated to fix rendering of logos in Firefox. [Review][RING-UI-CR-2942]\n\n[0.2.10]: https://upsource.jetbrains.com/ring-ui/compare/%40jetbrains/ring-ui%400.2.1...%40jetbrains/ring-ui%400.2.10\n[RING-UI-CR-2952]: https://upsource.jetbrains.com/ring-ui/review/RING-UI-CR-2952\n[RING-UI-CR-2951]: https://upsource.jetbrains.com/ring-ui/review/RING-UI-CR-2951\n[RING-UI-CR-2945]: https://upsource.jetbrains.com/ring-ui/review/RING-UI-CR-2945\n[RING-UI-CR-2944]: https://upsource.jetbrains.com/ring-ui/review/RING-UI-CR-2944\n[RING-UI-CR-2941]: https://upsource.jetbrains.com/ring-ui/review/RING-UI-CR-2941\n[RING-UI-CR-2942]: https://upsource.jetbrains.com/ring-ui/review/RING-UI-CR-2942\n[RING-UI-CR-2935]: https://upsource.jetbrains.com/ring-ui/review/RING-UI-CR-2935\n\n## [0.2.1] — 11-08-2017\n### Fixed\n- Include icon-runtime-generator.js into package\n\n[0.2.1]: https://upsource.jetbrains.com/ring-ui/compare/%40jetbrains/ring-ui%400.2.0...%40jetbrains/ring-ui%400.2.1\n\n## [0.2.0] — 11-08-2017\n### Added\n- SVG icons can be imported directly as React components. They pass props to the `Icon` component.\n        \n      // Before (and still fully supported)\n      import pencilIcon from '@jetbrains/icons/pencil.svg'\n      import Icon from '@jetbrains/components/icon/icon'\n      \n      <Icon\n        glyph={pencilIcon}\n        size={Icon.Size.Size12}\n        title=\"edit\"\n      />\n      \n      // After\n      import PencilIcon from '@jetbrains/icons/pencil.svg'\n      \n      <PencilIcon\n        size={PencilIcon.Size.Size12}\n        title=\"edit\"\n      />\n  [Review][RING-UI-CR-2921]\n- `baseline` option for `Grid` component. [Review][RING-UI-CR-2913]\n\n### Changed\n- `Code` component now comes with a list of highlighed languages.\nOther languages supported by `highlight.js` can be enabled manually:\n\n      import {highlight} from '@jetbrains/ring-ui/components/code/code'\n      import lang1c from 'highlight.js/lib/languages/1c';\n      highlight.registerLanguage('1c', lang1c);\n   [Review][RING-UI-CR-2914]\n- `DataList` component: \"show more / less\" functionality was fully rewritten. [Review][RING-UI-CR-2908]\n\n### Fixed\n- `DataList`: fixed the issue with selection and focus being cleared when toggling a tree element. [Review][RING-UI-CR-2903]\n- Various optimizations were applied to reduce app bundle size. [Review][RING-UI-CR-2923]\n\n[0.2.0]: https://upsource.jetbrains.com/ring-ui/compare/%40jetbrains/ring-ui%400.1.2...%40jetbrains/ring-ui%400.2.0\n[RING-UI-CR-2903]: https://upsource.jetbrains.com/ring-ui/review/RING-UI-CR-2903\n[RING-UI-CR-2908]: https://upsource.jetbrains.com/ring-ui/review/RING-UI-CR-2908\n[RING-UI-CR-2913]: https://upsource.jetbrains.com/ring-ui/review/RING-UI-CR-2913\n[RING-UI-CR-2914]: https://upsource.jetbrains.com/ring-ui/review/RING-UI-CR-2914\n[RING-UI-CR-2921]: https://upsource.jetbrains.com/ring-ui/review/RING-UI-CR-2921\n[RING-UI-CR-2923]: https://upsource.jetbrains.com/ring-ui/review/RING-UI-CR-2923\n\n## 0.1.0 — 01-08-2017: Ring UI goes Open Source!\n\n### What changes for the end users\n- `@jetbrains/ring-ui` package should be used instead of `ring-ui`.\n- Version was reset to `0.1.1`. To install the latest version, run `npm install --save-exact @jetbrains/ring-ui`. \n- You may remove the internal registry line from `.npmrc`.\n- Named imports can be used for importing components:\n  ```js\n  import {Button, Input} from '@jetbrains/ring-ui';\n\n  // You can still import components one by one to reduce bundle size\n  import Button from '@jetbrains/ring-ui/components/button/button';\n  import Input from '@jetbrains/ring-ui/components/input/input';\n  ```\n- Change the webpack configuration import (if using one) from `require('ring-ui')` to `require('@jetbrains/ring-ui')`.\n\n### What changes for the contributors\n- The commit history has been rewritten. Please clone the repository anew from `ssh://github.com/JetBrains/ring-ui.git`.\n- Prepend your commit messages with `[Publish]` to trigger publishing of npm packages.\n\n## Earlier changes\n\n### 27-07-2017: @jetbrains/icons\n\nPrivate `jetbrains-icons` package was replaced with a public one that is hosted on GitHub and available as `@jetbrains/icons` in npm. Please update your projects accordingly.\n\n### 23-07-2017: borders are used for link underline instead of text-decoration \n\nThis allows to put the underline right below the descenders, so that it doesn't cross them, and make it 1 physical pixel wide on retina displays.\n\nIf you use some non-textual content along with text inside `Link` component, you may need to pass a function as a child to `Link`, which would take one argument, `WrapText`, and use it to wrap the text parts (see [example with logo](http://ring-ui.github.io/branch/ring-ui-language/link.html#Link)).\n\nNote that `WrapText` relies on the fact that it's an inline element, so if, for example, you use flexbox layout inside `Link`, you may need an additional div around `WrapText`.\n\n### 23-07-2017: react-virtualized\n\nThe render optimisation logic in List component is delegated to [react-virtualized]() library. Now it works even if the List doesn't have a `maxHeight` prop. You may still opt out of the optimization by passing `renderOptimization={false}`.\n\n### 06-07-2017: `expect(smth).to` usage is discouraged in favour of `smth.should`\n\nIt's not possible to define `should` property on `null` and `undefined` values, so here's a possible workaround:\n```js\n// Before\nexpect(foo).to.not.exist;\nexpect(foo).to.be.null;\nexpect(foo).to.not.undefined;\n\n\n// After\nshould.not.exist(foo);\n\n// Or, if you want to be more specific\n(foo === null).should.be.true;\n(foo === undefined).should.be.true;\n```\n\n### 04-07-2017: Ring UI is a monorepo\n\nRun `npm run bootstrap` to install all the packages' dependencies and link them between each other where needed.\n\n### 03-07-2017: `header-legacy` component has been removed\n\nUse `header` component instead \n\n### 24-06-2017: major tests refactoring\n\n#### Enzyme\nAirbnb's [enzyme](http://airbnb.io/enzyme) was introduced as a tool for testing React output. Please refer to its [API docs](http://airbnb.io/enzyme/docs/api/) and to the list of `chai-enzyme` [assertions](https://github.com/producthunt/chai-enzyme#table-of-contents).\n\n##### Which helper should I use?\nWhen using enzyme, a tough question is which of the `shallow/mount/render` helpers to use. Here's a simple checklist for that.\n\n* Use `shallow` by default. Basically, it just tests the output of your `render` function and often this can be enough\n* Use `mount` when\n  1. some DOM APIs are involved\n  2. testcase relies on `componentDidMount` or refs being called\n  3. testcase uses type and/or props of the component being tested ([example](https://upsource.jetbrains.com/ring-ui/file/87e1889c8d1e1300cf2695c3958e4c5bdb27d1a9/components/progress-bar/progress-bar.test.js?nav=531:579:focused&line=0))\n* Use `render` when\n  1. the full html output tree is needed\n  2. testing the text content of a node\n  3. using some complex CSS selector, beyond the [subset](http://airbnb.io/enzyme/docs/api/selector.html) supported by other wrappers\n  \nOne possible workflow is to start with `shallow`, and if something doesn't work as expected, replace with `mount` or `render` based on the checklist.\n\n#### Local variables instead of context\nUsing context(`this`) in testcases is discouraged in favour of local variables. This allows using arrow functions for all the testcases, which in turn helps to maintain uniformity.\n\n* before:\n    ```js\n    /* eslint-disable func-names */\n    \n    describe('Something', () => {\n      beforeEach(function() {\n        this.foo = makeFoo();\n      });\n    \n      it('testcase using foo', function() {\n        this.foo.should.equal(this.foo);\n      });\n    \n      it('testcase not using foo', () => {\n        true.should.equal(true);\n      });\n    })\n    ```\n* after:\n    ```js\n    describe('Something', () => {\n      let foo;\n      beforeEach(() => {\n        foo = makeFoo();\n      });\n    \n      it('testcase using foo', () => {\n        foo.should.equal(foo);\n      });\n    \n      it('testcase not using foo', () => {\n        true.should.equal(true);\n      });\n    })\n    ```\n    \nSinon sandbox previously available as `this.sinon` became a global variable `sandbox`.\n\n\n### 25-05-2017: auth parameters have been uniformly named in camelCase. Support for snake_case parameters has been dropped.\n\nAttempting to pass `client_id`, `redirect_uri`, `request_credentials` will throw an exception. Use `clientId`, `redirectUri`, `requestCredentials` instead.\n\n### 27-04-2017: Unused HeaderAuth component has been removed\nUse brand new Header component instead\n\n### 26-04-2017: `stage-0/1` transforms are dropped\nThe most widely used of them was [`transform-function-bind`](http://babeljs.io/docs/plugins/transform-function-bind/).\n\n* Before: `::this.handleClick`\n* After: `this.handleClick.bind(this)`\n\nOften it's better to declare an arrow property function instead of binding a method on each render.\n\n* Before:\n    ```js\n    class MyComponent extends Component() {\n      handleClick(e) {\n        ...\n      }\n    \n      render() {\n        return <div onClick={::this.handleClick}/>;\n      }\n    }  \n    ```\n* After:\n    ```js\n    class MyComponent extends Component() {\n      handleClick = e => {\n        ...\n      }\n    \n      render() {\n        return <div onClick={this.handleClick}/>;\n      }\n    }  \n    ```\n\n### 20-04-2017: Usage with webpack 1.* is deprecated\nThis was necessary in order to enable tree-shaking.\n\n### 18-04-2017: Default export hack is dropped\nThis affects only CommonJS usages.\n\n* Before: `const Button = require('ring-ui/components/button/button');`\n* After: `const Button = require('ring-ui/components/button/button').default;`\n* Even better: `import Button from 'ring-ui/components/button/button';`\n\n### 13-04-2017: Auth component no longer provides getSecure and getApi methods\n\nUse the brand new `HTTP` component instead. \n\nBefore: \n```js\nimport Auth from 'ring-ui/components/auth/auth';\n\nconst auth = new Auth(authConfig);\n\nconst services = auth.requestToken().\n      then(token => auth.getApi('services/header', token));\n```\n\nAfter: \n```js\nimport Auth from 'ring-ui/components/auth/auth';\nimport HTTP from 'ring-ui/components/http/http';\n\nconst auth = new Auth(authConfig);\nconst http = new HTTP(auth, auth.getAPIPath());\n\nconst services = http.get('services/header');\n```\n\n### 13-02-2017: Checkbox + ReactNg connection does not support ngModel anymore. Use checkbox-ng instead.\n\n### 13-02-2017: Badge component has no margins anymore and is aligned by baseline\n\n### 20-01-2016: Webpack configuration structure change\n\nIn order to migrate to webpack 2, we have to keep webpack.config clean of properties that don't match [the schema](https://github.com/webpack/webpack/blob/028c51301733836abbedc88be7483af2623f5943/schemas/webpackOptionsSchema.json).\nSince this change config moved to internal property `config`, and loaders moved to `loaders` properties:\n\nBefore: \n```js\nrequire('webpack-config-merger')(require('ring-ui'), {\n  ...\n});\n```\n\nAfter: \n```js\nrequire('webpack-config-merger')(require('ring-ui').config, {\n  ...\n});\n```\n\n### 18-01-2016: Existing Header moved to legacy folder\n\nBefore:\n\n```js\nimport Header from 'ring-ui/components/header/header';\nimport HeaderHelper from 'ring-ui/components/header/header__helper';\n```\n\nAfter:\n\n```js\nimport Header from 'ring-ui/components/header-legacy/header-legacy';\nimport HeaderHelper from 'ring-ui/components/header-legacy/header-legacy__helper';\n```\n\n### 04-01-2016 (2.5.5847): Popup reimplemented\n* `Popup` should now be rendered directly, as any other react child\n* `anchorElement` becomes optional, the parent DOM element is used as default anchor\n* `container` prop isn't used anymore. Instead, for correct positioning inside scrollable containers, scroll events on anchor ancestors are listened to.\n* Imperative API is replaced with declarative\n\nBefore:\n```js\nclass TogglePopup extends Component {\n  renderPopup() {\n    this.popup = Popup.renderPopup(\n      <Popup\n        hidden={false}\n        anchorElement={this.refs.button}\n        onClose={::this.forceUpdate} // to keep button state in sync with popup\n        dontCloseOnAnchorClick={true}\n        autoRemove={false}\n      >\n        <div ref=\"popupContent\" />\n      </Popup>\n    )\n  }\n  \n  toggle() {\n    if (!this.popup) {\n      this.renderPopup()\n    } else if (this.popup.isVisible()) {\n      this.popup.hide()\n    } else {\n      this.popup.show()\n    }\n  }\n  \n  render() {\n    return (\n      <Button\n        ref=\"button\"\n        active={this.popup && this.popup.isVisible()}\n        onClick={::this.toggle}\n      >\n        Toggle\n      </Button>\n    )\n  }\n}\n```\n\nAfter:\n```js\nclass TogglePopup extends Component {\n  state = {hidden: false};\n  \n  toggle() {\n    this.setState(state => ({hidden: !state.hidden}));\n  }\n  \n  render() {\n    return (\n      <Button\n        active={!this.state.hidden}\n        onClick={::this.toggle}\n      >\n        Toggle\n        \n        // Button becomes anchor here\n        <Popup\n          hidden={this.state.hidden}\n          // This is called on Esc press or outside click. There are also separate handlers for those two events\n          onCloseAttempt={() => this.setState({hidden: true})}\n          dontCloseOnAnchorClick={true}\n        >\n          // String refs don't work inside Popup. Use functional refs instead:\n          <div\n            ref={el => { this.popupContent = el; }}\n          />\n        </Popup>\n      </Button>\n    )\n  }\n}\n```\n\n### 05-12-2016: Alert API reimplemented\n\n* There are now two ways to use alerts in React: 1) as a pure component with \ncustom management of alerts' stack (see Alert Container example),\nand 2) a simple `alert-service`, which should cover most usages.\n* Alert now receives the message as its child, not as `caption` prop.\n* Alert is now closeable by default.\n* Alert now has a `timeout` property to define timeout for `onCloseRequest` call.\n* Alert doesn't remove itself anymore. It now calls the `onCloseRequest` callback if it should be removed with an animation. \nThe host component should then set the `isClosing={true}` prop which performs the closing animation and calls the `onClose` callback after it finishes.\n* To remove an alert use `{remove, removeWithoutAnimation}` functions from alert-service.\n* [Angular] `alert-ng` component was removed – `alert-service` should be used instead.\n\n### 29-11-2016: Several changes to Dialog and Island\n\n* dialog.scss was moved to dialog-ng component because dialog itself has been reimplemented.\n* island header and island content now have 32px spacing to suit the most common use case.\n\n### 18-11-2016: All buttons have type=\"button\" by default. To set another type (e.g. \"submit\") you have to pass it explicitly\n\n### 15-11-2016: Footer no longer supports the \"ring-footer_floating\" modifier, use \"floating\" prop instead\n\nBefore:\n```\n<Footer className=\"ring-footer_floating\"/>\n```\n\nAfter:\n```\n<Footer floating={true}/>\n```\n\n### 31-10-2016: ListItem and ListCustom no longer pass all props to DOM elements\n\nSince React prohibits passing non-supported props to DOM elements we now have a whitelist of supported props declared in PropTypes.\nOther props are no longer passed to `ListItem` and `ListCustom`.\n\n### 29-08-2016: The long-deprecated .ring-input__error-bubble and .ring-form__footer styles were removed\n\nPlease migrate to `.ring-error-bubble` and `.ring-panel`\n\n### 25-08-2016: SelectNg requires pack size to be specified in infinite scroll mode\n\ninfiniteScrollPackSize should match the value of `$top` REST parameter.\n\nBefore:\n```\n<rg-select ...\n           with-infinite-scroll=\"true\">\n</rg-select>\n```\n\nAfter:\n```\n<rg-select ...\n           infinite-scroll-pack-size=\"50\">\n</rg-select>\n```\n\n### 10-08-2016: Introduced new versioning system\n\nTo make Ring UI installable with `npm install ring-ui` we have changed the versioning scheme.\n\nBefore:\n```\n2.4.0-4995 (major.minor.patch-build)\n```\n\nAfter:\n```\n2.4.4996 (major.minor.build)\n```\n\n### 29-06-2016: Added \"ring-\" suffix to the constants in palette/palette.scss\n\nBefore:\n```\n$palette-array, $palette-white-text, $palette-grey-text\n```\n\nAfter:\n```\n$ring-palette-array, $ring-palette-white-text, $ring-palette-grey-text\n```\n\n### 27-05-2016: rgba-attribute mixin was removed\n\nUse rgba colors directly as we no longer support ancient IE versions.\n\nBefore:\n```\n  @include rgba-attribute('border-color', rgba(0, 0, 0, 0.15));\n```\n\nAfter:\n```\n  border-color: rgba(0, 0, 0, 0.15);\n```\n\n### 04-04-2016: Browser requirements for Autoprefixer should be specified in the target project (RG-963)\n\nPlace a [`browserslist`](https://github.com/ai/browserslist#config-file) file in your project directory.\nDefault query is `> 1%, last 2 versions, Firefox ESR` which currently resolves to:\n\n```\nand_chr 49\nand_uc 9.9\nandroid 4.4\nchrome 49\nchrome 48\nedge 13\nedge 12\nfirefox 45\nfirefox 44\nfirefox 38\nie 11\nie 10\nie_mob 11\nie_mob 10\nios_saf 9.3\nios_saf 9.0-9.2\nios_saf 8.1-8.4\nop_mini 5.0-8.0\nopera 36\nopera 35\nsafari 9.1\nsafari 9\n```\n\n### 17-05-2016: ES6! All existing code was converted, new code should be written in ES6 only\n\n### 22-04-2016: Permissions: parameter \"config\" does not have property config.serviceId, use config.services instead\n\nBefore:\n```\nnew Permissions(auth, {serviceId: auth.serviceId})\n```\n\nAfter:\n```\nnew Permissions(auth, {services: [auth.serviceId]})\n```\n\n### 20-02-2016: `Button.Modifiers` enum was removed, attributes should be used instead\n\nBefore:\n```\n<Button modifier={Button.Modifiers.BLUE}>{'Button text'}</Button>\n```\n\nAfter:\n```\n<Button blue={true}>{'Button text'}</Button>\n```\n\n### 03-02-2016: `in-space` parameter of `rg-permission` and `rg-permission-if` directives was renamed to `in-project` (RG-750)\n\nBefore:\n```\n<div rg-permission=\"space-read\" in-space=\"0-0-0-0-0\">\n Is visible if user has permission 'read-space' in space 0-0-0-0-0.\n</div>\n```\n\nAfter:\n```\n<div rg-permission=\"project-read\" in-project=\"0-0-0-0-0\">\n Is visible if user has permission 'read-project' in project 0-0-0-0-0.\n</div>\n```\n\n### 28-01-2016: Changed the way form control sizes are set\n\nTo set the size of the form controls, use the `ring-input-size_<size>` class, where `<size>` can be \"sx\" (50px), \"s\" (100px), \"md\" (200px) or \"l\" (400px).\n\nBefore:\n```\n<div class=\"ring-form\">\n  <input class=\"ring-input\"/>\n  ...\n  <input class=\"ring-input ring-input_long\"/>\n</div>\n```\n\nAfter:\n```\n<div class=\"ring-form\">\n  <input class=\"ring-input ring-input-size_md\"/>\n  ...\n  <input class=\"ring-input ring-input-size_l\"/>\n</div>\n```\n\n### 28-01-2016: CSS class .ring-form__error-bubble was renamed to .ring-error-bubble\n\n### 11-01-2016: Popup API change: \"Corner\" and \"Direction\" props replaced with \"Directions\" array\n\nThe arcane bitwise API was replaced with a more straightforward [direction specification](https://en.bem.info/libs/bem-components/v2.4.0/desktop/popup/#directions-field).\n\"Corner\" and \"Direction\" properties were dropped, \"Directions\" array was introduced. Example:\nBefore:\n```\nprops: {\n  ...\n  Corner: Popup.PopupProps.Corner.BOTTOM_LEFT,\n  Direction: Popup.PopupProps.Direction.DOWN | Popup.PopupProps.Direction.RIGHT\n  ...\n}\n```\nAfter:\n```\nprops: {\n  ...\n  Directions: Popup.PopupProps.Directions.BOTTOM_RIGHT\n  ...\n}\n```\n\n### 22-12-2015: \"form-ng__update-text\" component was removed\n\nPlease use the `rg-save-field` component instead.\n\n### 18-12-2015: \"textarea\" component was removed\n\nPlease use `ring-input` instead.\n\n### 11-12-2015: SVGO is not used in Ring UI anymore, its config has been removed\n\n`jetbrains-icons` (since 1.0.12) and `jetbrains-logos` (since 1.0.5) packages now contain compressed SVG images, so there is no more `RingSVGOConfig` in `webpack.config.js`.\nMigration path: update `jetbrains-icons` and `jetbrains-logos`.\n\n### 07-12-2015: Changes in markup of ring-input, ring-textarea, error-bubble and ring-form__control (RG-965)\n\n* If ring-input or ring-textarea is used outside of `ring-form__control`, it should have class `ring-input_medium` (`ring-textarea_medium`),\notherwise it will have a width of 100%\n* Class `ring-input_full-width` renamed to `ring-form__control_full-width` (as `ring-input` is now full-width by default)\n\n### 19-11-2015: LoaderInline was reimplemented\n\nUsages should be updated if you're not using the React component. ([See example](loader-inline.html)).\n\n### 02-11-2015: Auth: Hub 1.0 defaults applied\n\n* `redirect` param in Auth is now `false` by default\n* `redirect` param in Auth doesn't have the `background-unsafe` value anymore, so it should be removed from project's Auth configs\n* Background token refresh always uses `request_credentials` mode `silent`\n\n### 30-10-2015: webpack.config.js does not provide loaders for applications' code anymore, you will need to set up all the necessary loaders in your project configuration.\n\n### 30-10-2015: Icons are now loaded using [svg-sprite-loader](https://github.com/kisenka/svg-sprite-loader). They were also moved to a separate package (RG-550, RG-834)\n\nIcon's `glyph` property now accepts URL from loader instead of ID, e.g. `<Icon glyph={require('jetbrains-icons/add.svg')}>`.\n\n### 30-10-2015: Migration to ES6, React 0.14 and Babel (RG-361, RG-420)\n\njQuery, when.js, and mout are not used anymore.\n\n### 30-10-2015: Components should be addressed by full path\n\nE.g. you should use import `ring-ui/components/react-ng/react-ng` instead of `react-ng/react-ng`.\n\n### 29-10-2015: Loader was renamed to LoaderInline to give place to the brand new Loader\n\nLoaderInline is `display: inline-block` by default and shouldn't be used as the main loader anymore.\n\n### 22-05-2015: \"user2\" icon duplicate removed\n\n### 06-05-2015: Unused filtering functionality removed from `popup-menu` (RG-700)\n\n`filter` property doesn't make sense anymore\n\n### 06-05-2015: `form-ng__update-text` is no more required in `form-ng` (part of RG-676)\n\n`form-ng__update-text` should be required separately from `form-ng` in consuming code\n\n### 28-04-2015: `ring-island` refactoring (RG-662)\n\n* Renamed `_island.scss` to `island.scss`\n* Removed `display: block` from the main class and dropped the `.ring-island_inline` modifier completely\n\n### 21-04-2015: Removed deprecated Auth.prototype.isGuest method (RG-644)\n\nUse the `guest` field of the user object instead. It is included by default in `Auth.prototype.requestUser` response.\n\n### 20-04-2015: userFields introduced in Auth config (RG-640)\n\nIt's now required to set `userFields` in the `Auth` config if any fields other than `guest, id, name, profile/avatar/url` are needed in auth.requestUser.\nPlease note that you need to explicitly specify `profile` sub-fields to request them, specifying `profile` won't do anything.\n\nExample:\n```js\nvar auth = new Auth({\n  serverUri: 'http://localhost/',\n  userFields: ['login', 'profile/email']\n});\n```\n",
  "examples": [],
  "attrs": {
    "title": "Changelog",
    "category": "Docs",
    "order": 2
  }
};