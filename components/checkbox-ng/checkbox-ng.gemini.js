/* eslint-disable no-var */
/* eslint-disable modules/no-cjs */
/* eslint-disable prefer-reflect */

var gemini = require('gemini');

gemini.suite('CheckboxNg', function (parent) {
  parent
    .setUrl('/example-checkbox-ng/')
    .setCaptureElements('p')
    .capture('default')
    .capture('hovered', function (actions, find) {
      actions.mouseMove(find('.ring-checkbox'));
    })
    .capture('checked', function (actions, find) {
      actions.click(find('#checkButton'));
    });

  gemini.suite('disabled', function (child) {
    child
      .capture('disabled', function (actions, find) {
        actions.click(find('#disableButton'));
      })
      .capture('hovered', function (actions, find) {
        actions.mouseMove(find('.ring-checkbox'));
      })
      .capture('checked-disabled', function (actions, find) {
        actions.click(find('#checkButton'));
      });
  });
});
