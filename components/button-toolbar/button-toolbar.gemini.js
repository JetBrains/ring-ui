/* global gemini: false */

gemini.suite('Button Toolbar', suite => {
  suite.
    setUrl('/button-toolbar/button-toolbar.html').
    setCaptureElements('#button-toolbar').
    capture('button-toolbar');
});
