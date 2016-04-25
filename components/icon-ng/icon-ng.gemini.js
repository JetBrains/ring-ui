/* eslint-disable no-var */
/* eslint-disable modules/no-cjs */
/* eslint-disable prefer-reflect */

var gemini = require('gemini');

gemini.suite('IconNg', function (suite) {
  suite
    .setUrl('/example-icon-ng/')
    .setCaptureElements('body > div')
    .capture('icons', function (actions) {
      actions.executeJS(function () {
        // Disable loading buttons (ignore is too slow on IE)
        Array.prototype.forEach.call(document.querySelectorAll('.ring-icon_loading'), function (node) {
          node.classList.remove('ring-icon_loading');
        });
      });
    });
});
