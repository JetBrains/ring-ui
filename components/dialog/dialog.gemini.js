/* global gemini: false */

gemini.suite('Dialog', suite => {
  suite.
    setUrl('/dialog/dialog.html').
    setCaptureElements('*[data-test=ring-dialog]').
    capture('dialog');
});
