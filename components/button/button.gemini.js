/* global gemini: false */

gemini.suite('Button', suite => {
  suite.
    setUrl('button/button.html').
    setCaptureElements('#buttons', '#dark').
    capture('button');
});
