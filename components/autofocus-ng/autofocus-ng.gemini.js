/* eslint-disable no-var */
/* eslint-disable modules/no-cjs */

var gemini = require('gemini');

gemini.suite('Autofocus', function () {
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
