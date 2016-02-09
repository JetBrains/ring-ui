/* eslint-disable no-var */
/* eslint-disable modules/no-cjs */

var gemini = require('gemini');
var ANIMATION_IGNORE_TOLERANCE = 40;

gemini.suite('ButtonNg', function (suite) {
  console.log(suite.executeJS)
  suite
    .setTolerance(ANIMATION_IGNORE_TOLERANCE)
    .setUrl('/example-button-ng')
    .setCaptureElements('body > div')
    .capture('buttons');
});
