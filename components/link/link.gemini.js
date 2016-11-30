/* global gemini: false */

gemini.suite('Link', suite => {
  suite.
    setUrl('/example-link/').
    setCaptureElements('#links').
    capture('link');
});
