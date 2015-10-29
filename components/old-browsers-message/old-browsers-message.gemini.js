var gemini = require('gemini');

gemini.suite('Old-browser-message', function (suite) {
  suite
    .setUrl('/example-old-browsers-message/')
    .setCaptureElements('.ring-old-browsers-message')
    .capture('plain');
});
