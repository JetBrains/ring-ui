---
collection: docs
title: Breaking Changes
order: 2
---

See the “breaking change” commits [in Upsource](https://upsource.jetbrains.com/ring-ui/view?query=path:%20%7B%2A%2Fbreaking-changes.md%7D%20and%20not%20%22Wording%22).  

### 02-11-2015: Auth: Hub 1.0 defaults applied

* `redirect` param in Auth is now `false` by default
* `redirect` param in Auth hasn't `background-unsafe` value anymore, so it should be removed from project's Auth configs 
* Background token refresh always uses `request_credentials` mode `silent`

### 30-10-2015: webpack.config.js does not provide loaders for applications' code anymore, you will need to set up all the necessary loaders in your project configuration.

### 30-10-2015: Icons are now loaded using [svg-sprite-loader](https://github.com/kisenka/svg-sprite-loader). They were also moved to a separate package (RG-550, RG-834)                        

Icon's `glyph` property now accepts URL from loader instead of ID, e.g. `<Icon glyph={require('jetbrains-icons/add.svg')}>`. 

### 30-10-2015: Migration to ES6, React 0.14 and Babel (RG-361, RG-420)                        

jQuery, when.js, and mout are not used anymore. See the detailed [migration guide](http://ring-ui.github.io/migration-to-2.3.0.html).

### 30-10-2015: Components should be addressed by full path                        

E.g. you should use import `ring-ui/components/react-ng/react-ng` instead of `react-ng/react-ng`.

### 29-10-2015: Loader was renamed to LoaderInline to give place to the brand new Loader.

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

It's now required to set `userFields` in the `Auth` config if any fields other than `guest, id, name, profile/avatar/url` are needed in auth.requestUser.
Please note that you need to explicitly specify `profile` sub-fields to request them, specifying `profile` won't do anything.     

Example:
```js
var auth = new Auth({
  serverUri: 'http://localhost/',
  userFields: ['login', 'profile/email']
});
```
