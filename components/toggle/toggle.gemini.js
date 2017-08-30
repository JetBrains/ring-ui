/* global gemini: false */

gemini.suite('Toggle', suite => {
  suite.
    setUrl('/toggle/toggle.html').
    setCaptureElements('#toggle').
    capture('toggle');
});
