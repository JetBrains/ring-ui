/* global gemini: false */

gemini.suite('Checkbox Ng', parent => {
  parent.
    setUrl('/checkbox-ng/checkbox-ng.html').
    setCaptureElements('p').
    capture('default').
    capture('hovered', (actions, find) => {
      actions.mouseMove(find('.ring-checkbox'));
    }).
    capture('checked', (actions, find) => {
      actions.click(find('#checkButton'));
    });

  gemini.suite('disabled', child => {
    child.
      capture('disabled', (actions, find) => {
        actions.click(find('#disableButton'));
      }).
      capture('hovered', (actions, find) => {
        actions.mouseMove(find('.ring-checkbox'));
      }).
      capture('checked-disabled', (actions, find) => {
        actions.click(find('#checkButton'));
      });
  });
});
