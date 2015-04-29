var gemini = require('gemini');

gemini.suite('Icon', function(suite) {
  suite
    .setUrl('/example-icon/')
    .setCaptureElements('#some-icons')
    .capture('some icons')
    .setCaptureElements('#all-icons')
    .capture('all icons');
});
