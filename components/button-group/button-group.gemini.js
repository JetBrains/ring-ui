/* global gemini: false */

gemini.suite('Button Group', suite => {
  suite.
    setUrl('button-group/button-group.html').
    setCaptureElements('#button-groups').
    capture('button-group');
});
