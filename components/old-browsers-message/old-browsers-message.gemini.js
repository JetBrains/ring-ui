/* global gemini: false */

gemini.suite('old-browsers-message', suite => {
  suite.
    setUrl('/old-browsers-message/old-browsers-message.html').
    setCaptureElements('.ring-old-browsers-message').
    capture('plain');
});
