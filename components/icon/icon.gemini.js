/* eslint-disable no-var */
/* eslint-disable modules/no-cjs */

var gemini = require('gemini');

gemini.suite('Icon', function () {
  gemini.suite('Example icons', function (suite) {
    suite
      .setUrl('/example-icon/')
      .setCaptureElements('#some-icons')
      .capture('some icons');
  });

  gemini.suite('All icons', function (suite) {
    suite
      .setUrl('/example-icons-list/')
      .setCaptureElements('#all-icons')
      .capture('all icons');
  });
});
