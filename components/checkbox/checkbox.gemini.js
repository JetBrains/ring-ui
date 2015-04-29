var gemini = require('gemini');

gemini.suite('Checkbox', function(parent) {
  parent.setUrl('/example-checkbox/');

  gemini.suite('Base checkboxes', function (child) {
    child
      .setCaptureElements('#checkbox-base')
      .capture('base checkboxes');
  });

  gemini.suite('Additional checkboxes', function (child) {
    child
      .setCaptureElements('#checkbox-additional')
      .capture('additional checkboxes');
  });
});
