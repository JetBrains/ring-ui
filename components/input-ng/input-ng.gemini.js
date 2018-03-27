/* global gemini: false */
const ANIMATION_DELAY = 1000;

gemini.suite('Input Ng', suite => {
  suite.
    setUrl('input-ng/input-ng.html').
    setCaptureElements('[data-test=inputs]').
    capture('inputs', actions => actions.wait(ANIMATION_DELAY));
});
