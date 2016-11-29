/* global gemini: false */

gemini.suite('Confirm', suite => {
  suite.
    setUrl('/example-confirm/').
    setCaptureElements('.ring-dialog__container').
    capture('confirm');
});
