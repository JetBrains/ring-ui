/* global gemini: false */

gemini.suite('Table', suite => {
  suite.setUrl('/table/table.html');

  suite.setCaptureElements('table');

  suite.capture('table');

  suite.capture('with a caption', (actions, find) => {
    actions.click(find('#button-with-a-caption button'));
  });

  suite.capture('non-selectable', (actions, find) => {
    actions.click(find('#button-with-a-caption button'));
    actions.click(find('#button-non-selectable button'));
  });

  suite.capture('bulgaria', (actions, find) => {
    actions.click(find('#button-non-selectable button'));
    actions.click(find('#button-select-bulgaria button'));
  });
});
