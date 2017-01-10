/* global gemini: false */

gemini.suite('LinkNg', suite => {
  suite.
    setUrl('/link-ng/link-ng.html').
    setCaptureElements('#link').
    capture('link-ng', (actions, find) => {
      // Click on div to avoid unexpected hover on link
      actions.click(find('#link'));
    }).
    capture('link-ng hovered', (actions, find) => {
      // Mousemove doesn't work in Chrome for some reason
      actions.focus(find('.ring-link'));
    });
});
