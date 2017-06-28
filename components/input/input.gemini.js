/* global gemini: false */
const ANIMATION_DELAY = 1000;

gemini.suite('Input', suite => {
  suite.
    setUrl('/input/input.html').
    setCaptureElements('#inputs').
    capture('input', actions => actions.wait(ANIMATION_DELAY));
});
