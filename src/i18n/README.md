This is localisation layer, that allows to translate the app into different languages.

All messages should be stored in a messages.json, using that format https://www.i18next.com/misc/json-format#i18next-json-v4

### How to use

1. Using your project i18n tooling, construct an object with localised messages, like:
```
// You can use https://ttag.js.org/ for example:
const localised = {
  login: t`Log in`,
  ...
}
```

2. Pass it to i18n singleton, using `setTranslations`. That would provide localisation to non-react components, like Auth.

```
// Your messages object should have loalised strings at that moment
const localised = {
  login: 'Inloggen',
  ...
}

setTranslations(localised);
```

3. [Optional] Add I18nContextHolder into your root tree. 
   If you skip this step, messages from singleton service would be used.
   Note: setTranslations() calls won't cause React tree rerender, so you have to call it before first render.
   If you need to live update your strings, you need to use I18nContextHolder. 

```
  <I18nContextHolder messages={localised}>
    <App />
  </I18nContextHolder>
```  



### Utilities

There is some ways to automate strings extraction from messages.json. You can do:

```
npx i18next-conv -s messages.json -t messages.pot -l en --ctxSeparator "|" --compatibilityJSON v4
```

And get a .pot file, which you can merge with your other sources
