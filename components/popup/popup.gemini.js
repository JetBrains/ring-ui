/* eslint-disable no-var */
/* eslint-disable modules/no-cjs */

var gemini = require('gemini');

gemini.suite('Popup', function () {
  gemini.suite('Popups', function (child) {
    child
      .setUrl('/example-popup')
      .setCaptureElements(['#target1', '#target2', '#target3', '#target4'])
      .capture('popup-different-directions');
  });

  gemini.suite('Autoposition', function (child) {
    child
      .setUrl('/example-popup-autoposition/')
      .setCaptureElements(['#leftSide', '#rightSide', '#downSide', '#topSide'])
      .capture('popup-autoposition');
  });
});
