/* global gemini: false */

gemini.suite('Button', suite => {
  suite.
    setUrl('button/button.html?block-animations').
    setCaptureElements('#buttons', '#dark').
    capture('button');
});
