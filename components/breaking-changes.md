---
collection: docs
title: Breaking Changes
order: 2
---

See list breaking commits [in Upsource](https://upsource.jetbrains.com/ring-ui/view?query=path:%20%7B%2A%2Fbreaking-changes.md%7D).  

### 21-04-2015: Removed deprecated Auth.prototype.isGuest method (RG-644) 

Use `guest` field in user instead (is included in default fields list used by `Auth.prototype.requestUser`).

### 20-04-2015: userFields introduced in Auth config (RG-640) 

It's now required to set userFields Auth's config if fields other than `guest,id,name,profile/avatar/url` are needed in auth.requestUser.
Please note that you need explicitly add `profile` subfields to request them, just `profile` won't do anything.     

Example:
```js
var auth = new Auth({
  serverUri: 'http://localhost/',
  userFields: ['login', 'profile/email']
});
```
