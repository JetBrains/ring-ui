/* global gemini: false */

gemini.suite('Shortcuts hint popup', suite => {
  suite.
    skip('firefox').
    setUrl('/shortcuts-hint-ng/shortcuts-ng-hint-popup.html').
    setCaptureElements('*[data-test="ring-dialog"]').
    capture('dialog');
});
