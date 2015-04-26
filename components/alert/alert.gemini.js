var gemini = require('gemini');

gemini.suite('Table', function(suite) {
  suite
    .setUrl('/example-alert/index.html')
    .setCaptureElements('.alert-container')
    .capture('plain');
});
