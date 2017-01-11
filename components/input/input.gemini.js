/* global gemini: false */

gemini.suite('Input', suite => {
  suite.
    setUrl('/input/input.html').
    setCaptureElements('#inputs').
    capture('input', actions => actions.wait(1000));
});
