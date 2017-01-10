/* global gemini: false */

gemini.suite('Island', suite => {
  suite.
    setUrl('/island/island.html').
    setCaptureElements('*[data-test=ring-island]').
    capture('island');
});
