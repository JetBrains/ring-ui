/* global gemini: false */

gemini.suite('Palette', suite => {
  suite.
    setUrl('/palette/palette.html').
    setCaptureElements('#palette').
    capture('palette');
});
