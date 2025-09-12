## [8.0 Beta — work in progress]

### BREAKING CHANGES

#### Removed deprecated type exports

- **ProgressBar**: Removed `ProgressBarAttrs` export type
  - **Migration**: Use `ProgressBarProps` instead
  - **Reason**: `LibraryManagedAttributes` utility is no longer needed for functional components

### Dev experience changes


## [7.0.61]
- Renamed some global files to kebab-case (`global/composeRefs.ts -> global/compose-refs.ts`, `link/clickableLink.tsx -> link/clickable-link.tsx`), old names are deprecated.

## [7.0.0]

### BREAKING CHANGES
- Removed compensation margins in Icon to better match Figma [28c0869](https://github.com/JetBrains/ring-ui/commit/28c0869302784d12fbe8587510fc3258c626e382)
- `caps` prop no longer supported in Heading [0547783](https://github.com/JetBrains/ring-ui/commit/05477832d8a00707ac5ada5bbd47f768f846548e)
- `composeRefs` utility is removed. Please use `createComposeRefs()` to get a memoized composer function [9a28d41](https://github.com/JetBrains/ring-ui/commit/9a28d4166cb5b4cb55002be0843f66a3454c46fd)
- deprecated `setClient` utility is removed
- `<Table/>`: `SelectionItem` interface dones't have indexing type anymore [#7853](https://github.com/JetBrains/ring-ui/pull/7853)
- Header: `TrayIcon` is renamed to `HeaderIcon` [ebddeda](https://github.com/JetBrains/ring-ui/commit/ebddedac6f38bd9c910a529e14ab60028c9738bd)
- `palette.css` is removed [9a28d41](https://github.com/JetBrains/ring-ui/commit/9a28d4166cb5b4cb55002be0843f66a3454c46fd)
- Table: `wideFirstColumn` is now `false` by default [9a28d41](https://github.com/JetBrains/ring-ui/commit/9a28d4166cb5b4cb55002be0843f66a3454c46fd)
- Tag: `angled` prop is removed [9a28d41](https://github.com/JetBrains/ring-ui/commit/9a28d4166cb5b4cb55002be0843f66a3454c46fd)
- propTypes are removed in favor of TypeScript [#7625](https://github.com/JetBrains/ring-ui/pull/7625)
- Button `text` prop now behaves in the same way as `inline`, it removes paddings and borders and inherits the font size and line height from parent. The `text` prop is deprecated in favor of `inline`. `inline` prop is false by default for buttons without icons and true for buttons with icons. [847c71a](https://github.com/JetBrains/ring-ui/commit/847c71a078f3af19277418b05daec088d7db5e52)
- `island-legacy` and `table-legacy` components are removed [#7875](https://github.com/JetBrains/ring-ui/pull/7875)
- `Tag` now doesn't show "cross" icon if `onRemove` callback is not passed [#7895](https://github.com/JetBrains/ring-ui/pull/7895)
- `Badge` component is removed, use `Tag` instead [#7895](https://github.com/JetBrains/ring-ui/pull/7895)

## [6.0.0](https://youtrack.jetbrains.com/issue/RG-2303/Release-Ring-UI-6.0)

### BREAKING CHANGES
- All AngularJS components has been removed
- Pre-built components (located in "dist") folder has been extracted into separate package, [@jetbrains/ring-ui-built](https://www.npmjs.com/package/@jetbrains/ring-ui-built). For details, see [RG-2304](https://youtrack.jetbrains.com/issue/RG-2304)
- Minimum supported React version is 18.0.0. `setClient` utility is deprecated and will be removed in 7.0
- `--ring-border-unselected-disabled-color` CSS custom property is removed. Use `--ring-border-disabled-color` instead.
- `List.ListProps.Dimension` is now a plain object instead of an enum
- "Auth landing page" component has been removed
- `Markdown` component now only provides styling, not the rendering logic. See [RG-2310](https://youtrack.jetbrains.com/issue/RG-2310). Here [are some examples of user-side markdown rendering](https://github.com/JetBrains/ring-ui/blob/master/src/markdown/markdown.stories.tsx).
  - `UserAgreement` component has also dropped support for Markdown rendering. If you use it with Markdown content, you would have to render markdown yourself.
- `<Link/>` component now has no inner `<span/>`, see [RG-2311](https://youtrack.jetbrains.com/issue/RG-2311)
- HTTP component's typing has been updated to be more strict (no more "any"). See [commit](https://github.com/JetBrains/ring-ui/pull/6585/commits/cc42d73d3c65db49ab5703cf335c3a6d124b60cd)
- Deprecated parts of Analytics component has been deleted. See [commit](https://github.com/JetBrains/ring-ui/pull/6585/commits/61ce0684cd0b8c1e16529b0f6580ba066fc6b13a)

### Other changes
- Dark theme colors has been updated. See [RG-2306](https://youtrack.jetbrains.com/issue/RG-2306)
- Toggles has been updated [RG-2312](https://youtrack.jetbrains.com/issue/RG-2312/Update-Dark-Mode-Toggles-Color)

## [5.0.0]

### BREAKING CHANGES
- Design of some components is changed, see [RG-2156](https://youtrack.jetbrains.com/issue/RG-2156). By default, controls (buttons, inputs etc.) have 28px height. To bring back the old compact 24px height, wrap your app into `ControlsHeightContext.Provider`:
  ```js
  import {ControlsHeight, ControlsHeightContext} from '@jetbrains/ring-ui/components/global/controls-height';

  <ControlsHeightContext.Provider value={ControlsHeight.S}>
    <App />
  </ControlsHeightContext.Provider>
  ```
- Input: removed `compact` and `renderUnderline` props
- Select: removed `Type.MATERIAL`
- Toggle: added `Size.Size14` which is the new default
- Button Group: caption should be pllaced outside of the group
  ```
  // Before
  <ButtonGroup>
    <Caption>Side:</Caption>
    <Button>Left</Button>
    <Button>Right</Button>
  </ButtonGroup>
  
  // After
  <>
    <Caption>Side:</Caption>
    <ButtonGroup>
      <Button>Left</Button>
      <Button>Right</Button>
    </ButtonGroup>
  </>
  ```
- Components no longer accept `theme` prop, themes are managed using CSS Custom Properties instead. To apply a theme to your app or some part of it, wrap it into `ThemeProvider`:
  ```js
  import Theme, {ThemeProvider} from '@jetbrains/ring-ui/components/global/theme';

  <ThemeProvider theme={Theme.DARK}>{children}</ThemeProvider>
  ```
  
  If you still need to apply theme to the global scope, here is a solution:
  ```js
    import Theme, {applyTheme} from '@jetbrains/ring-ui/components/global/theme';
  
    applyTheme(Theme.DARK, document.body);
  ```
  You can also pass `Theme.AUTO` to use the user-defined system theme.
  The only exceptions are the components that provide dark context by default: Alert, Header, Message. Those still accept a `theme` prop.
- `--ring-dark-*` CSS custom properties are removed, `--ring-dark-text-color` is renamed to `--ring-white-text-color`
- `--ring-message-background-color` is removed in favor of `--ring-popup-background-color`
- The codebase has migrated to TypeScript
- `react-markdown` has been updated to v7, which affects the props of `Markdown` component. The most notable change is replacing `source` with `children`:
  ```js
  // before
  <Markdown source="some markdown" />
  
  // after
  <Markdown>some markdown</Markdown>
  ```
  See `react-markdown`'s [changelog](https://github.com/remarkjs/react-markdown/blob/main/changelog.md#600---2021-04-15) for other changes
- Removed `core-js@2` support
- Removed `webpack@4` support

## [4.2.0]

### React 18 support

To enable the new root API, add the following code before any rendering:
```js
import * as client from 'react-dom/client'
import {setClient} from '@jetbrains/ring-ui/components/global/react-render-adapter'

setClient(client)
```

## [4.1.0]

### Pre-built version

Ring UI now comes with pre-built version in `@jetbrains/ring-ui/dist` directory. 
This addresses the following issues:

* does not require using specific bundler (WebPack) anymore
* does not require dealing with Ring UI building configuration
* decreases your project build time

See "README.md" for quick start with pre-built version

## [4.0.0]

### BREAKING CHANGES
- `WebPack 4` is no longer supported. Please upgrade your project to use `WebPack@>=5`.
- `Code` no longer preloads any language highlighting. It's loaded lazily using dynamic imports instead. You can still preload the languages you need with `highlight.registerLanguage`, see https://jetbrains.github.io/ring-ui/master/index.html?path=/docs/components-code--basic. If you used the following line in your webpack config to reduce the bundle size, please remove it:
    ```js
    new webpack.NormalModuleReplacementPlugin(/@jetbrains\\/ring-ui\\/components\\/code\\/highlight.js$/, './highlight-lazy.js')
    ```
- `date-picker` has migrated from `moment` to `date-fns`. All the props deprecated in 3.1.0 are now removed. `onDateChange` is renamed back to `onChange` and will be removed in 5.0.
- `svg-inline-loader` is not used by Ring UI anymore. Consider installing and using own instance if needed:
  1. `npm install svg-inline-loader -D`
  2. Configure loader like this: 
  ```js
  {
    test: /\.svg$/,
    loader: require.resolve('svg-inline-loader'),
    options: {removeSVGTagAttrs: false},
    include: [require('@jetbrains/icons')]
  }
  ```
  Also, Ring UI now imports ["js" versions of](https://github.com/JetBrains/icons/blob/master/CHANGELOG.md#3130-2021-01-27) `@jetbrains/icons`, so you may also want to.
- `rerenderHOC` has no `captureNode` option anymore and is not in charge of capturing reference for wrapped component node. 
  Component must capture and store own node in `this.node` property. 
  See [commit](https://github.com/JetBrains/ring-ui/commit/885c49d90bc00241921da121602817eca43022d2) for more details.
- `@jetbrains/generator-ring-ui` requires `yo` v4 (currently in beta)

#### Moving away from SASS
- `SASS` files are rewritten to `CSS`. If your project imports Ring UI's SCSS files, check same folder for new CSS options.
- `global.scss` is not more available. If you use variables or mixins from this file, please consider having own copy.
  Old version can be found [here](https://github.com/JetBrains/ring-ui/blob/4ec18fa1bb/components/global/global.scss).

## [3.1.0]
Some of the props of `date-picker` are changed or deprecared to allow removing the dependency on `moment` package in v4:
- passing `moment` instance as `date`, `from`, `to`, `minDate`, and `maxDate` props is deprecated. They still accept js `Date` objects, strings, and numeric timestamps
- in `withTime` mode, the time should be passed as a part of `date` prop:
    ```js
    // before
    <DatePicker date="8 January 2020" time="9:45"/>
  
    // after
    <DatePicker date="8 January 2020, 9:45"/>
    ```
- `displayFormat`, `displayMonthFormat`, and `displayDateFormat` now accept a function of type `Date => string` instead of string
- `inputFormat` is replaced with `parseDateInput` which accepts a function of type `string => Date`
- `onChange` is replaced with `onDateChange` which has a different signature: all `moment` objects are replaced with js `Date` objects. In `withTime` mode, `onDateChange` is called with a single js `Date` object containing both date and time info instead of an object with separate `date` and `time` fields

## [3.0.0]

Minimum required React version is now 16.8.0 (was 16.4.0 before). This allows Ring UI to use hooks and utilities such as `React.memo`.
This release also stopped indirectly using deprecated `React.createFactory` API, which warns since React@16.13.
If your project uses React@16.8.0+, there **are no action required** to be compatible with this release.

## [2.1.20]

The JS part of Ring UI package is now marked as "sideEffect free". This means that webpack will [tree-shake](https://webpack.js.org/guides/tree-shaking/) unused imports of Ring UI files.
Theoretically this may be breaking change, but we don't know any real case yet. We consider advantages of this change are more important 
than potential disadvantages.

## [2.0.2] 

- Due to deprecation, `postcss-cssnext` has been replaced with `postcss-preset-env`.

- `extract-css-vars.js` script has been deprecated in favor of ['importFrom'](https://github.com/csstools/postcss-preset-env#importfrom) option of postcss-preset-env. Please consider using the same approach in your project. 

## [2.0.0] 

- Versions of dependencies are now prepended with a caret (`^`) rather than fixed
- \[Breaking\] `@jetbrains/icons` was updated to `3.0.0` which includes a major rework of icons' shapes and dimensions.
  
  `size`, `width` and `height` props are deprecated in the `Icon` component. The intrinsic size of the icon (`width` and `height` SVG attributes) is used instead.
  
  We strongly recommend to use icons handcrafted for particular sizes. If an icon doesn't exist in the desired size, please ask your designer to draw one. "Responsive" checkmark should be unchecked when exporting an icon.
  
  If you're using your own instance of `svg-inline-loader` make sure to pass `options: {removeSVGTagAttrs: false}` to avoid removing `width` and `height` attributes.

- \[Breaking\] Icons are now aligned to the text baseline out of the box (only when using the following icon sizes: 10px, 14px, 16px, 20px). Previously, `vertical-align: middle;` was used by default which was not great as it required fine-tuning almost every time to achieve perfect alignment. If you have such compensations in your code, please inspect and remove them.

- \[Breaking\] SVG icons are not inlined anymore – Icon and IconNg components don't support sprite IDs. If you are patching svgSpriteLoader, replace `"svgSpriteLoader.include.push(...)"` with `"svgInlineLoader.include.push(...)"`. See [this issue](https://youtrack.jetbrains.com/issue/RG-1646) for details.

- \[Breaking\] Some deprecated SASS files were [removed](https://github.com/JetBrains/ring-ui/commit/b174d82d5c683ebd8716524c8affc880adc7460e): `button.scss`, `icon.scss`, `loader-inline__legacy.scss`.

- \[Breaking\] Some deprecated SASS constants (like `$ring-text-color`) were [removed](https://github.com/JetBrains/ring-ui/commit/4ec18fa1bbd5e069e1e357246893a8511501237a).

## [1.0.0]

- \[Breaking\] New visual language. Most UI components have received significant updates which may require you to update the rest of your application's UI.

- Many components now have a `theme` property that toggles the component's appearance to better fit dark and light backgrounds.

- \[Breaking\] The styles of many components were rewritten from SASS to CSS modules. If you were importing the SASS files directly, you will have to remove those imports and use the corresponding components instead. The complete list of removed SASS files:

  ```
  badge.scss, button-group.scss, button-toolbar.scss, checkbox.scss, link.scss, list.scss, 
  loader.scss, old-browsers-message.scss, popup.scss, query-assist.scss, radio.scss, 
  select-popup.scss, select.scss, tabs.css, tag.scss, tags-input.scss, tooltip.scss
  ```

- \[Breaking\] SASS and `postcss-modules-values-replace` variables were deprecated, CSS custom properties must be used instead. In order to use CSS custom properties in your app, you will need to configure PostCSS as follows:
  ```
   plugins: [
     ...
     require('postcss-custom-properties')({
       preserve: true,
       variables: require('@jetbrains/ring-ui/extract-css-vars')
     })
   ]
  ```

- Babel 7 was introduced.

- The default font-family declaration was changed. Notably, it may now fall back to Segoe UI instead of Helvetica Neue on Windows.

## [0.4.6] — 28-12-2017

- `ErrorBubble` component was reimplemented using `Popup`. While the API did not change, the implementation has changed drastically. If you were relying on the internals (to customize CSS, for example) please review your implementation.

## [0.4.0] — 18-12-2017

- `react-markdown` package was updated to version 3.0 which contains breaking changes. Since the `Markdown` component passes props to `react-markdown`, this constitutes a breaking change for Ring UI itself. See the [details](https://github.com/rexxars/react-markdown/blob/master/CHANGELOG.md#300---2017-11-20).

- [dependencies.io](https://www.dependencies.io/) was set up to help us keep dependencies up-to-date. Most dependencies were updated to latest versions.

## [0.3.8] — 29-11-2017

### Auth improvements
- Embedded login flow is now supported: instead of redirecting to and from Hub to perform authentication, a login form can now be opened in a separate window. Upon successful authentication the service may choose to either reload the page or to partially update the UI without reloading, which results in a more pleasant login experience for the users. To enable the new mode, pass `embeddedLogin: true` to Auth configuration. There's also a new `enableBackendStatusCheck` option that checks if Hub is up and running before opening the login window or making the redirect. This option is enabled by default.

## [0.3.0] — 20-11-2017
### Breaking
- Release 0.3.0 is designed to work with React 16. Moreover, `react` and `react-dom` are no longer `dependencies` but `peerDependencies` — make sure to include them in your project's `dependencies`, if you don't have them already. If your project's `webpack.config.js` includes a `resolve` section for making sure only one copy of React is loaded, it can now be removed.

- `RingComponent`, a base class for all Ring UI components is now gone. The components are now inherited directly from `PureComponent`. If you have your own components using `RingComponent` as the base class, please refactor them:

      // Before
      import React from 'react';
      import RingComponent from '../ring-component/ring-component';
      
      export default class MyComponent extends RingComponent {
        ...
        // RingComponent had its own lifecycle methods, matching the original ones        
        didUpdate(prevProps, prevState) {
        
        }
      }
      
      // After
      import React, {PureComponent} from 'react';
      
      export default class MyComponent extends PureComponent {
        ...
        componentDidUpdate(prevProps, prevState) {
        
        }
      }
      
- If you were relying on the `rerender` method of `RingComponent` (for example, to trigger re-rendering of `date-picker` or `query-assist`), special wrapped versions of those components should be used instead. Those wrapped versions include the `rerender` method for backward compatibility:

      // Before
      import DatePicker from "@jetbrains/ring-ui/components/date-picker/date-picker";
      
      // After
      import {RerenderableDatePicker as DatePicker} from "@jetbrains/ring-ui/components/date-picker/date-picker";
      
### Added

- [Hover mode](http://www.jetbrains.org/ring-ui/dropdown.html#Dropdown%20with%20hover%20mode) was added to `Dropdown`. [Review][RING-UI-CR-2998]
- `user-card` [component](http://www.jetbrains.org/ring-ui/user-card.html) was added. [Review][RING-UI-CR-3016]
- Support for fuzzy search was added to `Select`, pass `props.filter = { fuzzy: true }` to activate. [Review][RING-UI-CR-3037]
- `data-list` component [received a major rewrite](http://www.jetbrains.org/ring-ui/data-list.html). [Review][RING-UI-CR-3042]

### Removed

- `React Ng`, a legacy Angular directive for proxying React components was removed.
- An ability to import SVG icons as components (`import PencilIcon from '@jetbrains/icons/pencil.svg'`) deprecated earlier was removed.

### Internals
- Updated lots of dependencies
- `mout` is no longer a dependency

[0.4.6]: https://upsource.jetbrains.com/ring-ui/compare/%40jetbrains/ring-ui%400.4.5...%40jetbrains/ring-ui%400.4.6
[0.4.0]: https://upsource.jetbrains.com/ring-ui/compare/%40jetbrains/ring-ui%400.3.8...9a4e78c2d33ec82fec05f8b5afc14d081d553798
[0.3.8]: https://upsource.jetbrains.com/ring-ui/compare/%40jetbrains/ring-ui%400.3.1...%40jetbrains/ring-ui%400.3.8
[0.3.0]: https://upsource.jetbrains.com/ring-ui/compare/%40jetbrains/ring-ui%400.2.50...%40jetbrains/ring-ui%400.3.1
[RING-UI-CR-2998]: https://upsource.jetbrains.com/ring-ui/review/RING-UI-CR-2998
[RING-UI-CR-3016]: https://upsource.jetbrains.com/ring-ui/review/RING-UI-CR-3016
[RING-UI-CR-3037]: https://upsource.jetbrains.com/ring-ui/review/RING-UI-CR-3037
[RING-UI-CR-3042]: https://upsource.jetbrains.com/ring-ui/review/RING-UI-CR-3042
       
## [0.2.10] — 22-08-2017
### Added
- `Icon` component now exports icons (`@jetbrains/icons` package) and logos (`@jetbrains/logos`) as React components. A previously introduced feature of importing them directly from packages is deprecated:

      // deprecated, will be removed in 0.3
      import PencilIcon from '@jetbrains/icons/pencil.svg'
      import SearchIcon from '@jetbrains/icons/search.svg'
      import HubLogo from '@jetbrains/logos/hub/hub.svg'
      
      <PencilIcon/>
      <SearchIcon/>
      <HubLogo/>
      
      // Worked before, works now, and will work later
      import pencilIcon from '@jetbrains/icons/pencil.svg'
      import searchIcon from '@jetbrains/icons/search.svg'
      import hubLogo from '@jetbrains/logos/hub/hub.svg'
      import Icon from '@jetbrains/components/icon/icon'
      
      <Icon glyph={pencilIcon}/>
      <Icon glyph={searchIcon}/>
      <Icon glyph={hubLogo}/>
      
      // Works since 0.2.7. This allows to stop patching ring-ui's `svg-sprite-loader` rule in your webpack config.
      import {PencilIcon, SearchIcon} from '@jetbrains/components/icon'
      import {HubLogo} from '@jetbrains/components/icon/logos' // This can dramatically increase your bundle size, so you may want to keep using the above traditional method for logos
      
      <PencilIcon/>
      <SearchIcon/>
      <HubLogo/>
      
      // Also works
      import Icon, {PencilIcon, SearchIcon} from '@jetbrains/components/icon'
      import {HubLogo} from '@jetbrains/components/icon/logos'
      
      <Icon glyph={PencilIcon}/>
      <Icon glyph={SearchIcon}/>
      <Icon glyph={HubLogo}/>
  [Review][RING-UI-CR-2945]
- `Tag`: `disabled` prop was added. [Review][RING-UI-CR-2951]
- `Popup`: a custom container can be passed as a prop. [Review][RING-UI-CR-2941]
- `Dialog`: focus is trapped inside dialog. Tabbing outside of the dialog is blocked.
You can opt out of this behavior by passing `trapFocus={false}`. [Review][RING-UI-CR-2935]

### Changed
- `Select`: after selecting a tag, the input is cleared. [Review][RING-UI-CR-2944]

### Fixed
- "Clear" icon on `Select`'s button was not clickable in Firefox. [Review][RING-UI-CR-2952]
- `svg-sprite-loader` was updated to fix rendering of logos in Firefox. [Review][RING-UI-CR-2942]

[0.2.10]: https://upsource.jetbrains.com/ring-ui/compare/%40jetbrains/ring-ui%400.2.1...%40jetbrains/ring-ui%400.2.10
[RING-UI-CR-2952]: https://upsource.jetbrains.com/ring-ui/review/RING-UI-CR-2952
[RING-UI-CR-2951]: https://upsource.jetbrains.com/ring-ui/review/RING-UI-CR-2951
[RING-UI-CR-2945]: https://upsource.jetbrains.com/ring-ui/review/RING-UI-CR-2945
[RING-UI-CR-2944]: https://upsource.jetbrains.com/ring-ui/review/RING-UI-CR-2944
[RING-UI-CR-2941]: https://upsource.jetbrains.com/ring-ui/review/RING-UI-CR-2941
[RING-UI-CR-2942]: https://upsource.jetbrains.com/ring-ui/review/RING-UI-CR-2942
[RING-UI-CR-2935]: https://upsource.jetbrains.com/ring-ui/review/RING-UI-CR-2935

## [0.2.1] — 11-08-2017
### Fixed
- Include icon-runtime-generator.js into package

[0.2.1]: https://upsource.jetbrains.com/ring-ui/compare/%40jetbrains/ring-ui%400.2.0...%40jetbrains/ring-ui%400.2.1

## [0.2.0] — 11-08-2017
### Added
- SVG icons can be imported directly as React components. They pass props to the `Icon` component.
        
      // Before (and still fully supported)
      import pencilIcon from '@jetbrains/icons/pencil.svg'
      import Icon from '@jetbrains/components/icon/icon'
      
      <Icon
        glyph={pencilIcon}
        size={Icon.Size.Size12}
        title="edit"
      />
      
      // After
      import PencilIcon from '@jetbrains/icons/pencil.svg'
      
      <PencilIcon
        size={PencilIcon.Size.Size12}
        title="edit"
      />
  [Review][RING-UI-CR-2921]
- `baseline` option for `Grid` component. [Review][RING-UI-CR-2913]

### Changed
- `Code` component now comes with a list of highlighed languages. Other languages supported by `highlight.js` can be enabled manually:

      import {highlight} from '@jetbrains/ring-ui/components/code/code'
      import lang1c from 'highlight.js/lib/languages/1c';
      highlight.registerLanguage('1c', lang1c);
   [Review][RING-UI-CR-2914]
- `DataList` component: "show more / less" functionality was fully rewritten. [Review][RING-UI-CR-2908]

### Fixed
- `DataList`: fixed the issue with selection and focus being cleared when toggling a tree element. [Review][RING-UI-CR-2903]
- Various optimizations were applied to reduce app bundle size. [Review][RING-UI-CR-2923]

[0.2.0]: https://upsource.jetbrains.com/ring-ui/compare/%40jetbrains/ring-ui%400.1.2...%40jetbrains/ring-ui%400.2.0
[RING-UI-CR-2903]: https://upsource.jetbrains.com/ring-ui/review/RING-UI-CR-2903
[RING-UI-CR-2908]: https://upsource.jetbrains.com/ring-ui/review/RING-UI-CR-2908
[RING-UI-CR-2913]: https://upsource.jetbrains.com/ring-ui/review/RING-UI-CR-2913
[RING-UI-CR-2914]: https://upsource.jetbrains.com/ring-ui/review/RING-UI-CR-2914
[RING-UI-CR-2921]: https://upsource.jetbrains.com/ring-ui/review/RING-UI-CR-2921
[RING-UI-CR-2923]: https://upsource.jetbrains.com/ring-ui/review/RING-UI-CR-2923

## 0.1.0 — 01-08-2017: Ring UI goes Open Source!

### What changes for the end users
- `@jetbrains/ring-ui` package should be used instead of `ring-ui`.
- Version was reset to `0.1.1`. To install the latest version, run `npm install --save-exact @jetbrains/ring-ui`. 
- You may remove the internal registry line from `.npmrc`.
- Named imports can be used for importing components:
  ```js
  import {Button, Input} from '@jetbrains/ring-ui';

  // You can still import components one by one to reduce bundle size
  import Button from '@jetbrains/ring-ui/components/button/button';
  import Input from '@jetbrains/ring-ui/components/input/input';
  ```
- Change the webpack configuration import (if using one) from `require('ring-ui')` to `require('@jetbrains/ring-ui')`.

### What changes for the contributors
- The commit history has been rewritten. Please clone the repository anew from `ssh://github.com/JetBrains/ring-ui.git`.
- Prepend your commit messages with `[Publish]` to trigger publishing of npm packages.

## Earlier changes

### 27-07-2017: @jetbrains/icons

Private `jetbrains-icons` package was replaced with a public one that is hosted on GitHub and available as `@jetbrains/icons` in npm. Please update your projects accordingly.

### 23-07-2017: borders are used for link underline instead of text-decoration 

This allows to put the underline right below the descenders, so that it doesn't cross them, and make it 1 physical pixel wide on retina displays.

If you use some non-textual content along with text inside `Link` component, you may need to pass a function as a child to `Link`, which would take one argument, `WrapText`, and use it to wrap the text parts (see [example with logo](http://ring-ui.github.io/branch/ring-ui-language/link.html#Link)).

Note that `WrapText` relies on the fact that it's an inline element, so if, for example, you use flexbox layout inside `Link`, you may need an additional div around `WrapText`.

### 23-07-2017: react-virtualized

The render optimisation logic in List component is delegated to [react-virtualized]() library. Now it works even if the List doesn't have a `maxHeight` prop. You may still opt out of the optimization by passing `renderOptimization={false}`.

### 06-07-2017: `expect(smth).to` usage is discouraged in favour of `smth.should`

It's not possible to define `should` property on `null` and `undefined` values, so here's a possible workaround:
```js
// Before
expect(foo).to.not.exist;
expect(foo).to.be.null;
expect(foo).to.not.undefined;


// After
should.not.exist(foo);

// Or, if you want to be more specific
(foo === null).should.be.true;
(foo === undefined).should.be.true;
```

### 04-07-2017: Ring UI is a monorepo

Run `npm run bootstrap` to install all the packages' dependencies and link them between each other where needed.

### 03-07-2017: `header-legacy` component has been removed

Use `header` component instead 

### 24-06-2017: major tests refactoring

#### Enzyme
Airbnb's [enzyme](http://airbnb.io/enzyme) was introduced as a tool for testing React output. Please refer to its [API docs](http://airbnb.io/enzyme/docs/api/) and to the list of `chai-enzyme` [assertions](https://github.com/producthunt/chai-enzyme#table-of-contents).

##### Which helper should I use?
When using enzyme, a tough question is which of the `shallow/mount/render` helpers to use. Here's a simple checklist for that.

* Use `shallow` by default. Basically, it just tests the output of your `render` function and often this can be enough
* Use `mount` when
  1. some DOM APIs are involved
  2. testcase relies on `componentDidMount` or refs being called
  3. testcase uses type and/or props of the component being tested ([example](https://upsource.jetbrains.com/ring-ui/file/87e1889c8d1e1300cf2695c3958e4c5bdb27d1a9/components/progress-bar/progress-bar.test.js?nav=531:579:focused&line=0))
* Use `render` when
  1. the full html output tree is needed
  2. testing the text content of a node
  3. using some complex CSS selector, beyond the [subset](http://airbnb.io/enzyme/docs/api/selector.html) supported by other wrappers
  
One possible workflow is to start with `shallow`, and if something doesn't work as expected, replace with `mount` or `render` based on the checklist.

#### Local variables instead of context
Using context(`this`) in testcases is discouraged in favour of local variables. This allows using arrow functions for all the testcases, which in turn helps to maintain uniformity.

* before:
    ```js
    /* eslint-disable func-names */
    
    describe('Something', () => {
      beforeEach(function() {
        this.foo = makeFoo();
      });
    
      it('testcase using foo', function() {
        this.foo.should.equal(this.foo);
      });
    
      it('testcase not using foo', () => {
        true.should.equal(true);
      });
    })
    ```
* after:
    ```js
    describe('Something', () => {
      let foo;
      beforeEach(() => {
        foo = makeFoo();
      });
    
      it('testcase using foo', () => {
        foo.should.equal(foo);
      });
    
      it('testcase not using foo', () => {
        true.should.equal(true);
      });
    })
    ```
    
Sinon sandbox previously available as `this.sinon` became a global variable `sandbox`.


### 25-05-2017: auth parameters have been uniformly named in camelCase. Support for snake_case parameters has been dropped.

Attempting to pass `client_id`, `redirect_uri`, `request_credentials` will throw an exception. Use `clientId`, `redirectUri`, `requestCredentials` instead.

### 27-04-2017: Unused HeaderAuth component has been removed
Use brand new Header component instead

### 26-04-2017: `stage-0/1` transforms are dropped
The most widely used of them was [`transform-function-bind`](http://babeljs.io/docs/plugins/transform-function-bind/).

* Before: `::this.handleClick`
* After: `this.handleClick.bind(this)`

Often it's better to declare an arrow property function instead of binding a method on each render.

* Before:
    ```js
    class MyComponent extends Component() {
      handleClick(e) {
        ...
      }
    
      render() {
        return <div onClick={::this.handleClick}/>;
      }
    }  
    ```
* After:
    ```js
    class MyComponent extends Component() {
      handleClick = e => {
        ...
      }
    
      render() {
        return <div onClick={this.handleClick}/>;
      }
    }  
    ```

### 20-04-2017: Usage with webpack 1.* is deprecated
This was necessary in order to enable tree-shaking.

### 18-04-2017: Default export hack is dropped
This affects only CommonJS usages.

* Before: `const Button = require('ring-ui/components/button/button');`
* After: `const Button = require('ring-ui/components/button/button').default;`
* Even better: `import Button from 'ring-ui/components/button/button';`

### 13-04-2017: Auth component no longer provides getSecure and getApi methods

Use the brand new `HTTP` component instead. 

Before: 
```js
import Auth from 'ring-ui/components/auth/auth';

const auth = new Auth(authConfig);

const services = auth.requestToken().
      then(token => auth.getApi('services/header', token));
```

After: 
```js
import Auth from 'ring-ui/components/auth/auth';
import HTTP from 'ring-ui/components/http/http';

const auth = new Auth(authConfig);
const http = new HTTP(auth, auth.getAPIPath());

const services = http.get('services/header');
```

### 13-02-2017: Checkbox + ReactNg connection does not support ngModel anymore. Use checkbox-ng instead.

### 13-02-2017: Badge component has no margins anymore and is aligned by baseline

### 20-01-2016: Webpack configuration structure change

In order to migrate to webpack 2, we have to keep webpack.config clean of properties that don't match [the schema](https://github.com/webpack/webpack/blob/028c51301733836abbedc88be7483af2623f5943/schemas/webpackOptionsSchema.json).
Since this change config moved to internal property `config`, and loaders moved to `loaders` properties:

Before: 
```js
require('webpack-config-merger')(require('ring-ui'), {
  ...
});
```

After: 
```js
require('webpack-config-merger')(require('ring-ui').config, {
  ...
});
```

### 18-01-2016: Existing Header moved to legacy folder

Before:

```js
import Header from 'ring-ui/components/header/header';
import HeaderHelper from 'ring-ui/components/header/header__helper';
```

After:

```js
import Header from 'ring-ui/components/header-legacy/header-legacy';
import HeaderHelper from 'ring-ui/components/header-legacy/header-legacy__helper';
```

### 04-01-2016 (2.5.5847): Popup reimplemented
* `Popup` should now be rendered directly, as any other react child
* `anchorElement` becomes optional, the parent DOM element is used as default anchor
* `container` prop isn't used anymore. Instead, for correct positioning inside scrollable containers, scroll events on anchor ancestors are listened to.
* Imperative API is replaced with declarative

Before:
```js
class TogglePopup extends Component {
  renderPopup() {
    this.popup = Popup.renderPopup(
      <Popup
        hidden={false}
        anchorElement={this.refs.button}
        onClose={::this.forceUpdate} // to keep button state in sync with popup
        dontCloseOnAnchorClick={true}
        autoRemove={false}
      >
        <div ref="popupContent" />
      </Popup>
    )
  }
  
  toggle() {
    if (!this.popup) {
      this.renderPopup()
    } else if (this.popup.isVisible()) {
      this.popup.hide()
    } else {
      this.popup.show()
    }
  }
  
  render() {
    return (
      <Button
        ref="button"
        active={this.popup && this.popup.isVisible()}
        onClick={::this.toggle}
      >
        Toggle
      </Button>
    )
  }
}
```

After:
```js
class TogglePopup extends Component {
  state = {hidden: false};
  
  toggle() {
    this.setState(state => ({hidden: !state.hidden}));
  }
  
  render() {
    return (
      <Button
        active={!this.state.hidden}
        onClick={::this.toggle}
      >
        Toggle
        
        // Button becomes anchor here
        <Popup
          hidden={this.state.hidden}
          // This is called on Esc press or outside click. There are also separate handlers for those two events
          onCloseAttempt={() => this.setState({hidden: true})}
          dontCloseOnAnchorClick={true}
        >
          // String refs don't work inside Popup. Use functional refs instead:
          <div
            ref={el => { this.popupContent = el; }}
          />
        </Popup>
      </Button>
    )
  }
}
```

### 05-12-2016: Alert API reimplemented

* There are now two ways to use alerts in React: 1) as a pure component with custom management of alerts' stack (see Alert Container example), and 2) a simple `alert-service`, which should cover most usages.
* Alert now receives the message as its child, not as `caption` prop.
* Alert is now closeable by default.
* Alert now has a `timeout` property to define timeout for `onCloseRequest` call.
* Alert doesn't remove itself anymore. It now calls the `onCloseRequest` callback if it should be removed with an animation. The host component should then set the `isClosing={true}` prop which performs the closing animation and calls the `onClose` callback after it finishes.
* To remove an alert use `{remove, removeWithoutAnimation}` functions from alert-service.
* [Angular] `alert-ng` component was removed – `alert-service` should be used instead.

### 29-11-2016: Several changes to Dialog and Island

* dialog.scss was moved to dialog-ng component because dialog itself has been reimplemented.
* island header and island content now have 32px spacing to suit the most common use case.

### 18-11-2016: All buttons have type="button" by default. To set another type (e.g. "submit") you have to pass it explicitly

### 15-11-2016: Footer no longer supports the "ring-footer_floating" modifier, use "floating" prop instead

Before:
```
<Footer className="ring-footer_floating"/>
```

After:
```
<Footer floating={true}/>
```

### 31-10-2016: ListItem and ListCustom no longer pass all props to DOM elements

Since React prohibits passing non-supported props to DOM elements we now have a whitelist of supported props declared in PropTypes. Other props are no longer passed to `ListItem` and `ListCustom`.

### 29-08-2016: The long-deprecated .ring-input__error-bubble and .ring-form__footer styles were removed

Please migrate to `.ring-error-bubble` and `.ring-panel`

### 25-08-2016: SelectNg requires pack size to be specified in infinite scroll mode

infiniteScrollPackSize should match the value of `$top` REST parameter.

Before:
```
<rg-select ...
           with-infinite-scroll="true">
</rg-select>
```

After:
```
<rg-select ...
           infinite-scroll-pack-size="50">
</rg-select>
```

### 10-08-2016: Introduced new versioning system

To make Ring UI installable with `npm install ring-ui` we have changed the versioning scheme.

Before:
```
2.4.0-4995 (major.minor.patch-build)
```

After:
```
2.4.4996 (major.minor.build)
```

### 29-06-2016: Added "ring-" suffix to the constants in palette/palette.scss

Before:
```
$palette-array, $palette-white-text, $palette-grey-text
```

After:
```
$ring-palette-array, $ring-palette-white-text, $ring-palette-grey-text
```

### 27-05-2016: rgba-attribute mixin was removed

Use rgba colors directly as we no longer support ancient IE versions.

Before:
```
  @include rgba-attribute('border-color', rgba(0, 0, 0, 0.15));
```

After:
```
  border-color: rgba(0, 0, 0, 0.15);
```

### 04-04-2016: Browser requirements for Autoprefixer should be specified in the target project (RG-963)

Place a [`browserslist`](https://github.com/ai/browserslist#config-file) file in your project directory. Default query is `> 1%, last 2 versions, Firefox ESR` which currently resolves to:

```
and_chr 49
and_uc 9.9
android 4.4
chrome 49
chrome 48
edge 13
edge 12
firefox 45
firefox 44
firefox 38
ie 11
ie 10
ie_mob 11
ie_mob 10
ios_saf 9.3
ios_saf 9.0-9.2
ios_saf 8.1-8.4
op_mini 5.0-8.0
opera 36
opera 35
safari 9.1
safari 9
```

### 17-05-2016: ES6! All existing code was converted, new code should be written in ES6 only

### 22-04-2016: Permissions: parameter "config" does not have property config.serviceId, use config.services instead

Before:
```
new Permissions(auth, {serviceId: auth.serviceId})
```

After:
```
new Permissions(auth, {services: [auth.serviceId]})
```

### 20-02-2016: `Button.Modifiers` enum was removed, attributes should be used instead

Before:
```
<Button modifier={Button.Modifiers.BLUE}>{'Button text'}</Button>
```

After:
```
<Button blue={true}>{'Button text'}</Button>
```

### 03-02-2016: `in-space` parameter of `rg-permission` and `rg-permission-if` directives was renamed to `in-project` (RG-750)

Before:
```
<div rg-permission="space-read" in-space="0-0-0-0-0">
 Is visible if user has permission 'read-space' in space 0-0-0-0-0.
</div>
```

After:
```
<div rg-permission="project-read" in-project="0-0-0-0-0">
 Is visible if user has permission 'read-project' in project 0-0-0-0-0.
</div>
```

### 28-01-2016: Changed the way form control sizes are set

To set the size of the form controls, use the `ring-input-size_<size>` class, where `<size>` can be "sx" (50px), "s" (100px), "md" (200px) or "l" (400px).

Before:
```
<div class="ring-form">
  <input class="ring-input"/>
  ...
  <input class="ring-input ring-input_long"/>
</div>
```

After:
```
<div class="ring-form">
  <input class="ring-input ring-input-size_md"/>
  ...
  <input class="ring-input ring-input-size_l"/>
</div>
```

### 28-01-2016: CSS class .ring-form__error-bubble was renamed to .ring-error-bubble

### 11-01-2016: Popup API change: "Corner" and "Direction" props replaced with "Directions" array

The arcane bitwise API was replaced with a more straightforward [direction specification](https://en.bem.info/libs/bem-components/v2.4.0/desktop/popup/#directions-field). "Corner" and "Direction" properties were dropped, "Directions" array was introduced. Example:

Before:
```
props: {
  ...
  Corner: Popup.PopupProps.Corner.BOTTOM_LEFT,
  Direction: Popup.PopupProps.Direction.DOWN | Popup.PopupProps.Direction.RIGHT
  ...
}
```
After:
```
props: {
  ...
  Directions: Popup.PopupProps.Directions.BOTTOM_RIGHT
  ...
}
```

### 22-12-2015: "form-ng__update-text" component was removed

Please use the `rg-save-field` component instead.

### 18-12-2015: "textarea" component was removed

Please use `ring-input` instead.

### 11-12-2015: SVGO is not used in Ring UI anymore, its config has been removed

`jetbrains-icons` (since 1.0.12) and `jetbrains-logos` (since 1.0.5) packages now contain compressed SVG images, so there is no more `RingSVGOConfig` in `webpack.config.js`. Migration path: update `jetbrains-icons` and `jetbrains-logos`.

### 07-12-2015: Changes in markup of ring-input, ring-textarea, error-bubble and ring-form__control (RG-965)

* If ring-input or ring-textarea is used outside of `ring-form__control`, it should have class `ring-input_medium` (`ring-textarea_medium`), otherwise it will have a width of 100%
* Class `ring-input_full-width` renamed to `ring-form__control_full-width` (as `ring-input` is now full-width by default)

### 19-11-2015: LoaderInline was reimplemented

Usages should be updated if you're not using the React component. ([See example](loader-inline.html)).

### 02-11-2015: Auth: Hub 1.0 defaults applied

* `redirect` param in Auth is now `false` by default
* `redirect` param in Auth doesn't have the `background-unsafe` value anymore, so it should be removed from project's Auth configs
* Background token refresh always uses `request_credentials` mode `silent`

### 30-10-2015: webpack.config.js does not provide loaders for applications' code anymore, you will need to set up all the necessary loaders in your project configuration.

### 30-10-2015: Icons are now loaded using [svg-sprite-loader](https://github.com/kisenka/svg-sprite-loader). They were also moved to a separate package (RG-550, RG-834)

Icon's `glyph` property now accepts URL from loader instead of ID, e.g. `<Icon glyph={require('jetbrains-icons/add.svg')}>`.

### 30-10-2015: Migration to ES6, React 0.14 and Babel (RG-361, RG-420)

jQuery, when.js, and mout are not used anymore.

### 30-10-2015: Components should be addressed by full path

E.g. you should use import `ring-ui/components/react-ng/react-ng` instead of `react-ng/react-ng`.

### 29-10-2015: Loader was renamed to LoaderInline to give place to the brand new Loader

LoaderInline is `display: inline-block` by default and shouldn't be used as the main loader anymore.

### 22-05-2015: "user2" icon duplicate removed

### 06-05-2015: Unused filtering functionality removed from `popup-menu` (RG-700)

`filter` property doesn't make sense anymore

### 06-05-2015: `form-ng__update-text` is no more required in `form-ng` (part of RG-676)

`form-ng__update-text` should be required separately from `form-ng` in consuming code

### 28-04-2015: `ring-island` refactoring (RG-662)

* Renamed `_island.scss` to `island.scss`
* Removed `display: block` from the main class and dropped the `.ring-island_inline` modifier completely

### 21-04-2015: Removed deprecated Auth.prototype.isGuest method (RG-644)

Use the `guest` field of the user object instead. It is included by default in `Auth.prototype.requestUser` response.

### 20-04-2015: userFields introduced in Auth config (RG-640)

It's now required to set `userFields` in the `Auth` config if any fields other than `guest, id, name, profile/avatar/url` are needed in auth.requestUser. Please note that you need to explicitly specify `profile` sub-fields to request them, specifying `profile` won't do anything.

Example:
```js
var auth = new Auth({
  serverUri: 'http://localhost/',
  userFields: ['login', 'profile/email']
});
```
