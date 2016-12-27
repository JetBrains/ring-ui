/* global gemini: false */

gemini.suite('LinkNg', suite => {
  suite.
    setUrl('/example-link-ng/').
    setCaptureElements('#link').
    capture('link-ng', (actions, find) => {
      // Click on div to avoid unexpected hover on link
      actions.click(find('#link'));
    }).
    capture('link-ng hovered', (actions, find) => {
      actions.mouseMove(find('.ring-link'));
    });
});
