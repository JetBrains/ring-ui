/* global gemini: false */

gemini.suite('Code', suite => {
  suite.
    setUrl('/code/code.html').
    setCaptureElements('#code').
    capture('code');
});
