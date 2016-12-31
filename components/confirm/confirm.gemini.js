/* global gemini: false */

gemini.suite('Confirm', suite => {
  suite.
    setUrl('/confirm/confirm.html').
    setCaptureElements('*[data-test=ring-dialog]').
    capture('confirm');
});
