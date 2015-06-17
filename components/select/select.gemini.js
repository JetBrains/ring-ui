var gemini = require('gemini');

gemini.suite('Select', function () {
  gemini.suite('Input based select', function (child) {
    child
      .skip('firefox')
      .setUrl('/example-simple-input-based-select')
      .setCaptureElements('.ring-select', '.ring-popup')
      .capture('selectPopup', function (actions, find) {
        actions.click(find('.ring-input'));
      });
  });

  gemini.suite('Select button', function (child) {
    child
      .setUrl('/example-select-with-customized-filter-and-an-add-item-button')
      .setCaptureElements('.ring-select')
      .capture('button');
  });

  gemini.suite('Select with filter', function (child) {
    child
      .skip('firefox')
      .setUrl('/example-simple-select-with-default-filter-mode')
      .setCaptureElements('.ring-select', '.ring-popup')
      .capture('selectPopup', function (actions, find) {
        actions.click(find('.ring-select'));
        actions.click(find('.ring-popup .ring-input'));
      });
  });

});
