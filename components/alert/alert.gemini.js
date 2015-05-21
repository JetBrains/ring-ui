var gemini = require('gemini');

gemini.suite('Alert', function(suite) {
  suite
    .setUrl('/example-alert/index.html')
    .setCaptureElements('body > div')
    .capture('plain');
});
