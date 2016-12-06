/* global gemini: false */

gemini.suite('Alert Container', suite => {
  suite.
    setUrl('/example-alert-container/index.html').
    setCaptureElements('*[data-test="alert-container"]').
    capture('plain');
});
