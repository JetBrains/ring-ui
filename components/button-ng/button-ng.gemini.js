/* eslint-disable no-var */
/* eslint-disable modules/no-cjs */
/* eslint-disable prefer-reflect */

var gemini = require('gemini');

gemini.suite('ButtonNg', function (suite) {
  suite
    .setUrl('/example-button-ng/')
    .setCaptureElements('body > div')
    .capture('buttons', function (actions) {
      actions.executeJS(function () {
        // Disable loading buttons (ignore is too slow on IE)
        Array.prototype.slice.call(document.querySelectorAll('.ring-button_loader')).forEach(function (node) {
          node.classList.remove('ring-button_loader');
        });
      });
    });
});
