---
collection: docs
title: Breaking Changes
order: 2
---

See the "breaking change" commits [in Upsource](https://upsource.jetbrains.com/ring-ui/view?query=path:%20%7B%2A%2Fbreaking-changes.md%7D).  

### 28-04-2015: island/island.scss renamed and changed (RG-662) 

* Removed leading _ from filename
* Removed `display: block` from main class and `.ring-island_inline` modifier at all

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
