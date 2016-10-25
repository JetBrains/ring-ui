/* global gemini: false */

gemini.suite('Badge', suite => {
  suite.
    setUrl('/example-badge/').
    setCaptureElements('#badges').
    capture('badge');
});
