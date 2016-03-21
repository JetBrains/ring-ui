/* eslint-disable no-var */
/* eslint-disable modules/no-cjs */

var gemini = require('gemini');

gemini.suite('ButtonNg', function (suite) {
  suite
    .setUrl('/example-button-ng/')
    .setCaptureElements('body > div')
    // Only first element in selector is ignored
    .ignoreElements(
      'p:nth-child(1) .ring-button_loader',
      'p:nth-child(2) .ring-button_loader',
      'p:nth-child(3) .ring-button_loader',
      'p:nth-child(5) .ring-button_loader',
      'p:nth-child(6) .ring-button_loader'
    )
    .capture('buttons');
});
