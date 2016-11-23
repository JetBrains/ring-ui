/* global gemini: false */

gemini.suite('Button', suite => {
  suite.
    setUrl('/example-button/').
    setCaptureElements('#buttons').
    capture('button');
});
