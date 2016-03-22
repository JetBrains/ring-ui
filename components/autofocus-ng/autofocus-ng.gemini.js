/* eslint-disable no-var */
/* eslint-disable modules/no-cjs */

var gemini = require('gemini');

gemini.suite('Autofocus', function (parent) {
  parent.before(function (actions) {
    actions
      .executeJS(function (window) {
        window.focus();
      });
  });

  gemini.suite('On input', function (child) {
    child
      .setUrl('/example-autofocus')
      .setCaptureElements('input[rg-autofocus]')
      .capture('autofocused-input');
  });

  gemini.suite('On select', function (child) {
    child
      .setUrl('/example-autofocus-on-select')
      .setCaptureElements('.ring-select')
      .capture('autofocused-select');
  });
});
