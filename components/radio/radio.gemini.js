/* global gemini: false */

gemini.suite('Radio button', suite => {
  suite.
    setUrl('/radio/radio-button.html').
    setCaptureElements('#container').
    capture('radio button');
});
