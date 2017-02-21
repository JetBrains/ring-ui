/* global gemini: false */

gemini.suite('Link', suite => {
  suite.
    setUrl('/link/link.html').
    setCaptureElements('#link').
    capture('link');
});
