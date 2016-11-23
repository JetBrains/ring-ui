/* global gemini: false */

gemini.suite('Input', suite => {
  suite.
    setUrl('/example-input/').
    setCaptureElements('#inputs').
    capture('input');
});
