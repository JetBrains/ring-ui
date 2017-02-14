/* global gemini: false */

gemini.suite('Text', suite => {
  suite.
    setUrl('/text/text.html').
    setCaptureElements('#text').
    capture('text');
});
