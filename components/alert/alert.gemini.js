/* global gemini: false */

gemini.suite('Alert', suite => {
  suite.
    setUrl('/alert/alert.html').
    setCaptureElements('body > div').
    capture('plain').
    capture('focused', (actions, find) => {
      actions.focus(find('*[data-test="alert-close"]'));
    });
});

const ANIMATION_DELAY = 600;

gemini.suite('Alert Container', suite => {
  suite.
    setUrl('/alert/alert-container.html').
    setCaptureElements('*[data-test="alert-container"]').
    capture('plain', actions => {
      actions.waitForElementToShow('[data-test=alert]');
      actions.wait(ANIMATION_DELAY);
    });
});
