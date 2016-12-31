/* global gemini: false */

gemini.suite('Badge', suite => {
  suite.
    setUrl('/badge/badge.html').
    setCaptureElements('#badges').
    capture('badge');
});
