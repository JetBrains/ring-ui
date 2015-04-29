var gemini = require('gemini');

gemini.suite('Icon', function(parent) {
  parent.setUrl('/example-icon/');

  gemini.suite('Example icons', function (child) {
    child
      .setCaptureElements('#some-icons')
      .capture('some icons');
  });

  gemini.suite('All icons', function (child) {
    child
      .setCaptureElements('#all-icons')
      .capture('all icons');
  });
});
