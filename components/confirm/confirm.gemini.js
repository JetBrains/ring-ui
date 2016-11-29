/* global gemini: false */

gemini.suite('Confirm', suite => {
  suite.
    setUrl('/example-confirm/').
    setCaptureElements('*[data-test=ring-dialog]').
    capture('confirm');
});
