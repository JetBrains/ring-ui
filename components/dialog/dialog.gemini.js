/* global gemini: false */

gemini.suite('Dialog', suite => {
  suite.
    setUrl('/dialog/dialog-in-react.html').
    setCaptureElements('*[data-test=ring-dialog]').
    capture('dialog');
});
