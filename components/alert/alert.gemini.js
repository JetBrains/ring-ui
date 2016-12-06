/* global gemini: false */

gemini.suite('Alert', suite => {
  suite.
    setUrl('/example-alert/index.html').
    setCaptureElements('body > div').
    capture('plain').
    capture('focused', (actions, find) => {
      actions.focus(find('*[data-test="alert-close"]'));
    });
});
