/* global gemini: false */

gemini.suite('Panel', suite => {
  suite.
    setUrl('/example-panel/').
    setCaptureElements('body > div').
    capture('panel');
});
