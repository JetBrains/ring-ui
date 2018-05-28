/* global gemini: false */

gemini.suite('Icon Ng', suite => {
  suite.
    setUrl('icon-ng/icon-ng.html?block-animations').
    setCaptureElements('body > div').
    capture('icons');
});
