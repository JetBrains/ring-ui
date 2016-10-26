/* global gemini: false */

gemini.suite('Palette', suite => {
  suite.
    setUrl('/example-palette/').
    setCaptureElements('#palette').
    capture('palette');
});
