/* global gemini: false */

gemini.suite('Button', suite => {
  suite.
    setUrl('/example-button/').
    setCaptureElements('#buttons', '#dark').
    capture('button');
});
