/* global gemini: false */

gemini.suite('Dialog Ng', suite => {
  suite.
    setUrl('/dialog-ng/dialog-ng.html').
    setCaptureElements(['*[data-test=ring-dialog]', '.ring-error-bubble']).
    capture('dialog');
});
