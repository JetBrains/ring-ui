/* global gemini: false */

gemini.suite('Link', suite => {
  suite.
    setUrl('/link/link.html').
    setCaptureElements('#link').
    capture('link', (actions, find) => {
      // Move to bottom rigth corner of the page to avoid unexpected hover on link
      actions.mouseMove(find('body'), {x: 800, y: 1024});
    });
});
