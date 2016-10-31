/* global gemini: false */

gemini.suite('Button Toolbar', suite => {
  suite.
    setUrl('/example-button-toolbar/').
    setCaptureElements('#button-toolbar').
    capture('button-toolbar');
});
