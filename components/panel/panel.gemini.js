/* global gemini: false */

gemini.suite('Panel', suite => {
  suite.
    setUrl('/panel/panel.html').
    setCaptureElements('body > div').
    capture('panel');
});
