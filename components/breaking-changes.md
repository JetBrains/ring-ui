---
collection: docs
title: Breaking Changes
order: 2
---

See the “breaking change” commits [in Upsource](https://upsource.jetbrains.com/ring-ui/view?query=path:%20%7B%2A%2Fbreaking-changes.md%7D%20and%20not%20%22Wording%22).  

### 06-05-2015: Unused filtering functionality removed from `popup-menu` (RG-700) 

`filter` property doesn't have sense anymore 

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
